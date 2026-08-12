import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DayFrameApp } from "./ui/DayFrameApp.js";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("DayFrame root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <DayFrameApp />
  </StrictMode>,
);
