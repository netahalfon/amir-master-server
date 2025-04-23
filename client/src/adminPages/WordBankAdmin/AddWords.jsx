import Reactת, { useState } from "react";
import ModalWrapper from "../../components/ModalWrapper";
import { Form, InputGroup } from "react-bootstrap";
import SingleWordForm from "./SingleWordForm";
import MultipleWordsForm from "./MultipleWordsForm";
const titleStyle = { fontWeight: "bold", fontSize: "1.5rem" };
const subtitleStyle = { marginBottom: "1rem", color: "#555" };

function AddWords({ onClose,onSubmit }) {
  const [mode, setMode] = useState("single");



  return (
    <ModalWrapper onClickOutside={onClose}>
      <div>
        <h2 style={titleStyle}>Add Words</h2>
        <p style={subtitleStyle}>
          Add new words to the word bank. You can add a single word or multiple
          words at once.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          className={`btn ${mode === "single" ? "btn-dark" : "btn-light"}`}
          onClick={() => setMode("single")}
          style={{ flex: 1 }}

        >
          Single Word
        </button>

        <button
          type="button"
          className={`btn ${mode === "multiple" ? "btn-dark" : "btn-light"}`}
          onClick={() => setMode("multiple")}
          style={{ flex: 1 }}

        >
          Multiple Words
        </button>
        </div>
      </div>

      {/* תוכן דינמי לפי המצב */}
      {mode === "single" ? (<SingleWordForm onSubmit={(newWords)=>onSubmit([newWords])} />) : (  <MultipleWordsForm onSubmit={(newWords)=>onSubmit(newWords)}/>   ) }
    </ModalWrapper>
  );
}

export default AddWords;
