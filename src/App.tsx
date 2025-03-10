import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ui/ScrollToTop';
import AudioPlayer from './components/ui/AudioPlayer';
import Home from './pages/Home';
import Sustainability from './pages/Sustainability';
import HowWeWork from './pages/HowWeWork';
import ProductsCollection from './pages/ProductsCollection';
import Collaboration from './pages/collaboration';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AudioPlayer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/how-we-work" element={<HowWeWork />} />
        <Route path="/productscollection" element={<ProductsCollection />} />
        <Route path="/collaboration" element={<Collaboration />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
  );
}

export default App;