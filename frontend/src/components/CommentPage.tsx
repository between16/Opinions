/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeButton from './HomeButton';
import './CommentPage.css';  

const CommentPage = () => {
    const navigate = useNavigate();
    const { topic, statement } = useParams<{ topic: string, statement: string }>();
    const username = localStorage.getItem('username'); // Retrieve username from local storage

    //data that are going to be gathered from backend
    const [comments, setComments] = useState<{likes: number; comment: string, sentiment: number, username: string }[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //get comments from backend
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/getComments', { statement });
                
                if (response.data && response.data.comments) {
                    setComments(response.data.comments);
                } else {
                    setError('No comments found.');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load comments.');
                setLoading(false);
            }
        };

        fetchComments();
    }, [statement]);

    // Function to handle deleting a comment
    const handleDeleteComment = async (comment: string) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/deleteComment', { statement, comment });
            if (response.data.success) {
                setComments(comments.filter(c => c.comment !== comment)); // Remove comment from state
            } else {
                alert('Failed to delete comment.');
            }
        } catch (err) {
            alert('Error deleting comment.');
        }
    };

    const handleLikeComment = async (comment: string) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/likeComment', { 
                statement, 
                comment, 
                username 
            });
    
            if (response.data.success) {
                // Increment the like count in the state
                setComments(comments.map(c => 
                    c.comment === comment ? { ...c, likes: c.likes + 1 } : c
                ));
            } else if (response.data.message === "User already liked this comment") {
                alert("You have already liked this comment.");
            } else {
                alert('Failed to like the comment.');
            }
        } catch (err) {
            console.log("you can not like the same comment twice")
        }
    };
    

    // Choose background color based on sentiment analysis
    const getBackgroundColor = (sentiment: number) => {
        if (sentiment < -0.3) return 'red';
        if (sentiment > 0.3) return 'green';
        return 'gray';
    };

    return (
        <>
            <HomeButton />
            <h1 className='title'>You're viewing the "{topic}" topic!</h1>
            <h2 className='statement'>{statement}</h2>

            <div className='button-section'>
                <button 
                    className='send-button' 
                    onClick={() => navigate(`/Home/${topic}/${statement}/newComment`)}> 
                    Create new Comment
                </button>
            </div>

            {loading ? (
                <p>Loading comments...</p>
            ) : error ? (
                <p>{error}</p>
            ) : comments.length === 0 ? (
                <p>No comments found for this statement.</p>
            ) : (
                <div className="comments-list">
                    <ul>
                        {comments.map((commentData, index) => (
                            <li key={index} className="comment-item">
                                <div className="comment-content">
                                    <span className="comment-username">{commentData.username}</span>
                                    <span 
                                        className="comment-text" 
                                        style={{ backgroundColor: getBackgroundColor(commentData.sentiment) }}>
                                        {commentData.comment}
                                    </span>
                                    <button 
                                        className="like-button" 
                                        onClick={() => handleLikeComment(commentData.comment)}>
                                        ❤️ {commentData.likes}
                                    </button>
                                    {username === commentData.username && (
                                        <button 
                                            className="delete-button" 
                                            onClick={() => handleDeleteComment(commentData.comment)}>
                                            X
                                        </button>
                                    )}
                                </div>
                            </li>

                        
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default CommentPage;
