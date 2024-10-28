import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SidePanel from "./main";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-dvh min-w-[360px] p-1">
        <SidePanel />
    </div>
  </StrictMode>
);
