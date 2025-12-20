import React from "react";
import "../styles/Loader.css";

function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-ring"></div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}

export default Loader;
