import React, { useState, useEffect } from "react";
import "./Email.css";

function Email(props) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    subject: "",
    body: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      ["from"]: props.auth.currentUser.email,
    });
  }, []);

  function changeHandler(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function sendMail(e) {
    e.preventDefault();
    console.log(
      "window.gapi",
      window.gapi.auth2.getAuthInstance().isSignedIn.get()
    );
    console.log("formData", formData);
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      console.log("Gapi", window.gapi.client);
      const message =
        `From: ${formData.from}\r\n` +
        `To: ${formData.to}\r\n` +
        `Subject: ${formData.subject}\r\n\r\n` +
        `${formData.body}`;

      // The body needs to be base64url encoded.
      const encodedMessage = btoa(message);

      const reallyEncodedMessage = encodedMessage
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      window.gapi.client.gmail.users.messages
        .send({
          userId: "me",
          resource: {
            raw: reallyEncodedMessage,
          },
        })
        .then(function () {
          console.log("done!");
        });
    } else {
      // firebase.auth().signOut(); // Something went wrong, sign out
    }
  }

  return (
    <div className="email-form">
      <form action="" onSubmit={sendMail}>
        <label htmlFor="to">Recipient:</label>
        <input type="text" name="to" onChange={changeHandler} />
        <label htmlFor="subject">Subject:</label>
        <input type="text" name="subject" onChange={changeHandler} />
        <label htmlFor="body">Message:</label>
        <input type="text" name="body" onChange={changeHandler} />
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
}

export default Email;
