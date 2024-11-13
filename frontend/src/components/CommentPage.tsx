import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomeButton from './HomeButton';
import './CommentPage.css';  // Importiamo il file CSS per la stilizzazione

const CommentPage = () => {
    const navigate = useNavigate();
    const { topic, statement } = useParams<{ topic: string, statement: string }>();

    // Inizializza `comments` come array vuoto per evitare errori di undefined
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

    // Funzione per determinare il colore di sfondo in base al valore di sentiment
    const getBackgroundColor = (sentiment: number) => {
        if (sentiment < -0.3) return 'red';    // Colore rosso per sentiment negativo
        if (sentiment > 0.3) return 'green';   // Colore verde per sentiment positivo
        return 'gray';                         // Colore grigio per sentiment neutro
    };

    return (
        <>
            <HomeButton />
            <h1>You're viewing the "{topic}" topic!</h1>
            <h2>{statement}</h2>

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

            <button className='send-button' onClick={() => navigate(`/Home/${topic}/${statement}/newComment`) }>Create new Comment</button>
        </>
    );
};

export default CommentPage;
