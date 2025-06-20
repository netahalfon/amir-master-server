// controllers/wordBankController.js
const Word = require("../models/Word");
const { UserModel } = require("../models/User");
const UserProgress = require("../models/UserProgress");

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find({}).select("-__v");
    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getWordsWithMastery = async (req, res) => {
  try {
  const userId = req.user._id;
  let user = await UserModel.findById(userId).populate("progress");
  const words = await Word.find({}).select("-__v");

  const items = user.progress?.masteries ?? [];


  const masteryMap = new Map();
  items.forEach((m) => {
    masteryMap.set(m.wordId.toString(), m.mastery);
  });
  const wordsWithMastery = words.map((w) => ({
    ...w.toObject(),
    mastery: masteryMap.get(w._id.toString()) || "None",
  }));
  res.json(wordsWithMastery);
  } catch (error) {
    console.error("Error in getWordsWithMastery:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.upsertWords = async (req, res) => {
  try {
    const { words } = req.body;
    const operations = words.map((w) =>
      Word.updateOne(
        { hebrew: w.hebrew, english: w.english },
        { $set: { level: w.level } },
        { upsert: true }
      )
    );

    const results = await Promise.all(operations);

    res.json({ message: "Words upserted successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// exports.resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     if (!token || !newPassword) {
//       return res.status(400).json({ message: "Missing token or password" });
//     }

//     // אימות הטוקן
//     const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
//     const email = decoded.email;

//     // חיפוש המשתמש לפי האימייל מהטוקן
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // הצפנת הסיסמה החדשה
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // עדכון במסד
//     user.password = hashedPassword;
//     await user.save();

//     return res.status(200).json({ message: "Password reset successfully" });

//   } catch (err) {
//     console.error("resetPassword error:", err);
//     if (err.name === "TokenExpiredError") {
//       return res.status(400).json({ message: "Reset link has expired" });
//     }
//     return res.status(500).json({ message: "Invalid or expired token" });
//   }
// };
