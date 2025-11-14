import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';
import Home from './pages/Home.jsx';
import Calculator from './pages/Calculator.jsx';
import Result from './pages/Result.jsx';
import Articles from './pages/Articles.jsx';
import About from './pages/About.jsx';
import Privacy from './pages/Privacy.jsx';
import Disclaimer from './pages/Disclaimer.jsx';
import Contact from './pages/Contact.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/result" element={<Result />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

