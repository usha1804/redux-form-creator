import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import {
  Build as BuildIcon,
  Visibility as PreviewIcon,
  List as ListIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Drag & Drop Builder',
      description: 'Intuitive drag-and-drop interface for effortless form creation'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Advanced Validation',
      description: 'Comprehensive validation rules including email, password, and custom patterns'
    },
    {
      icon: <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Derived Fields',
      description: 'Smart calculated fields that auto-update based on other form inputs'
    }
  ];

  const actionCards = [
    {
      title: 'Create New Form',
      description: 'Start building your form with our intuitive drag-and-drop builder',
      icon: <BuildIcon sx={{ fontSize: 32 }} />,
      action: () => navigate('/create'),
      color: 'primary.main',
      buttonText: 'Start Building'
    },
    {
      title: 'Preview Forms',
      description: 'Test and preview your forms exactly as users will see them',
      icon: <PreviewIcon sx={{ fontSize: 32 }} />,
      action: () => navigate('/preview'),
      color: 'secondary.main',
      buttonText: 'Preview'
    },
    {
      title: 'My Forms',
      description: 'Manage and organize all your saved forms in one place',
      icon: <ListIcon sx={{ fontSize: 32 }} />,
      action: () => navigate('/myforms'),
      color: 'success.main',
      buttonText: 'View Forms'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Dynamic Form Builder
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Create, customize, and manage beautiful forms with advanced validation and derived fields
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  px: 4,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/myforms')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                View Examples
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}
        >
          Powerful Features
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Action Cards */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}
          >
            What would you like to do?
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {actionCards.map((card, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={card.action}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: `${card.color}15`,
                        color: card.color,
                        mb: 2
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {card.description}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={card.action}
                      sx={{
                        bgcolor: card.color,
                        '&:hover': { bgcolor: card.color, opacity: 0.8 }
                      }}
                    >
                      {card.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Paper
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 4,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Built with React, TypeScript, Redux Toolkit, and Material UI
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            {['React', 'TypeScript', 'Redux', 'Material UI', 'Drag & Drop'].map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            ))}
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Index;
