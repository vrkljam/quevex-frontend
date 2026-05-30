import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";
import CreateCardForm from "./CreateCardForm";
import API from "../services/api";

const ColumnList = ({ list, onCardAdded, onClickCard, onListDeleted }) => {
  return (
    <div
      className="column-wrapper"
      style={{
        backgroundColor: "#ebecf0",
        width: "280px",
        borderRadius: "8px",
        padding: "12px",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
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
                onListDeleted(list._id); // Inform the master state container to slice it out
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

      {/* The Droppable Container 
        droppableId MUST match the unique database _id of this specific column list
      */}
      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="cards-list"
            style={{
              flexGrow: 1,
              minHeight: "50px", // Ensures there is a drop zone even if the column is totally empty
              overflowY: "auto",
              backgroundColor: snapshot.isDraggingOver
                ? "#dfe1e6"
                : "transparent",
              borderRadius: "4px",
              transition: "background-color 0.2s ease",
              padding: "4px",
            }}
          >
            {/* Loop through and render the cards assigned to this list */}
            {list.cards?.map((card, index) => (
              <CardItem
                key={card._id}
                card={card}
                index={index}
                onClickCard={onClickCard}
              />
            ))}

            {/* Crucial placeholder element required by hello-pangea/dnd to reserve spatial gaps during drops */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <CreateCardForm
        listId={list._id}
        boardId={list.boardId}
        // We will define this function in BoardCanvas next
        onCardAdded={onCardAdded}
      />
    </div>
  );
};

export default ColumnList;
