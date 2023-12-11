import "./welcome.css";
import logo from "../../logo.png";
import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <>
      <div className="welcome">
        <img src={logo} alt="logo" />
        <h1 className="title">Many small projects with React</h1>
        <Link className="link" to="projects">
          react projects
        </Link>
      </div>
    </>
  );
};

export default Welcome;
