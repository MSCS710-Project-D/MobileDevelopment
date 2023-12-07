import React, { useState } from 'react';
import { sendMessageToDialogflow } from '../reducers/DialogFlow'; // Adjust the path if needed

const ChatComponent = () => {
    const [message, setMessage] = useState(''); // Assuming you're storing the user's message in state

    const handleSendMessage = async () => {
        const response = await sendMessageToDialogflow(message);
        // Display the response in your chat UI
        // For example, you might update the chat history state with the response
    };

    return (
        <div>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
            />
            <button onClick={handleSendMessage}>Send</button>
            {/* Rest of your chat UI */}
        </div>
    );
}

export default ChatComponent;
