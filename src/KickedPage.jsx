import React from "react";

const KickedPage = () => (
  <div
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
    {/* This div acts as the overall container for the kicked message */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        // The image doesn't show a distinct background/border for this section,
        // so we'll keep it simple and focus on the text and button styling.
      }}
    >
      {/* "Intervue Poll" button/logo */}
      <button
        style={{
          background: "linear-gradient(90deg, #7c5dfa, #a06dfc)", // Gradient from image
          color: "#fff",
          border: "none",
          borderRadius: 20, // More rounded like the image
          padding: "8px 20px", // Smaller padding
          fontWeight: 600,
          fontSize: 16, // Slightly smaller font size
          cursor: "pointer",
          marginBottom: 30, // Space between button and heading
          display: "flex",
          alignItems: "center",
          gap: "8px", // Space for the plus icon
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>{" "}
        {/* Simple plus icon */}
        Intervue Poll
      </button>

      <h2
        style={{
          color: "#333", // Darker text color as in the image
          fontWeight: 700,
          fontSize: 36, // Larger font size for the main heading
          marginBottom: 16, // Less margin than original code, closer to image
        }}
      >
        You've been Kicked out !
      </h2>
      <p style={{ color: "#777", fontSize: 18, marginBottom: 32 }}>
        Looks like the teacher had removed you from the poll system. Please
        <br />
        Try again sometime.
      </p>
      {/* The image does not show a "Go to Home" button, so I'm removing it to match the image precisely.
          If you need a button, please specify its text and style.
      */}
    </div>
  </div>
);

export default KickedPage;
