import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Build as BuildIcon,
  Visibility as PreviewIcon,
  List as ListIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/create', label: 'Builder', icon: <BuildIcon /> },
    { path: '/preview', label: 'Preview', icon: <PreviewIcon /> },
    { path: '/myforms', label: 'My Forms', icon: <ListIcon /> }
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Dynamic Form Builder
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Tooltip key={item.path} title={item.label}>
              <Button
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  borderRadius: 2,
                  px: 2
                }}
              >
                {item.label}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;