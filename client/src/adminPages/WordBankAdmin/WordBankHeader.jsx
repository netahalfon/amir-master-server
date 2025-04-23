import React from "react";

function WordBankHeader({onDeleteSelected, onAddWord}) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="m-0">Word Bank </h1>

      <div className="d-flex gap-2">
        <button type="button" class="btn btn-danger" onClick={onDeleteSelected}>
    
          Delete Selected
        </button>

        <button type="button" class="btn btn-dark " onClick={onAddWord}>
          + Add Word
        </button>
      </div>
    </div>
  );
}

export default WordBankHeader;
