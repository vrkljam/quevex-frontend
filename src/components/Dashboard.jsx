import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { QuevexLogo } from "./QuevexLogo";

const BrandCapsule = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff", // Pure white for max contrast
        padding: "8px 16px", // Breathing room for the logo
        borderRadius: "50px", // The "Pill" shape
        display: "inline-flex", // Shrinks to fit the content
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Subtle shadow to lift it off the blue
        border: "1px solid #e2e8f0", // Clean edge
      }}
    >
      {children}
    </div>
  );
};

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBoards = async () => {
      try {
        const response = await API.get("/boards");
        setBoards(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load workspace dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserBoards();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await API.post("/boards", { title: newTitle });
      setBoards((prev) => [response.data, ...prev]);
      setNewTitle("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not generate workspace.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Quevex_user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#1e293b",
          background: "#f8fafc",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          fontSize: "1.2rem",
        }}
      >
        Loading Workspace Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(33, 120, 207, .61)",
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "system-ui, sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Upper Navigation Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "24px",
        }}
      >
        {/* Clean, prominent header alignment */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <BrandCapsule>
            <QuevexLogo size={50} />{" "}
            {/* Slightly reduced size to fit beautifully inside the capsule */}
          </BrandCapsule>
        </header>
        <h1
          style={{
            margin: 0,
            fontWeight: "800",
            fontSize: "2.5rem",
            color: "#0f172a",
            letterSpacing: "-0.05em",
          }}
        >
          Quevex Workspaces
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1.1rem",
            boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
          }}
        >
          Log Out
        </button>
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.2rem" }}>
          {error}
        </p>
      )}

      {/* Welcome / How To Use */}
      <div
        style={{
          background: "#ffffff",
          padding: "24px 30px",
          borderRadius: "12px",
          marginBottom: "32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "12px",
            color: "#0f172a",
            fontSize: "1.5rem",
            fontWeight: "700",
          }}
        >
          Welcome to Quevex
        </h2>

        <p style={{ marginBottom: "12px", color: "#475569" }}>
          Quevex helps you organize projects, tasks, and workflows using
          customizable boards, columns, and cards.
        </p>

        <ul
          style={{
            margin: 0,
            // paddingLeft: "20px",
            color: "#334155",
            lineHeight: "1.7",
            textAlign: "left",
          }}
        >
          <li>Create a workspace for a project, team, or area of work.</li>
          <li>
            In the workspace, add the columns you need, such as: Backlog, To Do,
            In Progress, and Completed.
          </li>
          <li>
            In each column you can create cards to track tasks, ideas, bugs, or
            reminders.
          </li>
          <li>Drag and drop cards to different columns as needed.</li>
          <li>
            Double-click card or column titles to rename them, and a
            description, color code, or even archive them.
          </li>
          <li>Archive completed work to keep your boards organized.</li>
        </ul>
      </div>

      {/* Main Split Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "350px 1fr",
          gap: "50px",
          alignItems: "start",
        }}
      >
        {/* Left Column Controls: Create a new Board workspace */}
        <div
          style={{
            background: "#ffffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              fontSize: "1.4rem",
              color: "#334155",
              fontWeight: "700",
            }}
          >
            Create New Workspace
          </h3>
          <form
            onSubmit={handleCreateBoard}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <input
              type="text"
              placeholder="e.g., Marketing Campaign, Sprint Q3..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "6px",
                border: "2px solid #cbd5e1",
                fontSize: "1.1rem",
                outline: "none",
                color: "#0f172a",
                backgroundColor: "#f8fafc",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#4f46e5",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
              }}
            >
              + Build Board
            </button>
          </form>
        </div>

        {/* Right Column Layout: Display User's Boards */}
        <div>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "24px",
              fontSize: "1.8rem",
              color: "#334155",
              fontWeight: "700",
            }}
          >
            Your Project Boards
          </h2>

          {boards.length === 0 ? (
            <p
              style={{
                color: "#64748b",
                fontStyle: "italic",
                fontSize: "1.2rem",
              }}
            >
              You don't have any boards yet. Create one on the left to get
              started!
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {boards.map((board) => (
                <Link
                  key={board._id}
                  to={`/board/${board._id}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    background: board.background || "#4f46e5", // Defaults to a nice Indigo if schema fallback isn't hit
                    height: "140px",
                    padding: "24px",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <span style={{ letterSpacing: "-0.02em" }}>
                    {board.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      opacity: 0.85,
                      background: "rgba(0,0,0,0.15)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      width: "fit-content",
                    }}
                  >
                    Opened: {new Date(board.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
