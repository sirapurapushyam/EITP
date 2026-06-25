import { useSelector } from "react-redux";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatPage() {
  const activeChat = useSelector(
    (state) => state.chat.activeChat
  );

  return (
    <div className="h-[calc(100vh-170px)] overflow-hidden">

      {/* Desktop Layout */}
      <div className="hidden lg:grid h-full grid-cols-12 gap-4">

        {/* Sidebar */}
        <div className="col-span-4 h-full overflow-hidden">
          <ChatSidebar />
        </div>

        {/* Chat Window */}
        <div className="col-span-8 h-full overflow-hidden">
          <ChatWindow />
        </div>

      </div>

      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden h-full">

        {!activeChat ? (
          <ChatSidebar />
        ) : (
          <ChatWindow />
        )}

      </div>

    </div>
  );
}