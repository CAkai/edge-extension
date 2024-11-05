import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SidePanel from "./side-panel";
import { Provider } from "react-redux";
import userStore from "../store/user.store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={userStore}>
    <div className="h-dvh min-w-[360px] p-1">
        <SidePanel />
    </div>
    </Provider>
  </StrictMode>
);
