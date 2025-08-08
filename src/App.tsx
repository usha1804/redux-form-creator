import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './store/store';
import { Toaster } from "@/components/ui/sonner";
import Header from './components/Layout/Header';
import Index from "./pages/Index";
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import NotFound from "./pages/NotFound";

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
