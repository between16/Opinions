import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
    const navigate = useNavigate()
  return (
    <nav>
      <button onClick={()=> {navigate("/Home")}}>Home</button>
    </nav>
  )
}

export default HomeButton
