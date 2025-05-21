import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface PageViewCardProps {
  page: string;
  count: number;
}

const PageViewCard: React.FC<PageViewCardProps> = ({ page, count }) => {
  return (
    <Card sx={{ minWidth: 275, height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {page}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" color="primary" gutterBottom>
          {count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Page Views
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PageViewCard; 