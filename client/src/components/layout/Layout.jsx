import { Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";
import ColorModeSwitch from "../ColorModeSwitch";
import { useColorMode } from "../../context/ColorModeProvider"; 

const Layout = () => {
  const navigate = useNavigate();
  const { theme } = useColorMode(); // קבלת הצבעים

  return (
    <main
      className="App"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        minHeight: "100vh",
      }}
    >
      <div className="top-bar">
        <h2>AmirMaster</h2>
        <button className="settings-btn" onClick={() => navigate("/settings")}>
          ⚙️
        </button>
        <ColorModeSwitch />
      </div>
      <Outlet />
    </main>
  );
};

export default Layout;
