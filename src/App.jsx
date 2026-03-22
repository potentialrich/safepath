import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// Lazy load the heavy map component
const NavigationApp = lazy(() => {
  return Promise.all([
    import('./components/NavigationApp'),
    new Promise(resolve => setTimeout(resolve, 1500))
  ]).then(([moduleExports]) => moduleExports);
});

// Extracted landing page to a separate component function inside App.jsx
const LandingPage = () => {
    const navigate = useNavigate();
    
    return (
      <>
        <div className="noise-overlay pointer-events-none"></div>
        <Navbar />
        <main className="relative z-10 w-full overflow-x-hidden">
          <Hero onLaunchApp={() => navigate('/navigate')} />
          <Features />
          <Philosophy />
        </main>
        <Footer />
      </>
    );
};

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/navigate" 
        element={
          <Suspense fallback={<LoadingScreen />}>
            <NavigationApp onBack={() => navigate('/')} />
          </Suspense>
        } 
      />
    </Routes>
  );
}

export default App;
