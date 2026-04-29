import React, { useState } from 'react';
import './ChatBot.css';

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI assistant. How can I help you regarding this research paper?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      // Simulate bot reply
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'This is a mocked bot reply. You can connect an LLM backend here later.' }]);
      }, 1000);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <h3>Ask GPT</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span className="msg-text">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chatbot-footer">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..." 
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
