import React, { useState } from "react";
import API from "../services/api";

const CreateListForm = ({ boardId, onListAdded }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const response = await API.post("/lists", {
        title: title.trim(),
        boardId,
      });

      // Pass the brand new list object back up to the master canvas state
      onListAdded(response.data);
      setTitle("");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to create list:", err);
      alert("Could not create list. Try again!");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        style={{
          minWidth: "280px",
          flexShrink: 0,
          padding: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.24)",
          border: "none",
          borderRadius: "8px",
          color: "#ffffff",
          textAlign: "left",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "0.9rem",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.35)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.24)")
        }
      >
        + Add another list
      </button>
    );
  }

  return (
    <div
      style={{
        minWidth: "280px",
        flexShrink: 0,
        backgroundColor: "#ebecf0",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "2px solid #4c9aff",
            fontSize: "0.9rem",
            fontWeight: "500",
            boxSizing: "border-box",
            outline: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            alignItems: "center",
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#0079bf",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "3px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {loading ? "Adding..." : "Add list"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#6b778c",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListForm;
