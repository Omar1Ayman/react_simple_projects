import React from "react";
import Welcome from "./Welcome/Welcome";
import { Routes, Route, Outlet } from "react-router-dom";
import Projects from "./Projects/Projects";
import Project from "../components/Project";
import NotFound from "./404/404";

const Home = () => {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:name" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default Home;
