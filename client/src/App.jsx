import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './styles/main.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Context Providers
import { AppContextProvider } from './contexts/AppContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AppContextProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Helmet>
            <title>Dhreeti Jain - Full Stack Developer & AI Enthusiast</title>
            <meta name="description" content="Full Stack Developer specializing in React, Node.js, and AI solutions. Building innovative web applications and contributing to open source." />
            <meta name="keywords" content="Full Stack Developer, React, Node.js, JavaScript, AI, Web Development, Portfolio" />
            <meta name="author" content="Dhreeti Jain" />
            <meta property="og:title" content="Dhreeti Jain - Full Stack Developer" />
            <meta property="og:description" content="Full Stack Developer specializing in React, Node.js, and AI solutions" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://dhreetijain.dev" />
            <link rel="canonical" href="https://dhreetijain.dev" />
          </Helmet>
          
          <Header />
          
          <main className="main-content flex-grow">
            <Suspense fallback={<div className="loading-container"><LoadingSpinner /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AppContextProvider>
  );
}

export default App;