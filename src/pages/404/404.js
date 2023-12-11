import React from "react";
import { Link } from "react-router-dom";
import "./404.css";
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Not Found 😐</h1>
      <p>The page you are looking for does not exist.</p>
      <p>
        Go back to <Link to="/">home</Link>.
      </p>
    </div>
  );
};

export default NotFound;
