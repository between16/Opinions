import "./UserPage.css"
import HomeButton from "./HomeButton";
import { useNavigate } from 'react-router-dom';


const UserPage = () => {

    const navigate = useNavigate()

    const username = localStorage.getItem('username');
  return (
    <>
        <HomeButton/>
        <h1 className="user-title">{username}</h1>

        <button
        onClick={()=>{
            navigate("/Home/User/Change/username")
        }}
        >
            Change Username
        </button>

        <button
            onClick={()=>{
                navigate("/Home/User/Change/password")
            }}
        >
            Change Password
        </button>
    </>
  )
}

export default UserPage