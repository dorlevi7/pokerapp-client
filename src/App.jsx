// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateGroup from "./screens/CreateGroup";
import MyGroups from "./screens/MyGroups";
import GroupScreen from "./screens/GroupScreen";
import NotificationsScreen from "./screens/NotificationsScreen"; // ⭐ NEW

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />

          <Route path="/home" element={<HomeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />

          <Route path="/create-group" element={<CreateGroup />} />

          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/group/:groupId" element={<GroupScreen />} />

          {/* ⭐ NEW NOTIFICATIONS ROUTE */}
          <Route path="/notifications" element={<NotificationsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
