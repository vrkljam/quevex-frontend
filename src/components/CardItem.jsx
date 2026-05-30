import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const CardItem = ({ card, index, onClickCard }) => {
  return (
    /* The Draggable wrapper
       - draggableId MUST be a unique string (we use the card's MongoDB _id)
       - index MUST match its current position sequence within the array loop
    */
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClickCard(card)}
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
          {/* Card Title */}
          <h4
            style={{
              margin: "0 0 6px 0",
              color: "#172b4d",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            {card.title}
          </h4>

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
