import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, Grid, Alert } from '@mui/material';
import AnalyticsService from '../services/analytics';

const TEST_PAGES = [
  { name: 'Home', path: 'home' },
  { name: 'About', path: 'about' },
  { name: 'Products', path: 'products' },
  { name: 'Contact', path: 'contact' },
  { name: 'Blog', path: 'blog' },
];

const TestPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    // Connect to WebSocket when component mounts
    console.log('Connecting to WebSocket...');
    analyticsService.connect();

    // Check connection status periodically
    const connectionCheck = setInterval(() => {
      const connected = analyticsService.isServerConnected();
      console.log('WebSocket connection status:', connected);
      setIsConnected(connected);
    }, 1000);

    return () => {
      console.log('Cleaning up WebSocket connection...');
      clearInterval(connectionCheck);
      analyticsService.disconnect();
    };
  }, []); // Empty dependency array since analyticsService is a singleton

  const handlePageView = async (page: string) => {
    console.log('=== Starting page view tracking ===');
    console.log(`Page to track: ${page}`);
    console.log('WebSocket connected:', analyticsService.isServerConnected());
    
    try {
      console.log('Calling trackPageView...');
      await analyticsService.trackPageView(page);
      console.log('trackPageView completed successfully');
    } catch (error) {
      console.error('Error in handlePageView:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    } finally {
      console.log('=== Completed page view tracking ===');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Page Views
      </Typography>
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Not connected to analytics server. Real-time updates will not be available.
        </Alert>
      )}
      <Typography variant="body1" paragraph>
        Click the buttons below to simulate page views. Each click will increment the view count for that page.
      </Typography>
      <Grid container spacing={2}>
        {TEST_PAGES.map((page) => (
          <Grid item xs={12} sm={6} md={4} key={page.path}>
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                {page.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePageView(page.path)}
                fullWidth
                disabled={!isConnected}
              >
                Simulate View
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestPage; 