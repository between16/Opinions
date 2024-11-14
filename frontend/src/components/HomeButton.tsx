import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
    const navigate = useNavigate()
  return (
    <nav>
      <button onClick={()=> {navigate("/Home")}}>Home</button>
      <button onClick = {()=>{
        localStorage.removeItem("username");
        navigate("/")
      }}>LogOut</button> 
    </nav>
  )
}

export default HomeButton
