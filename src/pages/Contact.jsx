import { useState } from "react";

function Contact() {

  const [message, setMessage] = useState("");

  const [show, setShow] = useState(false);

  return (
    <section className="content-card">
      <h2>Contact</h2>

      <input
        className="contact-input"
        type="text"
        placeholder="Enter Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="contact-actions">
        <button onClick={() => setShow(!show)}>Toggle Help</button>
        <span className="helper-text">Your Message : {message}</span>
      </div>

      {show && <p>Please enter your message above.</p>}
    </section>
  );
}

export default Contact;