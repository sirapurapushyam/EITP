import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { getSocket } from "../../api/socket";

export default function MessageInput({ chatId }) {
  const [content, setContent] = useState("");

  const socket = getSocket();

  const send = () => {
    const text = content.trim();

    if (!text) return;

    socket.emit("send_message", {
      chatId,
      content: text,
    });

    socket.emit("stop_typing", {
      chatId,
    });

    setContent("");
  };

  const handleChange = (e) => {
    setContent(e.target.value);

    socket.emit("typing", {
      chatId,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Message Input */}
        <input
          type="text"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() =>
            socket.emit("stop_typing", {
              chatId,
            })
          }
          placeholder="Type a message..."
          className="
            flex-1
            min-w-0
            px-4
            sm:px-5
            py-2.5
            sm:py-3
            rounded-full
            border
            outline-none
            text-sm
            sm:text-base
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
          "
        />

        {/* Send Button */}
        <button
          onClick={send}
          disabled={!content.trim()}
          className="
            shrink-0
            flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-blue-600
            px-4
            sm:px-6
            py-2.5
            sm:py-3
            text-white
            text-sm
            font-medium
            transition
            hover:bg-blue-700
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <SendHorizontal size={18} />
          <span className="hidden sm:inline">
            Send
          </span>
        </button>

      </div>
    </div>
  );
}