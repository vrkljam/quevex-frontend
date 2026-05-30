import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import API from "../services/api";
import ColumnList from "./ColumnList";
import CreateListForm from "./CreateListForm";
import CardModal from "./CardModal";
import { useNavigate, useParams } from "react-router-dom";

const BoardCanvas = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  // Archive States
  const [showArchivePanel, setShowArchivePanel] = useState(false);
  const [archivedCards, setArchivedCards] = useState([]);

  const navigate = useNavigate();

  // Fetch entire board tree structure on mount
  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/boards/${boardId}`);
      setBoard(response.data.board);
      setLists(response.data.lists);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load board architecture.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId]);

  // Fetch archived cards specifically when the panel is opened
  const fetchArchivedCards = async () => {
    try {
      const response = await API.get(`/cards/board/${boardId}/archived`);
      setArchivedCards(response.data);
    } catch (err) {
      console.error("Failed to load archive repository:", err);
    }
  };

  useEffect(() => {
    if (showArchivePanel && boardId) {
      fetchArchivedCards();
    }
  }, [showArchivePanel, boardId]);

  // Handle Restoring an archived card back to life
  const handleRestoreCard = async (cardId) => {
    try {
      await API.put(`/cards/${cardId}`, { isArchived: false });
      setArchivedCards((prev) => prev.filter((c) => c._id !== cardId));
      fetchBoardData();
    } catch (err) {
      alert("Could not restore card.");
    }
  };

  // Handle Permanent Deletion out of the database entirely
  const handlePermanentDeleteCard = async (cardId) => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to delete this card forever? This cannot be undone.",
      )
    )
      return;
    try {
      await API.delete(`/cards/${cardId}`);
      setArchivedCards((prev) => prev.filter((c) => c._id !== cardId));
    } catch (err) {
      alert("Could not delete card permanently.");
    }
  };

  const handleCardAdded = (listId, newCard) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list._id === listId) {
          return { ...list, cards: [...list.cards, newCard] };
        }
        return list;
      }),
    );
  };

  const handleCardUpdated = (updatedCard) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list._id === updatedCard.listId) {
          if (updatedCard.isDeleted || updatedCard.isArchived) {
            return {
              ...list,
              cards: list.cards.filter((card) => card._id !== updatedCard._id),
            };
          }
          return {
            ...list,
            cards: list.cards.map((card) =>
              card._id === updatedCard._id ? updatedCard : card,
            ),
          };
        }
        return list;
      }),
    );

    if (updatedCard.isArchived && showArchivePanel) {
      fetchArchivedCards();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Projexis_user");
    navigate("/login");
  };

  const handleListDeleted = (listId) => {
    setLists((prevLists) => prevLists.filter((list) => list._id !== listId));
  };

  const handleListAdded = (newList) => {
    const completeListStructure = { ...newList, cards: [] };
    setLists((prevLists) => [...prevLists, completeListStructure]);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const originalLists = [...lists];
    const updatedLists = lists.map((list) => ({
      ...list,
      cards: [...list.cards],
    }));
    const sourceColumn = updatedLists.find(
      (col) => col._id === source.droppableId,
    );
    const destColumn = updatedLists.find(
      (col) => col._id === destination.droppableId,
    );

    if (source.droppableId === destination.droppableId) {
      const [movedCard] = sourceColumn.cards.splice(source.index, 1);
      sourceColumn.cards.splice(destination.index, 0, movedCard);
      setLists(updatedLists);
    } else {
      const [movedCard] = sourceColumn.cards.splice(source.index, 1);
      movedCard.listId = destination.droppableId;
      destColumn.cards.splice(destination.index, 0, movedCard);
      setLists(updatedLists);
    }

    try {
      await API.post("/cards/reorder", {
        cardId: draggableId,
        sourceListId: source.droppableId,
        destinationListId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      });
    } catch (err) {
      console.error("Database persistence failed, rolling back UI state:", err);
      setLists(originalLists);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "system-ui, sans-serif",
          fontSize: "1.2rem",
          background: "#f8fafc",
          minHeight: "100vh",
          color: "#1e293b",
        }}
      >
        Loading Projexis Board Workspace...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#ef4444",
          fontFamily: "system-ui, sans-serif",
          fontSize: "1.2rem",
          background: "#f8fafc",
          minHeight: "100vh",
          fontWeight: "bold",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className="board-wrapper"
      style={{
        backgroundColor: "rgba(33, 120, 207, .61)", // Crisp light gray workspace foundation
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "system-ui, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Top Header Navigation Dashboard Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "2px solid #2917caff",
          paddingBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "#ffffff",
              color: "#4f46e5",
              border: "2px solid #e2e8f0",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1.05rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            ⬅ Workspaces
          </button>
          <h1
            style={{
              color: "#0f172a",
              margin: 0,
              fontSize: "2.4rem",
              fontWeight: "800",
              letterSpacing: "-0.04em",
            }}
          >
            {board?.title}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <button
            onClick={() => setShowArchivePanel(!showArchivePanel)}
            style={{
              backgroundColor: showArchivePanel ? "#0f172a" : "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1.1rem",
              boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
            }}
          >
            📦 {showArchivePanel ? "Hide Archive" : "Show Archive"}
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
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
      </div>

      {/* Main Drag & Drop Interactive Canvas Environment */}
      <div style={{ display: "flex", width: "100%", alignItems: "start" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            className="columns-container"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              gap: "28px",
              alignItems: "flex-start",
              overflowX: "auto",
              width: showArchivePanel ? "calc(100% - 370px)" : "100%",
              paddingBottom: "24px",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {lists.map((list) => (
              <ColumnList
                key={list._id}
                list={list}
                onCardAdded={handleCardAdded}
                onClickCard={setActiveCard}
                onListDeleted={handleListDeleted}
              />
            ))}
            <CreateListForm
              boardId={board?._id}
              onListAdded={handleListAdded}
            />
          </div>
        </DragDropContext>

        {/* Side Panel Sliding Archive Interface Drawer Container */}
        {showArchivePanel && (
          <div
            style={{
              position: "absolute",
              top: "115px",
              right: "60px",
              width: "340px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "28px",
              color: "#1e293b",
              height: "calc(100vh - 185px)",
              overflowY: "auto",
              zIndex: 100,
              border: "1px solid #e2e8f0",
              animation: "slideIn 0.2s ease-out",
            }}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "1.4rem",
                fontWeight: "800",
                color: "#0f172a",
                borderBottom: "2px solid #f1f5f9",
                paddingBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              📦 Archived Tasks
            </h3>

            {archivedCards.length === 0 ? (
              <p
                style={{
                  color: "#64748b",
                  fontStyle: "italic",
                  textAlign: "center",
                  marginTop: "40px",
                  fontSize: "1.1rem",
                }}
              >
                No archived cards found on this board workspace.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {archivedCards.map((card) => (
                  <div
                    key={card._id}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      padding: "18px",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "1.15rem",
                          fontWeight: "700",
                          color: "#15171c",
                        }}
                      >
                        {card.title}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          background: "#e2e8f0",
                          color: "#475569",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontWeight: "600",
                        }}
                      >
                        Was in: {card.listId?.title || "Unknown List Column"}
                      </span>
                    </div>

                    <div
                      style={{ display: "flex", gap: "12px", marginTop: "4px" }}
                    >
                      <button
                        onClick={() => handleRestoreCard(card._id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#4f46e5",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          boxShadow: "0 1px 2px rgba(79,70,229,0.1)",
                        }}
                      >
                        🔄 Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteCard(card._id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "0.95rem",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {activeCard && (
        <CardModal
          card={activeCard}
          onClose={() => setActiveCard(null)}
          onCardUpdated={handleCardUpdated}
        />
      )}
    </div>
  );
};

export default BoardCanvas;
