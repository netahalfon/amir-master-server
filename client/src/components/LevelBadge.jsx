import React from "react";

const blueShades = {
  1: "#cce5ff",
  2: "#99ccff",
  3: "#66b2ff",
  4: "#3399ff",
  5: "#007bff",
  6: "#0069d9",
  7: "#0056b3",
  8: "#004085",
  9: "#002752",
  10: "#001a33"
};

export default function LevelBadge({ level }) {
  const backgroundColor = blueShades[level] || "#ccc";
  const textColor = level <= 4 ? "#000" : "#fff";

  return (
    <span
      style={{
        backgroundColor,
        color: textColor,
        padding: "4px 10px",
        borderRadius: "12px",
        fontWeight: "bold",
        display: "inline-block",
        minWidth: "60px",
        textAlign: "center"
      }}
    >
      Level {level}
    </span>
  );
}
