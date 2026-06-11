import { Draggable } from "@hello-pangea/dnd";
import API from "../services/api";
import { useState } from "react";

const CardItem = ({ card, index, onClickCard, onTitleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [loading, setLoading] = useState(false);

  const startEditing = (e) => {
    e.stopPropagation(); // prevent opening modal
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(card.title);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed === card.title) {
      setIsEditing(false);
      setTitle(card.title);
      return;
    }

    try {
      setLoading(true);

      const res = await API.put(`/cards/${card._id}`, {
        title: trimmed,
      });

      // Update parent state instantly
      if (onTitleUpdate) {
        onTitleUpdate(card._id, res.data.title);
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update title:", err);
      cancelEditing();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setTitle(card.title);
      setIsEditing(false);
    }
  };
  return (
    /* The Draggable wrapper
       - draggableId MUST be a unique string (we use the card's MongoDB _id)
       - index MUST match its current position sequence within the array loop
    */
    <Draggable draggableId={card._id} index={index} idDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => !isEditing && onClickCard(card)}
          className="card-item"
          style={{
            userSelect: "none",
            padding: "10px",
            margin: "0 0 8px 0",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            boxShadow: snapshot.isDragging
              ? "0 8px 16px rgba(0,0,0,0.2)"
              : "0 1px 3px rgba(0,0,0,0.12)",
            border: "1px solid #e1e4e8",
            cursor: "grab",
            // We combine our custom styles with the positional styles provided by the library
            ...provided.draggableProps.style,
          }}
        >
          {/* TITLE SECTION */}
          {isEditing ? (
            <input
              autoFocus
              value={title}
              disabled={loading}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                fontSize: "0.95rem",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4
                onDoubleClick={startEditing}
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  cursor: "text",
                }}
              >
                {card.title}
              </h4>

              {/* Edit Icon */}
              <span
                onClick={startEditing}
                style={{
                  fontSize: "14px",
                  cursor: "pointer",
                  opacity: 0.6,
                }}
              >
                ✏️
              </span>
            </div>
          )}

          {/* NEW CODE HERE: Mini Color Pill Labels Header Row */}
          {card.tags && card.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginBottom: "6px",
                flexWrap: "wrap",
              }}
            >
              {card.tags.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: color,
                    width: "32px",
                    height: "8px",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          )}
          {/* Card Title
          <h4
            style={{
              margin: "0 0 6px 0",
              color: "#172b4d",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            {card.title}
          </h4> */}

          {/* Optional Card Description Preview */}
          {card.description && (
            <p
              style={{
                margin: 0,
                color: "#5e6c84",
                fontSize: "0.8rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {card.description}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
