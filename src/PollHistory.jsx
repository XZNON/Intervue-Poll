import React from "react";

const PollHistory = ({ polls, votedPolls, userRole }) => {
  // Handler for going to home (reset session and reload)
  const handleGoHome = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  if (!polls || polls.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        No poll history available.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        height: "100vh",
        boxSizing: "border-box",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "auto",
        padding: 0,
        margin: 0,
      }}
    >
      {userRole === "student" && (
        <button
          onClick={handleGoHome}
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
        >
          Go to Home
        </button>
      )}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          padding: 32,
          margin: "40px auto 0 auto",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
            color: "#111",
          }}
        >
          Poll History
        </h2>
        {polls.map((poll, idx) => {
          // Calculate total votes for this poll
          let totalVotes = 0;
          if (poll.options && poll.options.length > 0) {
            totalVotes = poll.options.reduce((sum, opt, oidx) => {
              if (opt.votes !== undefined) return sum + opt.votes;
              if (poll.votes && poll.votes[oidx] !== undefined)
                return sum + poll.votes[oidx];
              return sum;
            }, 0);
          }
          return (
            <div
              key={poll._id}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 24px #0001",
                marginBottom: 32,
                overflow: "hidden",
                border: "2px solid #e5e7eb",
                width: "100%",
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
                {idx + 1}. {poll.question}
              </div>
              <div style={{ padding: 24 }}>
                {poll.options.map((option, oidx) => {
                  let votes =
                    option.votes !== undefined
                      ? option.votes
                      : poll.votes
                      ? poll.votes[oidx]
                      : 0;
                  let percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                  // Bar color
                  const barColor = "#7765DA";
                  // If percent > 0, the bar will cover some elements
                  // We'll use white text if the bar covers more than 40px of the element (approx for 36px circle + margin)
                  const barCoversCircle = percent > 5; // 5% of 900px is 45px
                  const barCoversText = percent > 25; // 25% of 900px is 225px
                  return (
                    <div
                      key={oidx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f6f6fa",
                        borderRadius: 8,
                        marginBottom: 12,
                        padding: 0,
                        position: "relative",
                        minHeight: 44,
                        overflow: "hidden",
                      }}
                    >
                      {/* Bar background */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: percent + "%",
                          background: barColor,
                          opacity: 1,
                          zIndex: 1,
                          transition: "width 0.5s cubic-bezier(.4,2,.6,1)",
                        }}
                      />
                      <div
                        style={{
                          minWidth: 36,
                          height: 36,
                          background: barCoversCircle ? "#fff" : barColor,
                          color: barCoversCircle ? barColor : "#fff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 18,
                          marginLeft: 8,
                          marginRight: 16,
                          zIndex: 2,
                          transition: "background 0.3s, color 0.3s",
                        }}
                      >
                        {oidx + 1}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          fontWeight: 500,
                          color:
                            userRole === "teacher"
                              ? "#222"
                              : barCoversText
                              ? "#fff"
                              : "#222",
                          fontSize: 17,
                          zIndex: 2,
                          transition: "color 0.3s",
                        }}
                      >
                        {option.text || option}
                      </div>
                      <div
                        style={{
                          marginLeft: 16,
                          color: barCoversText ? "#fff" : "#7765DA",
                          fontWeight: 600,
                          fontSize: 16,
                          zIndex: 2,
                          transition: "color 0.3s",
                        }}
                      >
                        {votes} vote{votes === 1 ? "" : "s"}
                      </div>
                      {userRole === "student" &&
                        votedPolls &&
                        votedPolls[poll._id] === oidx && (
                          <div
                            style={{
                              marginLeft: 16,
                              color: barCoversText ? "#fff" : "#10b981",
                              fontWeight: 600,
                              zIndex: 2,
                              transition: "color 0.3s",
                            }}
                          >
                            Your vote
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollHistory;
