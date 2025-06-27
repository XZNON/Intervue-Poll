import React, { useState } from "react";
import "./App.css";

const StudentNameEntry = ({ onContinue }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    onContinue(name.trim());
  };

  return (
    <div className="student-name-entry-outer">
      <div className="student-name-entry-inner">
        <button className="student-name-entry-badge">★ Intervue Poll</button>
        <h1 className="student-name-entry-title">
          Let’s <span style={{ fontWeight: 900 }}>Get Started</span>
        </h1>
        <div className="student-name-entry-desc">
          If you’re a student, you’ll be able to <b>submit your answers</b>,
          participate in live polls, and see how your responses compare with
          your classmates
        </div>
        <div className="student-name-entry-form">
          <label
            htmlFor="student-name-input"
            className="student-name-entry-label"
          >
            Enter your Name
          </label>
          <input
            id="student-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
            className="student-name-entry-input"
          />
          {error && <div className="student-name-entry-error">{error}</div>}
          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="student-name-entry-continue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNameEntry;
