import React, { useState } from "react";
import { Table, DropdownButton, Dropdown, Container } from "react-bootstrap";
import SearchInput from "../components/search/SearchInput";
import LevelBadge from "../components/LevelBadge";
import MultipleSelect from "../components/MultipleSelect";
import { useColorMode } from "../context/ColorModeProvider";

const initialWords = [
  { id: 1, english: "Abandon", hebrew: "לנטוש", level: 2, mastery: "None" },
  { id: 2, english: "Abate", hebrew: "להפחית", level: 3, mastery: "None" },
  { id: 3, english: "Abbreviate", hebrew: "לקצר", level: 2, mastery: "None" },
  { id: 4, english: "Abduct", hebrew: "לחטוף", level: 2, mastery: "None" },
  { id: 5, english: "Aberrant", hebrew: "חריג", level: 3, mastery: "None" },
  { id: 6, english: "Abhor", hebrew: "לתעב", level: 3, mastery: "None" },
  { id: 7, english: "Accumulate", hebrew: "לצבור", level: 1, mastery: "None" },
  { id: 8, english: "Acquiesce", hebrew: "להיכנע", level: 7, mastery: "None" },
  { id: 9, english: "Adhere", hebrew: "לדבוק", level: 4, mastery: "None" },
  { id: 10, english: "Admonish", hebrew: "להזהיר", level: 5, mastery: "None" },
  { id: 11, english: "Advocate", hebrew: "לסנגר", level: 4, mastery: "None" },
  { id: 12, english: "Aesthetic", hebrew: "אסתטי", level: 2, mastery: "None" },
  { id: 13, english: "Alleviate", hebrew: "להקל", level: 6, mastery: "None" },
  {
    id: 14,
    english: "Ambiguous",
    hebrew: "עמום / דו-משמעי",
    level: 5,
    mastery: "None",
  },
  { id: 15, english: "Amend", hebrew: "לתקן", level: 2, mastery: "Don't Know" },
  {
    id: 16,
    english: "Annihilate",
    hebrew: "להשמיד",
    level: 7,
    mastery: "Partially Know",
  },
  { id: 17, english: "Anticipate", hebrew: "לצפות ל-", level: 3, mastery: "None" },
  { id: 18, english: "Appraise", hebrew: "להעריך", level: 6, mastery: "None" },
  { id: 19, english: "Arbitrary", hebrew: "שרירותי", level: 8, mastery: "None" },
  { id: 20, english: "Aspire", hebrew: "לשאוף", level: 2, mastery: "None" },
  { id: 21, english: "Augment", hebrew: "להגדיל", level: 4, mastery: "None" },
  { id: 22, english: "Avid", hebrew: "נלהב", level: 3, mastery: "None" },
  { id: 23, english: "Belligerent", hebrew: "לוחמני", level: 9, mastery: "None" },
  { id: 24, english: "Benevolent", hebrew: "נדיב", level: 4, mastery: "None" },
  { id: 25, english: "Bolster", hebrew: "לתמוך", level: 6, mastery: "None" },
  { id: 26, english: "Cajole", hebrew: "לפתות", level: 7, mastery: "None" },
  { id: 27, english: "Capricious", hebrew: "בלתי צפוי", level: 9, mastery: "None" },
  { id: 28, english: "Coerce", hebrew: "לאלץ", level: 5, mastery: "None" },
  { id: 29, english: "Complacent", hebrew: "שאנן", level: 8, mastery: "None" },
  {
    id: 30,
    english: "Convoluted",
    hebrew: "מסובך",
    level: 10,
    mastery: "Know Well",
  },
];

const masteryOptions = ["None", "Don't Know", "Partially Know", "Know Well"];

export default function WordNoteBook() {
  const [searchText, setSearchText] = useState("");
  const { theme } = useColorMode();
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedMastery, setSelectedMastery] = useState([]);
  const [words, setWords] = useState(initialWords);

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.english.toLowerCase().includes(searchText.toLowerCase()) ||
      word.hebrew.includes(searchText);

    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(word.level);

    const matchesMastery =
      selectedMastery.length === 0 || selectedMastery.includes(word.mastery);

    console.log(selectedMastery, word.mastery, matchesMastery);

    return matchesSearch && matchesLevel && matchesMastery;
  });

  const updateMastery = (id, newMastery) => {
    setWords((prev) =>
      prev.map((word) =>
        word.id === id ? { ...word, mastery: newMastery } : word
      )
    );
  };

  return (
    <Container
      className="mt-4"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <h2>Word Notebooks</h2>
      <p style={{ color: theme.textMuted }}>
        Manage your vocabulary list and track your progress.
      </p>

      <div className="d-flex align-items-center gap-3 my-3">
        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <MultipleSelect
          title={"Level"}
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          selectedOptions={selectedLevels}
          onChange={setSelectedLevels}
        />

        <MultipleSelect
          title={"Master"}
          options={masteryOptions}
          selectedOptions={selectedMastery}
          onChange={setSelectedMastery}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>English</th>
            <th>Hebrew</th>
            <th>Difficulty</th>
            <th>Mastery</th>
          </tr>
        </thead>
        <tbody>
          {filteredWords.map((word) => (
            <tr key={word.id}>
              <td>{word.english}</td>
              <td>{word.hebrew}</td>
              <td>
                <LevelBadge level={word.level} />
              </td>
              <td>
                <DropdownButton
                  variant="outline-secondary"
                  title={word.mastery || "Select"}
                  onSelect={(val) =>
                    setWords((prev) =>
                      prev.map((w) =>
                        w.id === word.id ? { ...w, mastery: val } : w
                      )
                    )
                  }
                >
                  {masteryOptions.map((option, idx) => (
                    <Dropdown.Item key={idx} eventKey={option}>
                      {option || "None"}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
