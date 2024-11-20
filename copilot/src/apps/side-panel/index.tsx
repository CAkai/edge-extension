import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { userStorage } from "../../libs/user";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useStorage } from "../../packages/storage";
import Auth from "./auth/auth.page";
import ChatBox from "./chat/chatbox.page";
import { navStorage } from "../../libs/navigation";

const queryClient = new QueryClient()

export default function SidePanel() {
  navStorage.set("side-panel");
  const user = useStorage(userStorage);

  return (
    <div className="h-full w-full">
      {!user.icloud.access_token ? <Auth /> : <ChatBox />}
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="h-dvh min-w-[360px]">
        <SidePanel />
      </div>
    </QueryClientProvider>
  </StrictMode>
);
