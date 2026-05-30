import React, { useState } from "react";
import API from "../services/api";

const CardModal = ({ card, onClose, onCardUpdated }) => {
  const [description, setDescription] = useState(card.description || "");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(card.tags || []);

  // Available Trello-like colors mapping
  const AVAILABLE_COLORS = [
    { color: "#61bd4f", label: "Green (Feature)" },
    { color: "#f2d600", label: "Yellow (Review)" },
    { color: "#ff9f1a", label: "Orange (In Progress)" },
    { color: "#eb5a46", label: "Red (Urgent)" },
    { color: "#0079bf", label: "Blue (Info)" },
  ];

  // Toggle color in and out of the array
  const handleTagToggle = (color) => {
    if (tags.includes(color)) {
      setTags(tags.filter((t) => t !== color));
    } else {
      setTags([...tags, color]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await API.put(`/cards/${card._id}`, {
        description: description,
        tags: tags,
      });

      // Pass the updated card data back up to the master state machine
      onCardUpdated(response.data);
      onClose();
    } catch (err) {
      console.error("Failed to update card description:", err);
      alert("Error saving details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inside CardModal.jsx handler logic:
  const handleArchiveClick = async () => {
    try {
      const response = await API.patch(`/cards/${card._id}/archive`);

      // Notify your parent Canvas state to clear this card from display view layouts
      // Passing back the field update flags triggers handleCardUpdated's cleaning filters
      onCardUpdated({ ...card, isArchived: true });
      onClose(); // Shut modal drawer window
    } catch (err) {
      alert("Could not process card archival operation.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // Closes modal if clicking the dark background overlay
    >
      <div
        style={{
          backgroundColor: "#f4f5f7",
          width: "550px",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the window
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#5e6c84",
          }}
        >
          ✕
        </button>

        {/* Card Title Header */}
        <h2
          style={{ margin: "0 0 4px 0", color: "#172b4d", fontSize: "1.4rem" }}
        >
          {card.title}
        </h2>
        <p
          style={{
            margin: "0 0 20px 0",
            color: "#5e6c84",
            fontSize: "0.85rem",
          }}
        >
          in list column
        </p>

        {/* NEW CODE HERE: Color Label Picker Selector */}
        <h3 style={{ margin: "0 0 8px 0", color: "#172b4d", fontSize: "1rem" }}>
          Labels
        </h3>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {AVAILABLE_COLORS.map((item) => {
            const isSelected = tags.includes(item.color);
            return (
              <div
                key={item.color}
                onClick={() => handleTagToggle(item.color)}
                title={item.label}
                style={{
                  backgroundColor: item.color,
                  width: "40px",
                  height: "28px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  border: isSelected
                    ? "2px solid #172b4d"
                    : "2px solid transparent",
                  boxSizing: "border-box",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.1s ease",
                }}
              >
                {isSelected && "✓"}
              </div>
            );
          })}
        </div>

        {/* Description Editor */}
        <h3 style={{ margin: "0 0 8px 0", color: "#172b4d", fontSize: "1rem" }}>
          Description
        </h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a more detailed description for this task..."
          rows="5"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #dfe1e6",
            fontSize: "0.9rem",
            fontFamily: "sans-serif",
            resize: "none",
            boxSizing: "border-box",
            outline: "none",
            backgroundColor: "#fff",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #0079bf")}
          onBlur={(e) => (e.target.style.border = "1px solid #dfe1e6")}
        />

        {/* Save & Delete Action Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                backgroundColor: "#0079bf",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "3px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#172b4d",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

          <button
            onClick={handleArchiveClick}
            style={{
              backgroundColor: "#e2e8f0",
              color: "#334155",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            📦 Archive Task
          </button>

          {/* NEW CODE HERE: Red Delete Button */}
          <button
            onClick={async () => {
              if (
                window.confirm("Are you sure you want to delete this card?")
              ) {
                try {
                  setLoading(true);
                  await API.delete(`/cards/${card._id}`);

                  // Custom prop trick again! We tell the canvas to purge this card from state
                  onCardUpdated({
                    _id: card._id,
                    listId: card.listId,
                    isDeleted: true,
                  });
                  onClose();
                } catch (err) {
                  console.error("Failed to delete card:", err);
                  alert("Could not delete card.");
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={loading}
            style={{
              backgroundColor: "#eb5a46",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "3px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Delete Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
