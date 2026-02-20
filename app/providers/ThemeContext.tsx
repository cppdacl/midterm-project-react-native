import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext<any>(null);

export function ThemeProviderCustom({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);

  const theme = {
    background: dark ? "#110f1b" : "#FFFFFF",
    card: dark ? "#15141f" : "#FFFFFF",
    text: dark ? "#F9FAFB" : "#111111",
    border: dark ? "#374151" : "#E5E7EB",
    primary: dark ? "#7C3AED" : "#7C3AED",
    placeholder: dark ? "#9CA3AF" : "#6B7280",
    inputBackground: dark ? "#1f1c27" : "#F3F4F6",
    cardText: dark ? "#F9FAFB" : "#FFFFFF",
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
