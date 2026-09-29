import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OS } from "./os/OS";
import "./os/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OS />
  </StrictMode>,
);
