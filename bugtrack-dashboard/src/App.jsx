import { useState } from "react";
import { getToken, logout } from "./api/bugtrackApi";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));

  function handleLoginSuccess() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    logout();
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <DashboardPage onLogout={handleLogout} />;
}

export default App;