import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TopicPage = () => {
  const { topic } = useParams<{ topic: string }>(); // Extract topic from the URL
  const navigate = useNavigate();

  // State to store statements and loading/error states
  const [statements, setStatements] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch statements when the page is loaded
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/getStatements', { topic });
        setStatements(response.data.statements);
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load statements.');
        setLoading(false);
      }
    };

    fetchStatements();
  }, [topic]);

  const handleStatementClick = (statement:string)=>{
    navigate(`/Home/${topic}/${statement}`)
  }

  return (
    <>
      <h1>You're viewing the "{topic}" topic!</h1>

      {loading ? (
        <p>Loading statements...</p>
      ) : error ? (
        <p>{error}</p>
      ) : statements.length === 0 ? (
        <p>No statements found for this topic.</p>
      ) : (
      <div>
      {statements.map((statement, index) => (
        <button key={index} onClick={() => handleStatementClick(statement)}>
          {statement}
        </button>

      ))}
      </div>
      )}

      <button onClick={() => navigate(`/Home/${topic}/newStatement`)}>Create new Statement</button>
    </>
  );
};

export default TopicPage;

