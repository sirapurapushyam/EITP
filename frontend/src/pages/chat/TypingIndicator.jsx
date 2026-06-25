export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>
          <span
            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>

      <span className="text-sm text-gray-500">
        Typing...
      </span>
    </div>
  );
}