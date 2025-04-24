import { createContext, useState, useContext, useEffect } from "react";
import { themeColors } from "../styles/themeColors";


export const ColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState("light");

  // טען את ההעדפה מהדפדפן (אם שמרנו בעבר)
  useEffect(() => {
    const savedMode = localStorage.getItem("colorMode");
    if (savedMode) {
      setColorMode(savedMode);
    }
  }, []);

  // שמור את ההעדפה בלוקאל סטורג'
  useEffect(() => {
    localStorage.setItem("colorMode", colorMode);
    document.body.setAttribute("data-theme", colorMode); // לשימוש עתידי ב־CSS
  }, [colorMode]);

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode,theme: themeColors[colorMode] }}>
      {children}
    </ColorModeContext.Provider>
  );
};

// הוק מותאם לשימוש פשוט בקומפוננטות
export const useColorMode = () => useContext(ColorModeContext);
