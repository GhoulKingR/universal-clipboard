import { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function App() {
  // Watch out for changes in auth state to update the `user` state
  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, () => {
    setUser(auth.currentUser);
  });

  // Monitor the user state to take the user to the
  // `/clipboard` page if they're logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      navigate("/clipboards");
    }
  }, [user, navigate]);

  const login = () => {
    // Initialize the google login process
    const provider = new GoogleAuthProvider();
    const button = loginButton.current;

    try {
      // Start sign in process
      signInWithPopup(auth, provider);
      // This is asynchronous so it'll go on while the lines below run

      // Disable the button and show that it's loggin in
      button.innerHTML = "Entering account...";
      button.disabled = true;
    } catch (error) {
      // display error on button and restore after 2 seconds
      button.innerHTML = "Error adding item...";
      setTimeout(() => {
        button.innerHTML = "Google";
        button.disabled = false;
      }, 2000);

      console.error(error);
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
