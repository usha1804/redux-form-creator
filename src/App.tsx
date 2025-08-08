import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './store/store';
import Header from './components/Layout/Header';
import Index from "./pages/Index";
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import NotFound from "./pages/NotFound";

const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(225, 84%, 55%)',
      light: 'hsl(225, 84%, 65%)',
      dark: 'hsl(225, 84%, 45%)',
    },
    secondary: {
      main: 'hsl(280, 60%, 60%)',
      light: 'hsl(280, 60%, 70%)',
    },
    background: {
      default: 'hsl(245, 50%, 98%)',
      paper: 'hsl(0, 0%, 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

export default App;
