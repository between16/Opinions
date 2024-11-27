import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import MainPage from './components/MainPage';
import TopicPage from './components/TopicPage';
import NewStatement from './components/NewStatement';
import CommentPage from './components/CommentPage';
import NewComment from './components/NewComment';
import UserPage from './components/UserPage'
import UserUpdate from './components/UserUpdate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<Login />} />
        <Route path="/Home" element={<MainPage />} />
        <Route path="/Home/:topic" element={<TopicPage />} />
        <Route path="/Home/:topic/newStatement" element = {<NewStatement/>}/>
        <Route path="/Home/:topic/:statement" element = {<CommentPage/>}/>
        <Route path="/Home/:topic/:statement/newComment" element = {<NewComment/>}/>
        <Route path="Home/User" element={<UserPage/>}/>
        <Route path="Home/User/Change/:option" element={<UserUpdate/>}/>
      </Routes>
    </Router>
  );
}

export default App;
