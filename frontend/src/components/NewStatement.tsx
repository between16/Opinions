import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const NewStatement = () => {
  const [statement, setStatement] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { topic } = useParams<{ topic: string }>(); // Extract topic from the URL
  const username = localStorage.getItem('username');

  async function handleSubmit() : Promise<void> {
    // Simple validation to make sure all fields are filled out
    if (!statement || !comment || !username || !topic) {
        alert("All fields are required!");
        return;
    }

    console.log('Statement:', statement);
    console.log('Comment:', comment);

    try {
        const response = await axios.post("http://127.0.0.1:5000/api/addStatement", {
            username: username,
            topic: topic,
            statement: statement,
            comment: comment
        });

        // Check if there's an error in the response
        if (response.data.message.startsWith("Error")) {
            alert("Something went wrong: " + response.data.message);
            navigate("/Home");
        } else {
            // If everything is okay, navigate to the topic page
            navigate(`/Home/${topic}`);
        }

    } catch (error) {
        console.error("Error in handleSubmit:", error);
        alert("Something went wrong. Please try again later.");
    }
};

  return (
    <>
    <h1>{topic}</h1>
      <div>
        <label htmlFor="statement">Statement:</label>
        <input
          id="statement"
          type="text"
          value={statement}  // Make the input a controlled component
          onChange={(e) => setStatement(e.target.value)}  // Update state on input change
          placeholder="Enter your statement"
        />
      </div>

      <div>
        <label htmlFor="comment">Comment:</label>
        <input
          id="comment"
          type="text"
          value={comment}  // Make the input a controlled component
          onChange={(e) => setComment(e.target.value)}  // Update state on input change
          placeholder="Enter your comment"
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

export default NewStatement;
