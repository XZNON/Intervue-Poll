import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import KickedPage from "./KickedPage";
import { API_BASE_URL } from "./config";

const Chat = ({ studentName, visible, onClose, participants = [] }) => {
  // Check sessionStorage for kicked flag
  const [kicked, setKicked] = useState(
    () => sessionStorage.getItem("kicked") === "true"
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("chat");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (kicked || !visible) return;
    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL, {
        autoConnect: true,
        reconnection: true,
      });
    }
    const socket = socketRef.current;
    // Emit joinAsStudent on connect if not kicked
    if (studentName && !kicked) {
      socket.emit("joinAsStudent", studentName);
    }
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    // Listen for kicked event
    socket.on("kicked", () => {
      setKicked(true);
      sessionStorage.setItem("kicked", "true");
      socket.disconnect();
    });
    return () => {
      socket.off("chatMessage");
      socket.off("kicked");
    };
  }, [visible, kicked, studentName]);

  useEffect(() => {
    if (messagesEndRef.current && tab === "chat") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, tab]);

  // Clear chat state when chat is closed or participants are cleared (poll ended or left)
  useEffect(() => {
    if (!visible || participants.length === 0) {
      setMessages([]);
      setInput("");
      setTab("chat");
    }
  }, [visible, participants]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { name: studentName || "Anonymous", text: input };
    socketRef.current.emit("chatMessage", msg);
    setInput("");
  };

  if (kicked) return <KickedPage />;

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 120,
        right: 40,
        width: 340,
        height: 400,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #0003",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          background: "#7c5dfa",
          color: "#fff",
          padding: 0,
          fontWeight: 700,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <button
            onClick={() => setTab("chat")}
            style={{
              flex: 1,
              background: tab === "chat" ? "#7c5dfa" : "#a5a1e5",
              color: "#fff",
              border: "none",
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              borderBottom: tab === "chat" ? "2px solid #fff" : "none",
              transition: "background 0.2s",
            }}
          >
            Chat
          </button>
          <button
            onClick={() => setTab("participants")}
            style={{
              flex: 1,
              background: tab === "participants" ? "#7c5dfa" : "#a5a1e5",
              color: "#fff",
              border: "none",
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              borderBottom: tab === "participants" ? "2px solid #fff" : "none",
              transition: "background 0.2s",
            }}
          >
            Participants
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 22,
            cursor: "pointer",
            fontWeight: 700,
            padding: "0 16px",
          }}
        >
          ×
        </button>
      </div>
      {/* Tab content */}
      {tab === "chat" ? (
        <>
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              background: "#f6f6fa",
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: "#7c5dfa" }}>
                  {msg.name}:
                </span>{" "}
                <span style={{ color: "#222" }}>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              borderTop: "1px solid #eee",
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "none",
                padding: 14,
                fontSize: 16,
                outline: "none",
                background: "#fff",
                color: "#222",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#7c5dfa",
                color: "#fff",
                border: "none",
                padding: "0 20px",
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <div
          style={{
            flex: 1,
            padding: 16,
            background: "#f6f6fa",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12, color: "#7c5dfa" }}>
            Participants
          </div>
          {participants.length === 0 ? (
            <div style={{ color: "#888" }}>No participants yet.</div>
          ) : (
            participants.map((name, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px 0",
                  color: "#222",
                  fontWeight: 500,
                  fontSize: 16,
                  borderBottom: "1px solid #eee",
                  width: "100%",
                }}
              >
                {name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
