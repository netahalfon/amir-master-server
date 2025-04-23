import { useEffect, useState } from "react";

function SingleWordForm({ onSubmit, initialWord }) {
  const [hebrew, setHebrew] = useState("");
  const [english, setEnglish] = useState("");
  const [level, setLevel] = useState("1");

  useEffect(() => {
    if (initialWord) {
      setHebrew(initialWord.hebrew || "");
      setEnglish(initialWord.english || "");
      setLevel(initialWord.level || "1");
    }
  }, [initialWord]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: initialWord?.id, hebrew, english, level });
    if (!initialWord) {
      // איפוס רק אם זו הוספה, לא עריכה
      setHebrew("");
      setEnglish("");
      setLevel("1");
    }
  };

  const isEditMode = Boolean(initialWord);

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
      <label
        style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}
      >
        Hebrew:
        <input
          type="text"
          name="hebrew"
          value={hebrew}
          onChange={(e) => setHebrew(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          required
        />
      </label>

      <label
        style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}
      >
        English:
        <input
          type="text"
          name="english"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          required
        />
      </label>

      <label
        style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}
      >
        Level:
        <select
          name="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {isEditMode ? " Save Changes" : "+ Add Word"}
      </button>
    </form>
  );
}

export default SingleWordForm;
