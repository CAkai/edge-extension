import { navStorage } from "../../../libs/navigation";
import HistoryChat from "./history-chat.component";
import ModelList from "./model-list.component";

export default function ChatBox() {
    navStorage.set("side-panel/chat");

    return (
        <div className="h-full w-full p-2 flex flex-col justify-between">
            <div className="flex justify-between mb-1">
                <ModelList />
                <HistoryChat />
            </div>
        </div>
    );
}