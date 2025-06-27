import React from "react";

const LandingPage = ({ selectedRole, setSelectedRole, onContinue }) => (
  <div className="landing-container">
    <span className="landing-badge">Live Poll App</span>
    <div className="landing-box">
      <h1 className="landing-title">
        Welcome to <span className="highlight">Live Poll</span>
      </h1>
      <p className="landing-desc">
        Create and participate in live polls. Choose your role to get started.
      </p>
    </div>
    <div className="role-cards">
      <div
        className={`role-card${selectedRole === "student" ? " selected" : ""}`}
        onClick={() => setSelectedRole("student")}
      >
        <div className="role-title">Student</div>
        <div className="role-desc">Vote in polls and see live results.</div>
      </div>
      <div
        className={`role-card${selectedRole === "teacher" ? " selected" : ""}`}
        onClick={() => setSelectedRole("teacher")}
      >
        <div className="role-title">Teacher</div>
        <div className="role-desc">
          Create polls and view responses in real-time.
        </div>
      </div>
    </div>
    <button
      className="landing-continue-btn"
      onClick={onContinue}
      disabled={!selectedRole}
    >
      Continue
    </button>
  </div>
);

export default LandingPage;
