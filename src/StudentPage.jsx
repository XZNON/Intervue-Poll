import React, { useEffect, useState, useRef } from "react";
import PollHistory from "./PollHistory";
import Chat from "./Chat";
import KickedPage from "./KickedPage";
import { io } from "socket.io-client";

const StudentPage = ({ polls, onVote, votedPolls, studentName, pollEnded }) => {
  // Find the first poll that hasn't been voted on
  const nextPoll = polls.find((poll) => !votedPolls[poll._id]);
  const [timer, setTimer] = useState(nextPoll ? nextPoll.timer : null);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:9000");
    }
    const socket = socketRef.current;
    socket.on("participantsUpdate", (list) => {
      setParticipants(list);
    });
    // Remove self from participants if kicked
    socket.on("kicked", () => {
      setParticipants((prev) => prev.filter((name) => name !== studentName));
    });
    return () => {
      socket.off("participantsUpdate");
      socket.off("kicked");
    };
  }, [studentName]);

  useEffect(() => {
    if (!nextPoll || !nextPoll.timer || votedPolls[nextPoll._id]) return;
    setTimer(nextPoll.timer);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [nextPoll && nextPoll._id, votedPolls[nextPoll && nextPoll._id]]);

  // Floating chat button for students (always visible)
  const ChatButton = () => (
    <button
      title="Chat with other users"
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#7c5dfa",
        color: "#fff",
        border: "none",
        boxShadow: "0 4px 16px #0003",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        cursor: "pointer",
        zIndex: 1000,
        transition: "background 0.2s",
        outline: "none",
        padding: 0,
      }}
      onClick={() => setShowChat(true)}
    >
      {/* Message icon SVG */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#7c5dfa" />
        <path
          d="M7 10.5V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9l-4 4v-7a2 2 0 0 1 2-2h0"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  // Show only KickedPage if kicked
  if (sessionStorage.getItem("kicked") === "true") {
    return <KickedPage />;
  }

  // If pollEnded is true, always show PollHistory (not PollEndedPage)
  if (pollEnded === true) {
    return (
      <>
        <PollHistory polls={polls} votedPolls={votedPolls} userRole="student" />
        <ChatButton />
        <Chat
          studentName={studentName}
          visible={showChat}
          onClose={() => setShowChat(false)}
          participants={participants}
        />
      </>
    );
  }

  // If all questions are answered and pollEnded is false, show loading screen
  if (!nextPoll && !pollEnded) {
    return (
      <>
        <div
          className="poll-app-container"
          style={{
            minHeight: "100vh",
            minWidth: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            padding: 0,
            margin: 0,
            position: "relative",
          }}
        >
          {/* Poll History Tab */}
          <button
            style={{
              position: "absolute",
              top: 32,
              right: 48,
              background: "#7c5dfa",
              color: "#fff",
              border: "none",
              borderRadius: 24,
              padding: "10px 32px",
              fontWeight: 600,
              fontSize: 17,
              boxShadow: "0 2px 8px #0001",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 10,
            }}
            onClick={() => setShowHistory(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="8.5" stroke="#fff" strokeWidth="2" />
              <path
                d="M10 5V10L13 13"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Poll history
          </button>
          {showHistory ? (
            <PollHistory
              polls={polls}
              votedPolls={votedPolls}
              userRole="student"
            />
          ) : (
            <div
              style={{ width: "100vw", maxWidth: 900, margin: 0, padding: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                  background: "#fff",
                  borderRadius: 0,
                  boxShadow: "none",
                  margin: 0,
                  padding: 0,
                  width: "100%",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: "#7c5dfa",
                    color: "#fff",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "6px 18px",
                    marginBottom: 24,
                    marginTop: 0,
                    letterSpacing: 0.5,
                    boxShadow: "0 2px 8px #0001",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon
                      points="10,2 12.09,7.36 18,7.64 13.5,11.14 15,17 10,13.77 5,17 6.5,11.14 2,7.64 7.91,7.36"
                      fill="#fff"
                    />
                  </svg>
                  Intervue Poll
                </span>
                <div className="loader" style={{ marginBottom: 32 }}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#7c5dfa"
                      strokeWidth="6"
                      opacity="0.2"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#7c5dfa"
                      strokeWidth="6"
                      strokeDasharray="100 100"
                      strokeDashoffset="60"
                      strokeLinecap="round"
                      style={{
                        transformOrigin: "center",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  </svg>
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#111",
                    marginBottom: 0,
                    marginTop: 0,
                    letterSpacing: 0.2,
                  }}
                >
                  Wait for the teacher to ask questions..
                </h2>
              </div>
            </div>
          )}
          <style>{`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
        <ChatButton />
        <Chat
          studentName={studentName}
          visible={showChat}
          onClose={() => setShowChat(false)}
          participants={participants}
        />
      </>
    );
  }

  // Otherwise, show the poll question UI
  return (
    <>
      <div
        className="poll-app-container"
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          padding: 0,
          margin: 0,
        }}
      >
        <div style={{ width: "100vw", maxWidth: 900, margin: 0, padding: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              marginLeft: 32,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 24,
                color: "#111",
                marginRight: 16,
              }}
            >
              Question:{" "}
              {polls.findIndex((poll) => poll._id === nextPoll._id) + 1}
            </span>
            {nextPoll.timer && (
              <span
                style={{
                  background: "transparent",
                  color: timer <= 15 ? "#e11d48" : "#222",
                  borderRadius: 8,
                  padding: "4px 16px",
                  fontWeight: 600,
                  fontSize: 18,
                  marginLeft: 8,
                  letterSpacing: 1,
                  minWidth: 60,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: 4 }}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke={timer <= 15 ? "#e11d48" : "#222"}
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="9"
                    y="4"
                    width="2"
                    height="7"
                    rx="1"
                    fill={timer <= 15 ? "#e11d48" : "#222"}
                  />
                  <rect
                    x="13.0711"
                    y="6.34315"
                    width="2"
                    height="5"
                    rx="1"
                    transform="rotate(45 13.0711 6.34315)"
                    fill={timer <= 15 ? "#e11d48" : "#222"}
                  />
                </svg>
                {timer}s
              </span>
            )}
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 24px #0001",
              padding: 0,
              overflow: "hidden",
              margin: "0 32px",
              border: "2px solid #7c5dfa",
              borderTop: "none",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #444 60%, #888 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 17,
                padding: "16px 24px",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              {nextPoll.question}
            </div>
            <div style={{ padding: 24 }}>
              {nextPoll.options.map((option, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f6f6fa",
                    borderRadius: 8,
                    marginBottom: 16,
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      minWidth: 36,
                      height: 36,
                      background: "#7c5dfa",
                      color: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 18,
                      margin: "0 16px 0 0",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontWeight: 500,
                      color: "#222",
                      fontSize: 17,
                    }}
                  >
                    {option.text || option}
                  </div>
                  <button
                    className="vote-btn"
                    disabled={votedPolls && votedPolls[nextPoll._id]}
                    onClick={() => onVote(nextPoll._id, idx)}
                    style={{
                      border: "1px solid #7c5dfa",
                      color: "#7c5dfa",
                      background: "#fff",
                      borderRadius: 8,
                      padding: "4px 16px",
                      fontWeight: 600,
                      cursor:
                        votedPolls && votedPolls[nextPoll._id]
                          ? "not-allowed"
                          : "pointer",
                      marginLeft: 16,
                      fontSize: 16,
                    }}
                  >
                    Vote
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatButton />
      <Chat
        studentName={studentName}
        visible={showChat}
        onClose={() => setShowChat(false)}
        participants={participants}
      />
    </>
  );
};

export default StudentPage;
