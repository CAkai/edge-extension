import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-dvh min-w-[360px] p-1">
      <div className="h-full flex items-center justify-center">
        <Login />
      </div>
    </div>
  </StrictMode>
);
