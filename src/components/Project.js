import React from "react";
import { useParams } from "react-router-dom";
import { projects } from "../dataProjects";
import BankAccount from "./projects/BancAccount/BankAccount";

const Project = () => {
  const { name } = useParams();

  return (
    <>
      {name === "bankAccount" && <BankAccount />}
      {/* {name === "quiz" && <Quiz />} */}
      {/* {name === "account" && <BankAccount />} */}
    </>
  );
};

export default Project;
