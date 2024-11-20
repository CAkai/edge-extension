import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Options from "./options.page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
        <div className="h-dvh w-dvw">
          <Options />
        </div>
  </StrictMode>
);
