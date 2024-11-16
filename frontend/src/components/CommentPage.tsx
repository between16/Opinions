import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeButton from './HomeButton';
import './CommentPage.css';  

const CommentPage = () => {
    const navigate = useNavigate();
    const { topic, statement } = useParams<{ topic: string, statement: string }>();


    const [comments, setComments] = useState<{ comment: string, sentiment: number, username: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Failed to load comments.');
                setLoading(false);
            }
        };

        fetchComments();
    }, [statement]);

    //choose background color for comments based on sentiment analysis result
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
                    onClick={() => navigate(`/Home/${topic}/${statement}/newComment`) }> 
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
                            <li key={index} className="comment-item" style={{ backgroundColor: getBackgroundColor(commentData.sentiment) }}>
                            <div className="user-avatar">{commentData.username}</div> {/* Nome completo dell'utente */}
                            <div className="comment-text">{commentData.comment}</div>
                        </li>
                        
                        ))}
                    </ul>
                </div>
            )}

            
        </>
    );
};

export default CommentPage;
