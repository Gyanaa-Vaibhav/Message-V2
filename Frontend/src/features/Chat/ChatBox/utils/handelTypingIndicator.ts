import {HandelTypingIndicator} from "./handelMessages/handelMessagesTypes.ts";

const typingTimeouts: { [key: number]: NodeJS.Timeout | null } = {};

export default function handelTypingIndicator({ socket, userId, isUserTyping }: HandelTypingIndicator) {
    // Clear the previous timeout if it exists
    if (typingTimeouts[userId]) {
        clearTimeout(typingTimeouts[userId]);
        typingTimeouts[userId] = null;
    }

    if (!isUserTyping) {
        // Emit "typing" event
        socket?.emit('typing', { to: userId });

        // Set a new timeout to emit "typingOff" after 2500ms
        typingTimeouts[userId] = setTimeout(() => {
            socket?.emit('typingOff', { to: userId });
            typingTimeouts[userId] = null; // Clear the timeout reference
        }, 2500);
    }
}
