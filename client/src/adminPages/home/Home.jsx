// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import useAuth, { ROLES } from "../../hooks/useAuth";

const HomeAdmin = [
  {
    name: "Word Bank",
    path: "/words-database-admin",
    description: "Manage Hebrew-English vocabulary",
    icon: "💾",
    color: "#e0edff",
  },
  {
    name: "Sentence Completion",
    path: "/sentence-completion-admin",
    description: "Create and edit chapters with multiple-choice questions",
    icon: "📄",
    color: "#dfffe0",
  },
  {
    name: "Rephrasing Chapters",
    path: "/rephrasing-admin",
    description: "Manage rephrasing exercises with multiple-choice questions",
    icon: "🪶",
    color: "#fffccf",
  },
  {
    name: "Reading Comprehension",
    path: "/reading-comprehension-admin",
    description: "Create passages with multiple-choice questions",
    icon: "📖",
    color: "#f2e8ff",
  },
  {
    name: "Simulation Builder",
    path: "/simulation-admin",
    description: "Create simulation tests by combining chapters",
    icon: "⚙️",
    color: "#ffe6ed",
  },
  {
    name: "User Management",
    path: "/user-management-admin",
    description: "Manage user accounts and permissions",
    icon: "👥",
    color: "#fff2dc",
  },
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

  const isAdmin = auth?.user?.role === ROLES.Admin;
  const menu = isAdmin ? HomeAdmin : HomeUser;

  return (
    <div className="home-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">
        {isAdmin
          ? "Welcome to the admin dashboard for your language learning platform."
          : "Start practicing now"}
      </p>

      <div className="dashboard-grid">
        {menu.map((section, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ backgroundColor: section.color || "#f0f0f0" }}
          >
            <div className="dashboard-card-header">
              <span className="dashboard-icon">{section.icon || "📘"}</span>
              <h2 className="dashboard-card-title">{section.name}</h2>
              {section.description && (
                <p className="dashboard-card-description">
                  {section.description}
                </p>
              )}
            </div>
            <button
              className="dashboard-button"
              onClick={() => navigate(section.path)}
            >
              {isAdmin ? `Manage ${section.name}` : `Go to ${section.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
