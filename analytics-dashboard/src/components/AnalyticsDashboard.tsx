import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import PageViewCard from './PageViewCard';
import AnalyticsService from '../services/analytics';

interface PageView {
  page: string;
  count: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const views = await analyticsService.getPageViews();
        // Ensure views is an array
        const pageViewsArray = Array.isArray(views) ? views : Object.entries(views).map(([page, count]) => ({
          page,
          count: Number(count)
        }));
        setPageViews(pageViewsArray);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load page views';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    analyticsService.connect();
    
    // Subscribe to all page views updates
    const unsubscribeAllPageViews = analyticsService.subscribeToAllPageViews((views) => {
      const pageViewsArray = Array.isArray(views) ? views : Object.entries(views).map(([page, count]) => ({
        page,
        count: Number(count)
      }));
      setPageViews(pageViewsArray);
    });

    // Subscribe to individual page updates for each page
    const unsubscribers = pageViews.map(view => 
      analyticsService.subscribeToPageViews(view.page, (updatedView) => {
        setPageViews(prevViews => {
          const index = prevViews.findIndex(v => v.page === updatedView.page);
          if (index >= 0) {
            const newViews = [...prevViews];
            newViews[index] = updatedView;
            return newViews;
          }
          return [...prevViews, updatedView];
        });
      })
    );

    // Check connection status periodically
    const connectionCheck = setInterval(() => {
      setIsConnected(analyticsService.isServerConnected());
    }, 1000);

    return () => {
      unsubscribeAllPageViews();
      unsubscribers.forEach(unsubscribe => unsubscribe());
      analyticsService.disconnect();
      clearInterval(connectionCheck);
    };
  }, []); // Empty dependency array since analyticsService is a singleton

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Not connected to analytics server. Real-time updates will not be available.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      <Grid container spacing={3}>
        {pageViews.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No page views data available</Alert>
          </Grid>
        ) : (
          pageViews.map((view) => (
            <Grid item xs={12} sm={6} md={4} key={view.page}>
              <PageViewCard page={view.page} count={view.count} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard; 