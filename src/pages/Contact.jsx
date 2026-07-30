import { useState } from "react";

function Contact() {

  const [message, setMessage] = useState("");

  const [show, setShow] = useState(false);

  return (
    <div>

      <h2>Contact</h2>

      <input
        type="text"
        placeholder="Enter Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <p>Your Message : {message}</p>

      <button onClick={() => setShow(!show)}>
        Toggle Help
      </button>

      {show && (
        <p>Please enter your message above.</p>
      )}

    </div>
  );
}

export default Contact;