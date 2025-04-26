import React, { useState, useEffect } from "react";
import { Table, DropdownButton, Dropdown, Container } from "react-bootstrap";
import SearchInput from "../components/search/SearchInput";
import LevelBadge from "../components/LevelBadge";
import MultipleSelect from "../components/MultipleSelect";
import { useColorMode } from "../context/ColorModeProvider";
import useApi from "../hooks/useApi"; // או לפי הנתיב הנכון אצלך


const masteryOptions = ["None", "Don't Know", "Partially Know", "Know Well"];

export default function WordNoteBook() {
  const [searchText, setSearchText] = useState("");
  const { theme } = useColorMode();
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedMastery, setSelectedMastery] = useState([]);
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getWordBank } = useApi();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const wordsFromServer = await getWordBank();
        setWords(
          wordsFromServer.map((word) => ({
            ...word,
            mastery: word.mastery || "None",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch words:", err);
        setError("Failed to load words.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  useEffect(() => {
    console.log("words התעדכן ל:", words);
  }, [words]);

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

  const updateMastery = (_id, newMastery) => {
    setWords((prev) =>
      prev.map((word) =>
        word._id === _id ? { ...word, mastery: newMastery } : word
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
            <tr key={word._id}>
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
                        w._id === word._id ? { ...w, mastery: val } : w
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
