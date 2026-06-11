import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";
import CreateCardForm from "./CreateCardForm";
import API from "../services/api";

// 8 UI-safe pastel accent colors
const COLUMN_COLORS = [
  "#FF6B6B", // red
  "#FFB86B", // orange
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4D96FF", // blue
  "#6C63FF", // purple
  "#FF6EC7", // pink
  "#00C2A8", // teal
];

// deterministic color pick (stable per column)
const getColumnColor = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLUMN_COLORS[Math.abs(hash) % COLUMN_COLORS.length];
};

const ColumnList = ({
  list,
  onCardAdded,
  onClickCard,
  onListDeleted,
  onTitleUpdate,
}) => {
  const accent = getColumnColor(list._id);
  const GLOW_STRENGTH = 14; // controls thickness feel

  return (
    <div
      className="column-wrapper"
      style={{
        position: "relative",

        backgroundColor: "#ebecf0",
        width: "280px",
        borderRadius: "8px",
        padding: "12px",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",

        // LEFT GLOW EFFECT (key part)
        boxShadow: `
          inset 10px 0 ${GLOW_STRENGTH}px -8px ${accent},
          0 4px 6px rgba(0,0,0,0.1)
        `,
      }}
    >
      {/* LEFT COLOR STRIP (gives crisp UI accent) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "10px",
          background: `linear-gradient(
            to bottom,
            ${accent},
            rgba(255,255,255,0.15)
          )`,
          // borderTopLeftRadius: "8px",
          // borderBottomLeftRadius: "8px",
          opacity: 1,
          filter: "brightness(1.15)",
        }}
      />

      {/* Column Title Wrapper Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#172b4d",
            fontSize: "1.1rem",
            fontWeight: "600",
            paddingLeft: "4px",
          }}
        >
          {list.title}
        </h3>

        <button
          onClick={async () => {
            if (
              window.confirm(
                `Delete "${list.title}" and all its containing cards permanently?`,
              )
            ) {
              try {
                await API.delete(`/lists/${list._id}`);
                onListDeleted(list._id);
              } catch (err) {
                console.error("Failed to delete list column:", err);
                alert("Could not delete column list.");
              }
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: "#6b778c",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "4px 8px",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#eb5a46")}
          onMouseLeave={(e) => (e.target.style.color = "#6b778c")}
        >
          ✕
        </button>
      </div>

      {/* Droppable */}
      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="cards-list"
            style={{
              flexGrow: 1,
              minHeight: "50px",
              overflowY: "auto",

              backgroundColor: snapshot.isDraggingOver
                ? "rgba(255,255,255,0.4)"
                : "transparent",

              borderRadius: "4px",
              transition: "background-color 0.2s ease",
              padding: "4px",
            }}
          >
            {list.cards?.map((card, index) => (
              <CardItem
                key={card._id}
                card={card}
                index={index}
                onClickCard={onClickCard}
                onTitleUpdate={onTitleUpdate}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <CreateCardForm
        listId={list._id}
        boardId={list.boardId}
        onCardAdded={onCardAdded}
      />
    </div>
  );
};

export default ColumnList;
