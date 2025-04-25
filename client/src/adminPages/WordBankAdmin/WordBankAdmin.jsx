import WordBankHeader from "./WordBankHeader";
import SearchInput from "../../components/search/SearchInput";
import WordsDataGrid from "../../components/WordsDataGrid";
import { useState } from "react";
import AdminDataGrid from "./AdminDataGrid";
import AddWords from "./AddWords";
import EditWordModal from "./EditWordModal";
//הגדרת עמודות
const columns = [
  { field: "english", headerName: "english", width: 200 },
  { field: "hebrew", headerName: "hebrew", width: 300 },
  { field: "level", headerName: "level", width: 100 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <strong>
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </button>
      </strong>
    ),
  },
];

//תוכן הטבלה
const initialWords = [
  { id: 1, english: "neta", hebrew: "נטע", level: 1 },
  { id: 2, english: "gil", hebrew: "גיל", level: 2 },
  { id: 3, english: "yali", hebrew: "יהלי", level: 3 },
];

function WordBankAdmin() {
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editWord, setEditWord] = useState(null);
  const [words, setWords] = useState(initialWords);


  

  const handleAddWords = (wordsToAdd) => {
    console.log("Adding words:", wordsToAdd);

    const nextId =
      words.length > 0 ? Math.max(...words.map((w) => w.id || 0)) + 1 : 1;

      const wordsWithId = wordsToAdd.map((word, i) => ({
        ...word,
        id: nextId + i,
      }));

    setWords((prevWords) => [...prevWords, ...wordsWithId]);
    console.log("Updated words:", [...words, ...wordsWithId]);
  };

  const handleDeleteWords = () => {
    setWords((prevWords) =>
      prevWords.filter((word) => !selectedRows.includes(word.id))
    );
    setSelectedRows([]);
  };

  const handleUpdateWord = (updatedWord) => {
    console.log("Updating word:", updatedWord);
    setWords((prevWords) =>
      prevWords.map((word) => {
        if (!word || typeof word.id === "undefined") return word;
        return word.id === updatedWord.id ? updatedWord : word;
      })
    );
  };

  const openAddModal = () => {
    console.log("Opening add modal");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    console.log("Closing add modal");
    setShowAddModal(false);
  };

  const openEditModal = (row) => {
    console.log("Openning edit modal");
    setEditWord(row);
  };

  const closeEditModal = () => {
    console.log("Closing edit modal");
    setEditWord(null);
  };

  const filteredRows = words.filter(
    (row) =>
      row.english.toLowerCase().includes(searchText.toLowerCase()) ||
      row.hebrew.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="m-4">
        <WordBankHeader
          onDeleteSelected={handleDeleteWords}
          onAddWord={openAddModal}
        />
        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <AdminDataGrid
          rows={filteredRows}
          columns={columns}
          onEdit={(row) => openEditModal(row)}
          selectedRows={selectedRows}
          onToggleRow={toggleRow}
        />
      </div>
      {showAddModal && (
        <AddWords
          onClose={closeAddModal}
          onSubmit={(newWords) => {
            handleAddWords(newWords);
            closeAddModal();
          }}
        />
      )}
      {editWord && (
        <EditWordModal
          word={editWord}
          onSave={(newWord) => {
            handleUpdateWord(newWord);
            closeEditModal();
          }}
          onClose={closeEditModal}
        />
      )}
    </>
  );
}

export default WordBankAdmin;
