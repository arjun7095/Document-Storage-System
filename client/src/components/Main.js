import React from "react";
import { Link } from "react-router-dom";
import "../styles/Main.css"; // Import the CSS file

function Main() {
  return (
    <div className="main-container">
      <h1>Welcome to my Document Storage System</h1>
      <h3>If you want to explore my site, Please login</h3>
      <Link to="/login" className="login-link">Login Here</Link>
    </div>
  );
}

export default Main;
