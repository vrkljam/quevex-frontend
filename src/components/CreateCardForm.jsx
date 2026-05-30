import React, { useState } from "react";
import API from "../services/api";

const CreateCardForm = ({ listId, boardId, onCardAdded }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const response = await API.post("/cards", {
        title: title.trim(),
        listId,
        boardId,
      });

      // Pass the brand new card back up to update our Master Canvas state
      onCardAdded(listId, response.data);
      setTitle("");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to create card:", err);
      alert("Could not create card. Try again!");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "4px",
          color: "#5e6c84",
          textAlign: "left",
          cursor: "pointer",
          fontWeight: "500",
          fontSize: "0.85rem",
          marginTop: "8px",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#091e4214")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        + Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "8px" }}>
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        rows="2"
        required
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #4c9aff",
          boxShadow: "inset 0 0 0 1px #4c9aff",
          resize: "none",
          fontFamily: "sans-serif",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "6px",
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
          {loading ? "Adding..." : "Add card"}
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
  );
};

export default CreateCardForm;
