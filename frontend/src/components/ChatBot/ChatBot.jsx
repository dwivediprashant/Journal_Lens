import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const API_BASE = 'http://localhost:8080'; // apna backend port

export default function ChatBot({ isOpen, onClose, journalId, pdfUrl, abstract, title, authors}) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI assistant. How can I help you regarding this research paper?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | ingesting | ready | error
  const chatHistory = useRef([]);
  const ingestedId = useRef(null);

  // Jab bhi chatbot open ho aur naya journal ho — auto ingest
  useEffect(() => {
    if (isOpen && pdfUrl && ingestedId.current !== pdfUrl){
      ingestPaper();
    }
  }, [isOpen, journalId, pdfUrl]);

  function addMessage(sender, text) {
    setMessages(prev => [...prev, { sender, text }]);
  }

  async function ingestPaper() {
    setStatus('ingesting');
    addMessage('bot', '📄 Loading paper information...');
    try {
      const res = await fetch(`${API_BASE}/api/chat/ingest-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalId: journalId,
          text: `Title: ${title}\nAuthors: ${authors}\n\nAbstract:\n${abstract}`,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    ingestedId.current = journalId;
    chatHistory.current = [];
    setStatus('ready');
    addMessage('bot', '✅ Paper loaded! Ask me anything about it.');
  } catch (err) {
    setStatus('error');
    addMessage('bot', `❌ Error: ${err.message}`);
  }
}

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading || status !== 'ready') return;

    addMessage('user', question);
    setInput('');
    setLoading(true);
    chatHistory.current.push({ role: 'user', content: question });

    try {
      const res = await fetch(`${API_BASE}/api/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalId,
          question,
          chatHistory: chatHistory.current.slice(-6),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      chatHistory.current.push({ role: 'assistant', content: data.answer });
      addMessage('bot', data.answer);
    } catch (err) {
      addMessage('bot', `⚠️ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <h3>Ask AI</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span className="msg-text">{msg.text}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <span className="msg-text">Thinking...</span>
          </div>
        )}
      </div>
      <div className="chatbot-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            status === 'ingesting' ? 'Indexing paper...' :
            status === 'error'     ? 'Error loading paper' :
            loading                ? 'Waiting...' :
                                     'Ask a question...'
          }
          disabled={loading || status !== 'ready'}
        />
        <button onClick={handleSend} disabled={loading || status !== 'ready'}>
          Send
        </button>
      </div>
    </div>
  );
}