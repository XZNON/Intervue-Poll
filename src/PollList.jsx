import React from "react";

// Only render poll list if userRole is student
const PollList = ({ polls, onVote, userRole, votedPolls, studentName }) => {
  if (userRole !== "student") return null;
  return (
    <div className="poll-list">
      {polls.map((poll) => (
        <div className="poll-card" key={poll._id}>
          <h2>{poll.question}</h2>
          <ul>
            {poll.options.map((option, idx) => (
              <li key={idx}>
                <span>{option.text || option}</span>
                <span className="vote-count">
                  {option.votes !== undefined
                    ? option.votes
                    : poll.votes
                    ? poll.votes[idx]
                    : 0}
                </span>
                <button
                  className="vote-btn"
                  disabled={votedPolls && votedPolls[poll._id]}
                  onClick={() => onVote(poll._id, idx)}
                >
                  Vote
                </button>
              </li>
            ))}
          </ul>
          {votedPolls && votedPolls[poll._id] && (
            <div style={{ color: "#6366f1", marginTop: 8, fontWeight: 500 }}>
              You voted as <b>{studentName}</b>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PollList;
