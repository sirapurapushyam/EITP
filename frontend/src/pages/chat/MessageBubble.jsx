export default function MessageBubble({
  message,
  mine,
}) {
  return (
    <div
      className={`flex ${
        mine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[85%]
          sm:max-w-[75%]
          md:max-w-[70%]
          px-3
          sm:px-4
          py-2.5
          sm:py-3
          rounded-2xl
          shadow-sm
          break-words
          whitespace-pre-wrap
          ${
            mine
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white text-gray-800 rounded-bl-md border"
          }
        `}
      >
        {/* Message */}
        <div className="text-sm sm:text-[15px] leading-relaxed">
          {message.content}
        </div>

        {/* Time */}
        <div
          className={`mt-2 text-[10px] sm:text-[11px] ${
            mine
              ? "text-blue-100"
              : "text-gray-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}