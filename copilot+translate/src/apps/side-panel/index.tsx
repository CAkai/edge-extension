import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SidePanel from "./side-panel.page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
        <div className="h-dvh min-w-[360px]">
          <SidePanel />
        </div>
  </StrictMode>
);
