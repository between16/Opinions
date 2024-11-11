import { useParams } from 'react-router-dom';

const TopicPage = () => {
  const { topic } = useParams<{ topic: string }>(); // Extract topic from the URL

  return <div>You're viewing the {topic} topic!</div>;
};

export default TopicPage;
