import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const topics = ["Cinema", "F1", "Soccer", "Politic", "Art", "Books", "Study", "Art", "Clothing", "Photography", "Geography", "Lecterature", "Minerals", "Games", "IT", "Food", "Cooking"];
  const navigate = useNavigate(); // Hook to navigate programmatically

  const [searchQuery, setSearchQuery] = useState<string>(''); // state to store search query
  const [filteredTopics, setFilteredTopics] = useState<string[]>(topics); // filtered topics

  // Handler to navigate to the topic page
  const handleTopicClick = (topic: string) => {
    navigate(`/Home/${topic}`); // Navigates to the URL /Home/{topic}
  };

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter topics based on the search query
    const filtered = topics.filter((topic) =>
      topic.toLowerCase().includes(query.toLowerCase()) // Case-insensitive search
    );
    setFilteredTopics(filtered);
  };

  return (
    <>
      <div>MainPage</div>
      
      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search topics..."
        className="search-bar"
      />
      
      {/* Display filtered topics */}
      <div>
        {filteredTopics.length === 0 ? (
          <p>No topics found.</p> // If no topics match the search
        ) : (
          filteredTopics.map((topic, index) => (
            <button key={index} onClick={() => handleTopicClick(topic)}>
              {topic}
            </button>
          ))
        )}
      </div>
    </>
  );
};

export default MainPage;
