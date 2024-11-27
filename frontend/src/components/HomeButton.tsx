import { useNavigate } from 'react-router-dom';
import "./HomeButton.css";

const HomeButton = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    return (
        <nav>
            <button 
                className="home" 
                onClick={() => navigate("/Home")}
            >
                Home
            </button>

            <button
                className = "user-button"
                onClick={()=> navigate("/Home/User")}
            >
                {username}
            </button>

            <button 
                className="logout" 
                onClick={() => {
                    localStorage.removeItem("username");
                    navigate("/");
                }}
            >
                LogOut
            </button>
        </nav>
    );
};

export default HomeButton;
