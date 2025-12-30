import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OriginalArticles from './pages/OriginalArticles';
import EnhancedArticles from './pages/EnhancedArticles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/original" element={<OriginalArticles />} />
        <Route path="/enhanced" element={<EnhancedArticles />} />
      </Routes>
    </Router>
  );
}

export default App;
