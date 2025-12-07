import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// API URL - hardcode backend Render URL
const API_URL = process.env.REACT_APP_API_URL || "https://mail-ao-backend.onrender.com/api";

function App() {
  const [email, setEmail] = useState("");
  const [inbox, setInbox] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto refresh inbox mỗi 5 giây
  useEffect(() => {
    let interval;
    if (autoRefresh && inbox) {
      interval = setInterval(() => {
        refreshInbox(false);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, inbox]);

  // Generate email mới
  const generateEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/alias/new`);
      setEmail(res.data.email);
      setInbox(res.data.inbox);
      setMessages([]);
      setSelectedEmail(null);
      console.log("✅ Email created:", res.data.email);
    } catch (err) {
      console.error("❌ Error generating email:", err);
      alert("Failed to generate email. Check console for details.");
    }
    setLoading(false);
  };

  // Refresh inbox
  const refreshInbox = async (showLoading = true) => {
    if (!inbox) return;
    
    if (showLoading) setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/inbox/${inbox}`);
      setMessages(res.data.emails);
    } catch (err) {
      console.error("❌ Error fetching inbox:", err);
    }
    if (showLoading) setLoading(false);
  };

  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Xem chi tiết email
  const viewEmail = (msg) => {
    setSelectedEmail(msg);
  };

  // Đóng chi tiết email
  const closeEmail = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📧 Temporary Email</h1>
          <p className="subtitle">@congcumienphi.online</p>
        </header>

        <div className="email-section">
          {!email ? (
            <button 
              className="btn btn-primary btn-large" 
              onClick={generateEmail}
              disabled={loading}
            >
              {loading ? "Generating..." : "🎲 Generate Email"}
            </button>
          ) : (
            <div className="email-display">
              <div className="email-box">
                <span className="email-text">{email}</span>
                <button 
                  className="btn btn-copy" 
                  onClick={copyEmail}
                  title="Copy to clipboard"
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              
              <div className="actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => refreshInbox(true)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "🔄 Refresh"}
                </button>
                
                <label className="auto-refresh">
                  <input 
                    type="checkbox" 
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  Auto-refresh (5s)
                </label>

                <button 
                  className="btn btn-new" 
                  onClick={generateEmail}
                >
                  ✨ New Email
                </button>
              </div>
            </div>
          )}
        </div>

        {email && (
          <div className="inbox-section">
            <div className="inbox-header">
              <h2>📬 Inbox ({messages.length})</h2>
            </div>

            {messages.length === 0 ? (
              <div className="no-messages">
                <p>⏳ Waiting for emails...</p>
                <p className="hint">Send an email to <strong>{email}</strong></p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div 
                    key={msg._id} 
                    className="message-item"
                    onClick={() => viewEmail(msg)}
                  >
                    <div className="message-header">
                      <span className="from">📨 {msg.from}</span>
                      <span className="date">
                        {new Date(msg.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="subject">{msg.subject}</div>
                    <div className="preview">
                      {msg.text.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedEmail && (
          <div className="modal" onClick={closeEmail}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedEmail.subject}</h3>
                <button className="btn-close" onClick={closeEmail}>✕</button>
              </div>
              <div className="modal-body">
                <div className="email-meta">
                  <p><strong>From:</strong> {selectedEmail.from}</p>
                  <p><strong>To:</strong> {selectedEmail.to}</p>
                  <p><strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}</p>
                </div>
                <div className="email-content">
                  {selectedEmail.html ? (
                    <iframe
                      title="email-content"
                      srcDoc={selectedEmail.html}
                      style={{ width: "100%", height: "400px", border: "1px solid #ddd" }}
                    />
                  ) : (
                    <pre>{selectedEmail.text}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Powered by ImprovMX • Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
