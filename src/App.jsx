import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LandingPage from "./LandingPage";
import StudentNameEntry from "./StudentNameEntry";
import TeacherPage from "./TeacherPage";
import StudentPage from "./StudentPage";
import "./App.css";

function App() {
  const [role, setRole] = useState(() => sessionStorage.getItem("role") || "");
  const [polls, setPolls] = useState([]);
  const [voting, setVoting] = useState({});
  const [hasVisited, setHasVisited] = useState(() => {
    return sessionStorage.getItem("hasVisitedStudent") === "true";
  });
  const [showLanding, setShowLanding] = useState(() => {
    if (window.sessionStorage.getItem("hasVisitedStudent") === "true") {
      return false;
    }
    return true;
  });
  const [studentName, setStudentName] = useState(
    () => sessionStorage.getItem("studentName") || ""
  );
  const [hasContinued, setHasContinued] = useState(() => {
    const stored = sessionStorage.getItem("hasContinued");
    return stored === "true";
  });
  const [pollEnded, setPollEnded] = useState(() => {
    const stored = sessionStorage.getItem("pollEnded");
    return stored === "true";
  });
  const socketRef = useRef(null);

  // Persist role and student name in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    sessionStorage.setItem("studentName", studentName);
  }, [studentName]);

  // Persist hasContinued in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("hasContinued", hasContinued);
  }, [hasContinued]);

  // Persist pollEnded in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("pollEnded", pollEnded);
  }, [pollEnded]);

  // Fetch polls from backend and set up Socket.IO
  useEffect(() => {
    fetch("http://localhost:9000/api/polls")
      .then((res) => res.json())
      .then((data) => setPolls(data));

    const socket = io("http://localhost:9000");
    socketRef.current = socket;
    socket.on("pollCreated", (poll) => {
      setPolls((prev) => [...prev, poll]);
    });
    socket.on("voteUpdate", (updatedPoll) => {
      setPolls((prev) =>
        prev.map((p) => (p._id === updatedPoll._id ? updatedPoll : p))
      );
    });
    socket.on("pollEnded", () => {
      setPollEnded(true);
    });
    return () => socket.disconnect();
  }, []);

  // Handle poll creation (for teacher)
  const handleCreatePoll = async ({ question, options, timer }) => {
    const res = await fetch("http://localhost:9000/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        options, // send full option objects (text, isCorrect)
        timer,
      }),
    });
    const newPoll = await res.json();
    setPolls((prev) => [...prev, newPoll]);
  };

  // Handle voting (for student)
  const handleVote = async (pollId, optionIndex) => {
    setVoting((prev) => ({ ...prev, [pollId]: true }));
    const res = await fetch(`http://localhost:9000/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionIndex }),
    });
    const updatedPoll = await res.json();
    setPolls((prev) => prev.map((p) => (p._id === pollId ? updatedPoll : p)));
    setVoting((prev) => ({ ...prev, [pollId]: false }));
    // Mark as voted in sessionStorage (optional: for per-session voting lock)
    const voted = JSON.parse(sessionStorage.getItem("votedPolls") || "{}");
    voted[pollId] = true;
    sessionStorage.setItem("votedPolls", JSON.stringify(voted));
  };

  // Track voted polls for the session (for student)
  const votedPolls =
    role === "student"
      ? JSON.parse(sessionStorage.getItem("votedPolls") || "{}")
      : {};

  // Handle role selection
  const handleRoleContinue = () => {
    setHasContinued(true);
    if (role === "student") {
      setShowLanding(true);
    }
  };

  // Handle student name entry
  const handleStudentNameContinue = (name) => {
    setStudentName(name);
    setShowLanding(false);
    sessionStorage.setItem("hasVisitedStudent", "true");
    sessionStorage.setItem("studentName", name);
  };

  // Handler for ending the poll (passed to TeacherPage)
  const handleEndPoll = () => {
    setPollEnded(true);
    if (socketRef.current) {
      socketRef.current.emit("endPoll");
    }
  };

  // Render landing page if no role selected or not continued
  if (!role || !hasContinued) {
    return (
      <LandingPage
        selectedRole={role}
        setSelectedRole={setRole}
        onContinue={handleRoleContinue}
      />
    );
  }

  // Render student name entry if student and not yet entered
  if (role === "student" && showLanding) {
    return <StudentNameEntry onContinue={handleStudentNameContinue} />;
  }

  // Teacher view: create polls and see results
  if (role === "teacher") {
    return (
      <TeacherPage
        polls={polls}
        onCreatePoll={handleCreatePoll}
        pollEnded={pollEnded}
        onEndPoll={handleEndPoll}
      />
    );
  }

  // Student view: vote on polls and see results
  if (role === "student") {
    return (
      <StudentPage
        polls={polls}
        onVote={handleVote}
        votedPolls={votedPolls}
        studentName={studentName}
        pollEnded={pollEnded}
      />
    );
  }

  return null;
}

export default App;
