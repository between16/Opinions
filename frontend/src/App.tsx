import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import MainPage from './components/MainPage';
import TopicPage from './components/TopicPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<Login />} />
        <Route path="/Home" element={<MainPage />} />
        {/* Dynamic route for any topic */}
        <Route path="/Home/:topic" element={<TopicPage />} />
      </Routes>
    </Router>
  );
}

export default App;
