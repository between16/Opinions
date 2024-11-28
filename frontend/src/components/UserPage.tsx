import React, { useEffect, useState } from 'react';
import "./UserPage.css";
import HomeButton from "./HomeButton";
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

type MostLikedComment = {
  comment: string;
  likes: number;
  topic: string;    
  statement: string;
};

type UserStatsResponse = {
  mostLikedComment: MostLikedComment | null;
  topicPercentages: Record<string, number>;
  topicCounts: Record<string, number>;
};

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const [mostLikedComment, setMostLikedComment] = useState<MostLikedComment | null>(null);
  const [topicPercentages, setTopicPercentages] = useState<Record<string, number>>({});
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    fetch("http://127.0.0.1:5000/api/userStats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to fetch user stats");
          });
        }
        return response.json();
      })
      .then((data: UserStatsResponse) => {
        setMostLikedComment(data.mostLikedComment);
        setTopicPercentages(data.topicPercentages);
        setTopicCounts(data.topicCounts);
      })
      .catch((err) => setError(err.message));
  }, [username]);

  const pieData = {
    labels: Object.keys(topicPercentages),
    datasets: [
      {
        data: Object.values(topicPercentages),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(topicCounts),
    datasets: [
      {
        label: "Number of Comments",
        data: Object.values(topicCounts),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div>
      <HomeButton />
      <h1 className="user-title">User: {username}</h1>

      {/* Existing Buttons */}
      <div className="button-group">
        <button
          onClick={() => navigate("/Home/User/Change/username")}
        >
          Change Username
        </button>

        <button
          onClick={() => navigate("/Home/User/Change/password")}
        >
          Change Password
        </button>
      </div>

      {/* Error Handling */}
      {error && <p className="error">{error}</p>}

      {/* Most Liked Comment */}
      {mostLikedComment && (
        <div className="most-liked-comment">
          <h2>Most Liked Comment</h2>
          <p><strong>Topic:</strong> {mostLikedComment.topic}</p>
          <p><strong>Statement:</strong> {mostLikedComment.statement}</p>
          <p><strong>Comment:</strong> {mostLikedComment.comment}</p>
          <p><strong>Likes:</strong> {mostLikedComment.likes}</p>
        </div>
      )}

      {/* Data Visualizations */}
      <div className="charts">
        <div className="chart">
          <h2 className='pie-chart-title'>Topic Distribution</h2>
          <Pie data={pieData} />
        </div>
        <div className="chart">
          <h2 className='bar-chart-title'>Comments Per Topic</h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
