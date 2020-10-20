import React, { useState, useEffect } from "react";
import firebase from "../components/firebase";
import Email from "./Email/Email";

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://mail.google.com/");

const auth = firebase.auth();

function Auth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  // console.log("accessToken", accessToken);

  // auth = firebase.auth()
  auth.onAuthStateChanged((user) => {
    // console.log(window.gapi);
    // Make sure there is a valid user object
    //____________________________________________________________
    if (user && window.gapi) {
      window.gapi.client
        .init({
          apiKey: process.env.REACT_APP_GAPI_API_KEY,
          clientId: process.env.REACT_APP_GAPI_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: "https://mail.google.com/",
        })

        .then(function () {});
    }
    setIsSignedIn(!!user);
  });

  async function signIn() {
    const result = await auth.signInWithPopup(provider);
    // console.log("result", result);
    setAccessToken(result.credential.accessToken);
  }

  return (
    <>
      {isSignedIn ? (
        <div style={{ margin: "auto", textAlign: "center", width: "60%" }}>
          <h1>Welcome {auth.currentUser.displayName}</h1>
          <p>Signed in!</p>
          <Email accessToken={accessToken} auth={auth} />
          <button onClick={() => auth.signOut()}>Sign out!</button>
        </div>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </>
  );
}

export default Auth;
