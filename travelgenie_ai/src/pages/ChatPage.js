import React, { useState, useRef, useEffect } from "react";

// PUBLIC_INTERFACE
function ChatPage() {
  /**
   * ChatPage: AI chatbot assistant, using Cohere LLM API (process.env.REACT_APP_COHERE_KEY).
   * The user can enter travel-related questions and receive responses from the AI.
   */
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your travel AI. Ask me anything about your destination, planning, packing, and more." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);

    // Use Cohere generate endpoint for Q&A
    const prompt = `You are a helpful travel assistant. Recent conversation:\n\n` +
      messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n") +
      `\nUser: ${input}\nAssistant:`;

    try {
      const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_COHERE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "command",
          prompt,
          max_tokens: 180,
          temperature: 0.7,
          stop_sequences: ["User:"]
        })
      });
      const data = await response.json();
      if (data.generations && data.generations.length > 0) {
        setMessages(msgs => [
          ...msgs,
          { role: "assistant", text: data.generations[0].text.trim() }
        ]);
      } else {
        setMessages(msgs => [
          ...msgs,
          { role: "assistant", text: "Sorry, I couldn't generate a response." }
        ]);
      }
    } catch {
      setMessages(msgs => [
        ...msgs,
        { role: "assistant", text: "Error: Unable to contact AI service." }
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>TravelGenie Chat Assistant</h2>
      <div style={{
        background: "#0a142a",
        minHeight: 240, maxHeight: 370, overflowY: "auto",
        borderRadius: 10, margin: "22px 0", padding: "16px 10px",
        border: "1.5px solid rgba(255,255,255,0.06)"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              background: msg.role === "user" ? "#17375e" : "#156f6a",
              borderRadius: 8,
              color: msg.role === "user" ? "#fff" : "#bafffd",
              marginBottom: 8,
              maxWidth: "84%",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              padding: "8px 12px",
              marginLeft: msg.role === "assistant" ? 0 : "auto"
            }}
          >
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: "#ccc" }}>AI is typing...</div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a travel question..."
          className="input"
          style={{ flex: 1 }}
          required
          disabled={loading}
        />
        <button className="btn" type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
}

export default ChatPage;
