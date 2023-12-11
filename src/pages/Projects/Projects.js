import React from "react";
import "./projects.css";
import { Link } from "react-router-dom";
import { projects } from "../../dataProjects";
const Projects = () => {
  return (
    <>
      <div className="projects">
        <h1 className="title">Simple Projects With React</h1>
        <div className="row">
          {projects.map((pro) => {
            return (
              <div className="col">
                <h1>{pro.title} App</h1>
                <p> {pro.desc} </p>
                <Link to={`${pro.title}`}>Preview</Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Projects;
