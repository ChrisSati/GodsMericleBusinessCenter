import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    setSentMessages([...sentMessages, message]);
    setMessage("");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Message Form */}
        <div className="message-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
            ></textarea>
            <button type="submit">Send</button>
          </form>

          {/* Sent Messages */}
          {sentMessages.length > 0 && (
            <div className="sent-messages">
              <h4>Sent Messages</h4>
              <ul>
                {sentMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <h3>Contact Info</h3>
          <p>Email: info@polu-tech.com</p>
          <p>Phone: +231 77 123 4567</p>
          <p>Monrovia, Liberia</p>
        </div>
      </div>

      {/* Bottom Design Note */}
      <div className="footer-bottom">
        Design by - Chris B. Sati -- Polu Integrated Technology, Monrovia, Liberia
      </div>
    </footer>
  );
};

export default Footer;
