import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/theme-context";
import { Toaster } from "./components/ui/sonner";
// import Test from './Test.jsx'

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </ThemeProvider>,
);
