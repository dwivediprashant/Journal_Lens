import { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import apiClient from "../../configs/apiClient";
import { useAuth } from "@clerk/react";

export default function ChatBot({
  isOpen,
  onClose,
  journalId,
  pdfUrl,
  abstract,
  title,
  authors,
}) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your AI assistant. How can I help you regarding this research paper?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | ingesting | ready | error
  const chatHistory = useRef([]);
  const ingestedId = useRef(null);

  const getMessageIcon = (sender) => {
    if (sender === "bot") {
      return <i className="fa-regular fa-message msg-icon"></i>;
    }

    return <i className="fa-regular fa-user msg-icon"></i>;
  };

  // Jab bhi chatbot open ho aur naya journal ho — auto ingest
  useEffect(() => {
    if (isOpen && pdfUrl && ingestedId.current !== pdfUrl) {
      ingestPaper();
    }
  }, [isOpen, journalId, pdfUrl]);

  function addMessage(sender, text) {
    setMessages((prev) => [...prev, { sender, text }]);
  }

  async function ingestPaper() {
    setStatus("ingesting");
    addMessage("bot", "Loading paper information...");
    try {
      const token = await getToken();
      const res = await apiClient.post(
        "/chat/ingest-text",
        {
          journalId: journalId,
          text: `Title: ${title}\nAuthors: ${authors}\n\nAbstract:\n${abstract}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      ingestedId.current = journalId;
      chatHistory.current = [];
      setStatus("ready");
      addMessage("bot", "Paper loaded! Ask me anything about it.");
    } catch (err) {
      setStatus("error");
      addMessage("bot", `Error: ${err?.response?.data?.error || err.message}`);
    }
  }

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading || status !== "ready") return;

    addMessage("user", question);
    setInput("");
    setLoading(true);
    chatHistory.current.push({ role: "user", content: question });

    try {
      const token = await getToken();
      const res = await apiClient.post(
        "/chat/ask",
        {
          journalId,
          question,
          chatHistory: chatHistory.current.slice(-6),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data;

      chatHistory.current.push({ role: "assistant", content: data.answer });
      addMessage("bot", data.answer);
    } catch (err) {
      addMessage("bot", `Error: ${err?.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <div className="chatbot-header">
        <h3>Ask AI</h3>
        <button onClick={onClose} className="close-btn">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span className="msg-icon-wrap">{getMessageIcon(msg.sender)}</span>
            <span className="msg-text">{msg.text}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <i className="fa-solid fa-spinner fa-spin msg-icon"></i>
            <span className="msg-text">Thinking...</span>
          </div>
        )}
      </div>
      <div className="chatbot-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            status === "ingesting"
              ? "Indexing paper..."
              : status === "error"
                ? "Error loading paper"
                : loading
                  ? "Waiting..."
                  : "Ask a question..."
          }
          disabled={loading || status !== "ready"}
        />
        <button onClick={handleSend} disabled={loading || status !== "ready"}>
          Send
        </button>
      </div>
    </div>
  );
}
