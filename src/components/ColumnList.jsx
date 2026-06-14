import { Droppable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";
import CreateCardForm from "./CreateCardForm";
import API from "../services/api";
import { useState, useEffect } from "react";

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
  onListTitleUpdate,
}) => {
  const accent = getColumnColor(list._id);
  const GLOW_STRENGTH = 14; // controls thickness feel

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [loading, setLoading] = useState(false);

  const startEditing = () => {
    setIsEditingTitle(true);
  };

  const cancelEditing = () => {
    setTitle(list.title);
    setIsEditingTitle(false);
  };

  const handleSave = async () => {
    const trimmed = title.trim();

    if (!trimmed || trimmed === list.title) {
      cancelEditing();
      return;
    }

    try {
      setLoading(true);

      const res = await API.put(`/lists/${list._id}`, {
        title: trimmed,
      });

      if (onListTitleUpdate) {
        onListTitleUpdate(list._id, res.data.title);
      }

      setIsEditingTitle(false);
    } catch (err) {
      console.error("Failed to update column title:", err);
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
      cancelEditing();
    }
  };

  useEffect(() => {
    setTitle(list.title);
  }, [list.title]);

  return (
    <div
      className="column-wrapper"
      style={{
        // LEFT GLOW EFFECT (key part)
        boxShadow: `
          inset 10px 0 ${GLOW_STRENGTH}px -8px ${accent},
          0 4px 6px rgba(0,0,0,0.1)
        `,
      }}
    >
      {/* LEFT COLOR STRIP (gives crisp UI accent) */}
      <div
        className="column-accent"
        style={{
          background: `linear-gradient(to bottom,
            ${accent},
            rgba(255,255,255,0.15)
          )`,
        }}
      />

      {/* Column Title Wrapper Row */}
      <div className="column-header">
        <h3 className="column-title-wrapper">
          {isEditingTitle ? (
            <input
              autoFocus
              value={title}
              disabled={loading}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="column-title-input"
            />
          ) : (
            <div
              onDoubleClick={startEditing}
              className="column-title-container"
            >
              <span className="column-title" title={list.title}>
                {list.title}
              </span>

              <span
                onClick={startEditing}
                className="column-edit-icon"
                // onMouseEnter={(e) => (e.target.style.opacity = 1)}
                // onMouseLeave={(e) => (e.target.style.opacity = 0.5)}
              >
                ✏️
              </span>
            </div>
          )}
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
          className="column-delete-btn"
          // onMouseEnter={(e) => (e.target.style.color = "#eb5a46")}
          // onMouseLeave={(e) => (e.target.style.color = "#6b778c")}
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
              backgroundColor: snapshot.isDraggingOver
                ? "rgba(255,255,255,0.4)"
                : "transparent",
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
