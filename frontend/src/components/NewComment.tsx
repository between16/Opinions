import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeButton from './HomeButton';


const NewComment = () => {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { topic, statement } = useParams<{ topic: string, statement: string }>();
  const username = localStorage.getItem('username');

  async function handleSubmit() : Promise<void> {
    // Simple validation to make sure all fields are filled out
    if (!statement || !comment || !username || !topic) {
        alert("All fields are required!");
        return;
    }

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
    <HomeButton/>
    <h1>{topic}</h1>
    <h2>{statement}</h2>
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

      <button className='send-button' onClick={handleSubmit}>Submit</button>
    </>
  );
};

export default NewComment;
