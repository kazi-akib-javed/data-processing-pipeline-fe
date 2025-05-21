import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TestPage from './components/TestPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

type Page = 'dashboard' | 'test';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Analytics Demo
            </Typography>
            <Button 
              color="inherit" 
              onClick={() => setCurrentPage('dashboard')}
              sx={{ mr: 2 }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => setCurrentPage('test')}
            >
              Test Page
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 2 }}>
          {currentPage === 'dashboard' ? <AnalyticsDashboard /> : <TestPage />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
