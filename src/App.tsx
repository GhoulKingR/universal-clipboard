import { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, () => {
    setUser(auth.currentUser);
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      navigate("/clipboards");
    }
  }, [user, navigate]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const button = loginButton.current;
    try {
      const request = signInWithPopup(auth, provider);
      button.innerHTML = "Entering account...";
      button.disabled = true;
      await request;
      console.log("Done");
    } catch (error) {
      button.innerHTML = "Google";
      button.disabled = false;

      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      console.error(errorCode, "::::::", errorMessage, "::::::", email);
    }
  };

  const loginButton = useRef<HTMLButtonElement>();

  return (
    <div>
      <div>Log in or create an account with:</div>
      <button onClick={() => login()} ref={loginButton}>
        Google
      </button>
    </div>
  );
}

export default App;
