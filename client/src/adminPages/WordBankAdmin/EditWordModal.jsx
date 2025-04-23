import React from "react";
import ModalWrapper from "../../components/ModalWrapper";
import SingleWordForm from "./SingleWordForm";
const titleStyle = { fontWeight: "bold", fontSize: "1.5rem" };
const subtitleStyle = { marginBottom: "1rem", color: "#555" };


function EditWordModal({ word, onSave, onClose }) {
  return (
    <ModalWrapper>
      <div>
        <h2 style={titleStyle}>Edit Words</h2>
        <p style={subtitleStyle}>
          Make changes to the word. Click save when you're done.{" "}
        </p>
      </div>
      <SingleWordForm
        onSubmit={(newWord) => onSave(newWord)}
        initialWord={word}
        onClose={onClose}
      />
    </ModalWrapper>
  );
}

export default EditWordModal;
