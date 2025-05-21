import { io, Socket } from 'socket.io-client';

interface PageView {
  page: string;
  count: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private socket: Socket | null = null;
  private readonly API_URL = 'http://localhost:4200/api';
  private readonly WS_URL = 'http://localhost:4200';  // WebSocket server URL
  private isConnected = false;
  private pageViewCallbacks: ((data: PageView) => void)[] = [];
  private allPageViewsCallbacks: ((data: PageView[]) => void)[] = [];

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  connect() {
    if (!this.socket) {
      console.log('Connecting to WebSocket server at:', this.WS_URL);
      this.socket = io(this.WS_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
        transports: ['websocket','polling'],
        withCredentials: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Set up WebSocket event listeners
      this.socket.on('pageViewUpdate', (data: PageView) => {
        console.log('Received page view update:', data);
        this.pageViewCallbacks.forEach(callback => callback(data));
      });

      this.socket.on('allPageViewsUpdate', (data: PageView[]) => {
        console.log('Received all page views update:', data);
        this.allPageViewsCallbacks.forEach(callback => callback(data));
      });

      // Log all events for debugging
      this.socket.onAny((eventName, ...args) => {
        console.log('WebSocket event received:', eventName, args);
      });
    }
  }

  subscribeToPageViews(page: string, callback: (data: PageView) => void) {
    if (!this.socket) {
      this.connect();
    }
    console.log('Subscribing to page views for:', page);
    this.pageViewCallbacks.push(callback);
    // Emit the subscription event to the server
    this.socket?.emit('subscribePageViews', page, (response: any) => {
      console.log('Subscribe response:', response);
    });
    return () => {
      console.log('Unsubscribing from page views for:', page);
      this.pageViewCallbacks = this.pageViewCallbacks.filter(cb => cb !== callback);
    };
  }

  subscribeToAllPageViews(callback: (data: PageView[]) => void) {
    if (!this.socket) {
      this.connect();
    }
    console.log('Subscribing to all page views');
    this.allPageViewsCallbacks.push(callback);
    // Emit the subscription event to the server
    this.socket?.emit('subscribeAllPageViews', (response: any) => {
      console.log('Subscribe all response:', response);
    });
    return () => {
      console.log('Unsubscribing from all page views');
      this.allPageViewsCallbacks = this.allPageViewsCallbacks.filter(cb => cb !== callback);
    };
  }

  async trackPageView(page: string): Promise<void> {
    try {
      console.log(`Tracking page view for: ${page}`);
      const response = await fetch(`${this.API_URL}/analytics/page-view/${page}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to track page view: ${response.status} ${errorText}`);
      }

      // After successful API call, emit the update through WebSocket
      if (this.socket && this.socket.connected) {
        console.log('Emitting page view update through WebSocket');
        this.socket.emit('pageViewUpdate', { page });
      } else {
        console.warn('WebSocket not connected, cannot emit update');
      }

      console.log('Page view tracked successfully');
    } catch (error) {
      console.error('Error tracking page view:', error);
      throw error;
    }
  }

  async getPageViews(): Promise<PageView[]> {
    try {
      console.log('Fetching page views...');
      const response = await fetch(`${this.API_URL}/analytics/page-views`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch page views: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received page views:', data);
      return data;
    } catch (error) {
      console.error('Error fetching page views:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting from WebSocket server...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.pageViewCallbacks = [];
      this.allPageViewsCallbacks = [];
    }
  }

  isServerConnected(): boolean {
    return this.isConnected;
  }
}

export default AnalyticsService; 