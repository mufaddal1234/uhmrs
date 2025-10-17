import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Features />
            <Testimonials />
            <Pricing />
            <CTA />
          </main>
        } />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;