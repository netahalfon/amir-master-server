import { Routes, Route } from "react-router-dom";



import Signup from "./logSighnForggotPages/Signup";
import Login from "./logSighnForggotPages/Login";
import ForgotPassword from "./logSighnForggotPages/ForgotPassword";

// user pages
import WordNotebook from "./userPages/WordNotebook";
import WordPractice from "./userPages/WordPractice";
import SentenceCompletion from "./userPages/SentenceCompletion";
import Rephrasing from "./userPages/Rephrasing";
import ReadingComprehension from "./userPages/ReadingComprehension";
import Simulations from "./userPages/Simulations";

// admin pages
import WordBankAdmin from "./adminPages/WordBankAdmin/WordBankAdmin";
import SentenceCompletionAdmin from "./adminPages/SentenceCompletionAdmin";
import RephrasingAdmin from "./adminPages/RephrasingAdmin";
import ReadingComprehensionAdmin from "./adminPages/ReadingComprehensionAdmin";
import SimulationsAdmin from "./adminPages/SimulationsAdmin";
import UserManagementAdmin from "./adminPages/UserManagementAdmin";
import Home from "./adminPages/home/Home";

// common
import Setting from "./components/Settings";
import Layout from "./components/layout/Layout";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Missing from "./components/Missing";
import { ROLES } from "./hooks/useAuth";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

function App() {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    axios
      .get("/refresh")
      .then((res) => {
        const { accessToken } = res.data;
        const user = jwtDecode(accessToken); // נדרש דיבוג
        setAuth({ accessToken, user });
      })
      .catch(() => {
        console.log("Refresh failed:", err);
      });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="signUp" element={<Signup />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* user routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="word-notebook" element={<WordNotebook />} />
          <Route path="words" element={<WordPractice />} />
          <Route path="sentence-completion" element={<SentenceCompletion />} />
          <Route path="rephrasing" element={<Rephrasing />} />
          <Route path="reading" element={<ReadingComprehension />} />
          <Route path="simulation" element={<Simulations />} />
        </Route>

        {/* admin routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="words-database-admin" element={<WordBankAdmin />} />
          <Route
            path="sentence-completion-admin"
            element={<SentenceCompletionAdmin />}
          />
          <Route path="rephrasing-admin" element={<RephrasingAdmin />} />
          <Route
            path="reading-comprehension-admin"
            element={<ReadingComprehensionAdmin />}
          />
          <Route path="simulation-admin" element={<SimulationsAdmin />} />
          <Route
            path="user-management-admin"
            element={<UserManagementAdmin />}
          />
        </Route>

        {/* connected user routes */}
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
        >
          <Route path="home" element={<Home />} />
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* 404 not found page */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
