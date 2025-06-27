import React, { useState, useEffect, useRef } from "react";
import PollList from "./PollList";
import PollHistory from "./PollHistory";
import ParticipantsModal from "./ParticipantsModal";
import { io } from "socket.io-client";

const TIMER_OPTIONS = [30, 60, 90];

const TeacherPage = ({
  polls,
  onCreatePoll,
  onVote,
  userRole,
  votedPolls,
  studentName,
  onEndPoll, // optional callback for parent
  pollEnded, // get pollEnded from parent
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:9000");
    }
    const socket = socketRef.current;
    socket.on("participantsUpdate", (list) => {
      setParticipants(list);
    });
    return () => {
      socket.off("participantsUpdate");
    };
  }, []);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (idx, isCorrect) => {
    const newOptions = [...options];
    newOptions[idx].isCorrect = isCorrect;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some((opt) => !opt.text.trim())) {
      setError("Please enter a question and at least two options.");
      return;
    }
    setError("");
    onCreatePoll({
      question: question.trim(),
      options,
      timer,
    });
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setTimer(60);
  };

  // Handler for ending the poll
  const handleEndPoll = () => {
    if (onEndPoll) onEndPoll(); // App will handle socket emit
  };

  // Handler to start a new poll session
  const handleStartNewSession = async () => {
    setIsClearing(true);
    await fetch("http://localhost:9000/api/polls", { method: "DELETE" });
    sessionStorage.setItem("role", "teacher");
    sessionStorage.setItem("hasContinued", "true");
    sessionStorage.setItem("pollEnded", "false");
    window.location.reload();
  };

  // Handler for going to home (reset session and reload)
  const handleGoHome = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const handleKick = (name) => {
    if (socketRef.current) {
      socketRef.current.emit("kickStudent", name);
    }
  };

  if (showHistory) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <button
          style={{
            position: "absolute",
            top: 32,
            left: 48,
            background: "#7c5dfa",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "10px 32px",
            fontWeight: 600,
            fontSize: 17,
            boxShadow: "0 2px 8px #0001",
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={() => setShowHistory(false)}
        >
          ← Back
        </button>
        <PollHistory polls={polls} votedPolls={votedPolls} userRole="teacher" />
      </div>
    );
  }

  return (
    <div
      className="teacher-page"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#fff",
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
        View Poll history
      </button>
      {/* End Poll and Go Home Buttons - bottom right */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 48,
          display: "flex",
          flexDirection: "row",
          gap: 16,
          zIndex: 100,
        }}
      >
        <button
          style={{
            background: pollEnded ? "#ccc" : "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "14px 40px",
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 8px #0001",
            cursor: pollEnded ? "not-allowed" : "pointer",
            opacity: pollEnded ? 0.7 : 1,
            transition: "background 0.2s",
          }}
          onClick={handleEndPoll}
          disabled={pollEnded}
        >
          {pollEnded ? "Poll Ended" : "End Poll"}
        </button>
        <button
          onClick={handleGoHome}
          style={{
            background: "#7c5dfa",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "14px 40px",
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 8px #0001",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Go to Home
        </button>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          background: "#fff",
          padding: "40px 0 0 0",
          boxSizing: "border-box",
        }}
      >
        {/* Badge */}
        <button
          style={{
            background: "#7c5dfa",
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: "6px 18px",
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 24,
            cursor: "pointer",
            alignSelf: "flex-start",
            marginLeft: 32,
          }}
        >
          ★ Intervue Poll
        </button>
        {/* Heading and description */}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#000",
            marginBottom: 8,
            textAlign: "left",
            width: "100%",
            maxWidth: 700,
            marginLeft: 32,
          }}
        >
          Let’s <span style={{ fontWeight: 900 }}>Get Started</span>
        </h1>
        <div
          style={{
            fontSize: 16,
            color: "#888",
            marginBottom: 36,
            maxWidth: 700,
            textAlign: "left",
            width: "100%",
            marginLeft: 32,
          }}
        >
          you’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </div>
        {/* If poll ended, show message and disable form */}
        {pollEnded ? (
          <div
            style={{
              width: "100%",
              maxWidth: 700,
              marginLeft: 32,
              background: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              borderRadius: 8,
              padding: 32,
              fontSize: 22,
              fontWeight: 600,
              textAlign: "center",
              marginTop: 32,
            }}
          >
            The poll has ended. You can view poll history or start a new
            session.
            <br />
            <button
              onClick={handleStartNewSession}
              style={{
                marginTop: 24,
                background: "#7c5dfa",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                padding: "12px 36px",
                fontWeight: 700,
                fontSize: 18,
                boxShadow: "0 2px 8px #0001",
                cursor: isClearing ? "not-allowed" : "pointer",
                opacity: isClearing ? 0.7 : 1,
                transition: "background 0.2s",
              }}
              disabled={isClearing}
            >
              {isClearing ? "Resetting..." : "Start New Poll Session"}
            </button>
          </div>
        ) : (
          <form
            className="poll-form"
            id="poll-form"
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: 700,
              background: "#fff",
              borderRadius: 0,
              boxShadow: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              position: "relative",
              marginBottom: 32,
              boxSizing: "border-box",
              marginLeft: 32,
            }}
          >
            {/* Timer and question label in a row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginBottom: 16,
                gap: 16,
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  marginBottom: 0,
                  marginLeft: 0,
                  color: "#000",
                }}
                htmlFor="poll-question-input"
              >
                Enter your question
              </label>
              <select
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                className="timer-select"
                style={{
                  borderRadius: 6,
                  padding: "10px 18px",
                  fontSize: 18,
                  background: "#222",
                  border: "none",
                  fontWeight: 600,
                  color: "#fff",
                  minWidth: 140,
                }}
              >
                {TIMER_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} seconds
                  </option>
                ))}
              </select>
            </div>
            {/* Question input */}
            <textarea
              id="poll-question-input"
              className="poll-question-input"
              style={{
                minHeight: 90,
                resize: "none",
                fontSize: 18,
                marginBottom: 8,
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ddd",
                padding: 18,
                background: "#f5f5f5",
                color: "#222",
                boxSizing: "border-box",
              }}
              maxLength={100}
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div
              style={{
                textAlign: "right",
                color: "#888",
                fontSize: 14,
                marginBottom: 24,
                width: "100%",
              }}
            >
              {question.length}/100
            </div>
            {/* Edit Options and Is it Correct header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                fontWeight: 600,
                marginBottom: 8,
                color: "#000",
                width: "100%",
                gap: 16,
              }}
            >
              <span style={{ flex: 1, color: "#000" }}>Edit Options</span>
              <span style={{ width: 120, textAlign: "center" }}>
                Is it Correct?
              </span>
            </div>
            {options.map((opt, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 16,
                  width: "100%",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    width: 24,
                    color: "#7c5dfa",
                    fontWeight: 700,
                    fontSize: 18,
                    marginTop: 18,
                    textAlign: "center",
                  }}
                >
                  {idx + 1}
                </span>
                <input
                  className="poll-option-input"
                  type="text"
                  style={{
                    flex: 1,
                    marginRight: 16,
                    fontSize: 16,
                    background: "#f5f5f5",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    padding: 14,
                    marginTop: 8,
                    boxSizing: "border-box",
                    color: "#222", // Make input text black
                  }}
                  placeholder={`Option ${idx + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 120,
                    justifyContent: "flex-start",
                    marginLeft: 8,
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                        color: "#7c5dfa",
                        fontWeight: 600,
                      }}
                    >
                      <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={opt.isCorrect === true}
                        onChange={() => handleCorrectChange(idx, true)}
                        style={{ cursor: "pointer" }}
                      />
                      Yes
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                        color: "#888",
                        fontWeight: 600,
                      }}
                    >
                      <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={opt.isCorrect === false}
                        onChange={() => handleCorrectChange(idx, false)}
                        style={{ cursor: "pointer" }}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="add-option-btn"
              onClick={addOption}
              style={{
                marginBottom: 32,
                marginTop: 8,
                border: "1px solid #7c5dfa",
                color: "#7c5dfa",
                background: "#fff",
                fontWeight: 600,
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              + Add More option
            </button>
            {error && (
              <div
                style={{
                  color: "red",
                  fontSize: 14,
                  marginTop: 12,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {error}
              </div>
            )}
            {/* Sticky footer button inside main body, not fixed */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                left: 0,
                width: "100%",
                background: "#fff",
                borderTop: "1px solid #eee",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                padding: "16px 0 0 0",
                boxSizing: "border-box",
                marginTop: 24,
              }}
            >
              <button
                type="submit"
                className="create-poll-btn"
                style={{
                  borderRadius: 24,
                  padding: "14px 56px",
                  fontSize: 18,
                  fontWeight: 600,
                  background: "#7c5dfa",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(124,93,250,0.08)",
                  minWidth: 220,
                  maxWidth: "90vw",
                  overflow: "hidden",
                }}
                disabled={
                  !question.trim() || options.some((opt) => !opt.text.trim())
                }
              >
                Ask Question
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Floating Participants Button */}
      <button
        title="View Participants"
        style={{
          position: "fixed",
          bottom: 120,
          right: 48,
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
        onClick={() => setShowParticipants(true)}
      >
        {/* User icon SVG */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8" r="4" fill="#fff" />
          <rect x="4" y="16" width="16" height="4" rx="2" fill="#fff" />
        </svg>
      </button>
      {showParticipants && (
        <ParticipantsModal
          participants={participants}
          onKick={handleKick}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </div>
  );
};

export default TeacherPage;
