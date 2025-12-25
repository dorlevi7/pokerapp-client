// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast"; // ⭐ NEW IMPORT

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateGroup from "./screens/CreateGroup";
import MyGroups from "./screens/MyGroups";
import GroupScreen from "./screens/GroupScreen";
import NotificationsScreen from "./screens/NotificationsScreen"; // ⭐ NEW

import GameSettingsScreen from "./screens/GameSettingsScreen";
import GameScreen from "./screens/GameScreen"; // ⭐ NEW IMPORT
import GroupGamesScreen from "./screens/GroupGamesScreen";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* ⭐ GLOBAL TOASTER — חובה */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#1e293b",
              color: "#fff",
              borderRadius: "8px",
            },
          }}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />

          <Route path="/home" element={<HomeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />

          <Route path="/create-group" element={<CreateGroup />} />

          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/group/:groupId" element={<GroupScreen />} />

          <Route path="/notifications" element={<NotificationsScreen />} />

          <Route
            path="/group/:groupId/settings"
            element={<GameSettingsScreen />}
          />

          <Route path="/group/:groupId/game/:gameId" element={<GameScreen />} />

          <Route path="/group/:groupId/games" element={<GroupGamesScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
