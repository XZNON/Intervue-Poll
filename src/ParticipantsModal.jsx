import React from "react";

const ParticipantsModal = ({ participants, onKick, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.3)",
      zIndex: 3000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #0003",
        padding: 32,
        minWidth: 340,
        minHeight: 200,
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 22,
          color: "#7c5dfa",
          marginBottom: 16,
        }}
      >
        Participants
      </div>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          background: "none",
          border: "none",
          color: "#7c5dfa",
          fontSize: 28,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        ×
      </button>
      {participants.length === 0 ? (
        <div style={{ color: "#888" }}>No participants yet.</div>
      ) : (
        <div style={{ width: "100%" }}>
          {participants.map((name, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span style={{ color: "#222", fontWeight: 500, fontSize: 16 }}>
                {name}
              </span>
              <button
                onClick={() => onKick(name)}
                style={{
                  background: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 18px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Kick
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ParticipantsModal;
