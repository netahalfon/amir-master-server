import React, { useState, useEffect } from "react";
import { Table, DropdownButton, Dropdown, Container } from "react-bootstrap";
import LevelBadge from "../components/LevelBadge";
import MultipleSelect from "../components/MultipleSelect";
import { useColorMode } from "../context/ColorModeProvider";
import useApi from "../hooks/useApi";

const masteryOptions = ["None", "Don't Know", "Partially Know", "Know Well"];

export default function wordPractice() {
  const { theme } = useColorMode();
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedMastery, setSelectedMastery] = useState([]);
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getWordBank } = useApi();
  const { getWordMasteries } = useApi();
  const { upsertMastery } = useApi();

  useEffect(() => {
    const fetchWordsAndMasteries = async () => {
      try {
        const [wordsFromServer, masteryData] = await Promise.all([
          getWordBank(),
          getWordMasteries(),
        ]);

        const masteries = masteryData.masteries || [];

        const masteryMap = {};
        masteries.forEach((m) => {
          masteryMap[m.wordId] = m.mastery;
        });

        setWords(
          wordsFromServer.map((word) => ({
            ...word,
            mastery: masteryMap[word._id] || "None",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch words or masteries:", err);
        setError("Failed to load words.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordsAndMasteries();
  }, []);

  useEffect(() => {
    console.log("words התעדכן ל:", words);
  }, [words]);

  const filteredWords = words.filter((word) => {
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(word.level);

    const matchesMastery =
      selectedMastery.length === 0 || selectedMastery.includes(word.mastery);

    console.log(selectedMastery, word.mastery, matchesMastery);

    return matchesLevel && matchesMastery;
  });

  const handleMasterySelect = async (wordId, val) => {
    try {
      await upsertMastery(wordId, val);

      setWords((prev) =>
        prev.map((w) => (w._id === wordId ? { ...w, mastery: val } : w))
      );
    } catch (error) {
      console.error("Error updating mastery:", error);
    }
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

      {filteredWords.length > 0 && (
  <div className="mt-4">
    <p>
      You have <strong>{filteredWords.length}</strong> words to practice:
    </p>
    <p>Choose your preferred practice method:</p>
    <div className="d-flex gap-3">
      <button className="btn btn-primary">
        Flashcards
      </button>
      <button className="btn btn-secondary">
        Multiple Choice
      </button>
    </div>
  </div>
)}

    </Container>
  );
}
