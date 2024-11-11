import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const topics = ["Cinema", "F1", "Soccer", "Politic", "Art", "Books", "Study"];
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handler to navigate to the topic page
  const handleTopicClick = (topic: string) => {
    navigate(`/Home/${topic}`); // Navigates to the URL /topic
  };

  return (
    <>
      <div>MainPage</div>
      <div>
        {topics.map((topic, index) => (
          <button key={index} onClick={() => handleTopicClick(topic)}>
            {topic}
          </button>
        ))}
      </div>
    </>
  );
};

export default MainPage;
