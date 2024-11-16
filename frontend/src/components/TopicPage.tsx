import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeButton from './HomeButton';
import "./TopicPage.css"


const TopicPage = () => {
  const { topic } = useParams<{ topic: string }>(); // get topic from URL
  const navigate = useNavigate();


  const [statements, setStatements] = useState<string[]>([]);
  const [filteredStatements, setFilteredStatements] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // serch bar state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funzione per fetch degli statements
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        // API call to gather statements
        const response = await axios.post<{ statements: string[] }>('http://127.0.0.1:5000/api/getStatements', { topic });

        // remove duplicates 
        const uniqueStatements = [...new Set(response.data.statements)];

        setStatements(uniqueStatements);
        setFilteredStatements(uniqueStatements); // initially shows all statements
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load statements.');
        setLoading(false);
      }
    };

    fetchStatements();
  }, [topic]);

  // handle click on a statment
  const handleStatementClick = (statement: string) => {
    navigate(`/Home/${topic}/${statement}`);
  };

  // handle research
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    //filter all statemets base on the research
    const filtered = statements.filter((statement) =>
      statement.toLowerCase().includes(query.toLowerCase()) // Case insensitive search
    );
    setFilteredStatements(filtered);
  };

  return (
    <>
      <HomeButton />
      <h1 className='topic-title'>You're viewing the "{topic}" topic!</h1>

      <div className='input-section'>
      {/* serch bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search statements..."
        className="search-bar"
      />
      </div>

      <div className='send-section'>
        <button className="send-button" onClick={() => navigate(`/Home/${topic}/newStatement`)}>
          Create new Statement
        </button>
      </div>

      <div className='statement-section'>
      {loading ? (
        <p>Loading statements...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredStatements.length === 0 ? (
        <p>No statements found for this topic.</p>
      ) : (
        <div>
          {filteredStatements.map((statement, index) => (
            <button 
              className='statement-button'
              key={index} onClick={() => handleStatementClick(statement)}>
              {statement}
            </button>
          ))}
        </div>
      )}
      </div>
      

      
    </>
  );
};

export default TopicPage;
