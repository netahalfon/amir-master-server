// components/MultipleWordsForm.jsx
import { useState } from "react";

function MultipleWordsForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const lines = text.split("\n").filter(Boolean);
    const words = lines.map((line) => {
      const [hebrew, english, level] = line.split(",").map((s) => s.trim());
      return { hebrew, english, level };
    });

    onSubmit(words);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <label style={{ fontWeight: "bold" }}>
        Enter multiple words (one per line, format: Hebrew,English,Level):
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          placeholder="שלום,Hello,1
תודה,Thank you,8"
        ></textarea>
      </label>

      <button
        type="submit"
        style={{
          padding: "0.75rem",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        + Add Words
      </button>
    </form>
  );
}

export default MultipleWordsForm;
