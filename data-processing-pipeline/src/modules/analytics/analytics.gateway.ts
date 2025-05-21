import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AnalyticsService } from './analytics.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Updated to match React app's origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AnalyticsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly analyticsService: AnalyticsService) {}

  // Handle page view update from client
  @SubscribeMessage('pageViewUpdate')
  async handlePageViewUpdate(client: Socket, data: { page: string }) {
    console.log('Received page view update from client:', data);
    const count = await this.analyticsService.getCurrentPageViews(data.page);
    // Broadcast to all clients
    this.server.emit('pageViewUpdate', { page: data.page, count });
    console.log('Broadcasted page view update:', { page: data.page, count });
  }

  // Subscribe to page view updates for a specific page
  @SubscribeMessage('subscribePageViews')
  async handleSubscribePageViews(client: Socket, page: string) {
    console.log('Client subscribed to page views:', page);
    // Send initial count
    const count = await this.analyticsService.getCurrentPageViews(page);
    client.emit('pageViewUpdate', { page, count });
    console.log('Sent initial page view update:', { page, count });
    // Subscribe to Redis updates for this page
    const today = new Date().toISOString().split('T')[0];
    const key = `page_views:${page}:${today}`;
    
    // Create a Redis subscriber for this page
    const subscriber = this.analyticsService.getRedisSubscriber();
    await subscriber.subscribe(`__keyspace@0__:${key}`);

    subscriber.on('message', async (channel, message) => {
      if (message === 'incr') {
        const newCount = await this.analyticsService.getCurrentPageViews(page);
        client.emit('pageViewUpdate', { page, count: newCount });
        console.log('Sent page view update:', { page, count: newCount });
      }
    });

    // Clean up subscription when client disconnects
    client.on('disconnect', () => {
      console.log('Client disconnected, cleaning up subscription for page:', page);
      subscriber.unsubscribe();
      subscriber.quit();
    });
  }

  // Subscribe to all page view updates
  @SubscribeMessage('subscribeAllPageViews')
  async handleSubscribeAllPageViews(client: Socket) {
    console.log('Client subscribed to all page views');
    // Send initial counts
    const views = await this.analyticsService.getAllCurrentPageViews();
    client.emit('allPageViewsUpdate', views);
    console.log('Sent initial all page views update:', views);

    // Subscribe to Redis updates for all pages
    const today = new Date().toISOString().split('T')[0];
    const pattern = `page_views:*:${today}`;
    
    // Create a Redis subscriber for all pages
    const subscriber = this.analyticsService.getRedisSubscriber();
    await subscriber.psubscribe(`__keyspace@0__:${pattern}`);

    subscriber.on('pmessage', async (pattern, channel, message) => {
      if (message === 'incr') {
        const views = await this.analyticsService.getAllCurrentPageViews();
        client.emit('allPageViewsUpdate', views);
        console.log('Sent all page views update:', views);
      }
    });

    // Clean up subscription when client disconnects
    client.on('disconnect', () => {
      console.log('Client disconnected, cleaning up all page views subscription');
      subscriber.punsubscribe();
      subscriber.quit();
    });
  }
} 