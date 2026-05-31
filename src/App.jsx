import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard"; // NEW: Your board selector screen
import BoardCanvas from "./components/BoardCanvas";
import Login from "./components/Login";
import Register from "./components/Registration";

const ProtectedRoute = ({ children }) => {
  const userSession = localStorage.getItem("Quevex_user");
  if (!userSession) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard: Shows the user's personal list of boards */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Dynamic Workspace Screen: Note the ":boardId" param */}
        <Route
          path="/board/:boardId"
          element={
            <ProtectedRoute>
              <BoardCanvas />
            </ProtectedRoute>
          }
        />

        {/* Updated Fallback: Logged in users usually go to dashboard, unauthenticated to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
