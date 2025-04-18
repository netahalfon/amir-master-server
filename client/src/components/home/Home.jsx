import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import useAuth, { ROLES } from "../../hooks/useAuth";

const HomeAdmin = [
  { name: "Word Bank", path: "/words-database-admin" },
  { name: "Sentence Completion", path: "/sentence-completion-admin" },
  { name: "Rephrasing", path: "/rephrasing-admin" },
  { name: "Reading Comprehension", path: "/reading-comprehension-admin" },
  { name: "Simulations", path: "/simulation-admin" },
  { name: "User Management", path: "/user-management-admin" },
];

const HomeUser = [
  { name: "Word Notebook", path: "/word-notebook" },
  { name: "Word Practice", path: "/words" },
  { name: "Sentence Completion", path: "/sentence-completion" },
  { name: "Rephrasing", path: "/rephrasing" },
  { name: "Reading Comprehension", path: "/reading" },
  { name: "Simulations", path: "/simulation" },
];

function Home() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const isAdmin = (auth.user.role == ROLES.Admin);

  const menu = isAdmin ? HomeAdmin : HomeUser;

  return (
    <div className="home-container">
      <h1 className="welcome-text">Start practicing now</h1>

      <div className="buttons-grid">
        {menu.map((section, index) => (
          <button
            key={index}
            className="button"
            onClick={() => navigate(section.path)}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
