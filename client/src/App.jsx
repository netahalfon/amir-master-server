import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

import Signup from "./components/logSighnForggotPages/Signup";
import Login from "./components/logSighnForggotPages/Login";
import ForgotPassword from "./components/logSighnForggotPages/ForgotPassword";

import {
  WordNotebook,
  WordPractice,
  SentenceCompletion,
  Rephrasing,
  ReadingComprehension,
  Simulations,
} from "./components/userPages";

import {
  WordBankAdmin,
  SentenceCompletionAdmin,
  RephrasingAdmin,
  ReadingComprehensionAdmin,
  SimulationsAdmin,
  UserManagementAdmin,
} from "./components/adminPages";

import Home from "./components/home/Home";
import Setting from "./components/Settings";
import Layout from "./components/layout/Layout";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Missing from "./components/Missing";
import { ROLES } from "./hooks/useAuth";

import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import  axios  from "./api/axios";
import { jwtDecode } from "jwt-decode";

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
