import { useParams, useNavigate } from 'react-router-dom';

const TopicPage = () => {
  const { topic } = useParams<{ topic: string }>(); // Extract topic from the URL
  const navigate = useNavigate()

  return (
  <>
  <h1>You're viewing the {topic} topic!</h1>

  <button  onClick={()=> {
    navigate(`/Home/${topic}/newStatement`)
  }}
  >Create new Statement</button>
  </>
  );
};

export default TopicPage;
