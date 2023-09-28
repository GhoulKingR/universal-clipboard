import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
  GoogleAuthProvider,
  User,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";

type InputType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

function App({ setUser, user }: InputType) {
  const [text, setText] = useState("Google");
  // Watch out for changes in auth state to update the `user` state
  // const [user, setUser] = useState(auth.currentUser);
  // onAuthStateChanged(auth, () => {
  //   setUser(auth.currentUser);
  // });

  // Monitor the user state to take the user to the
  // `/clipboard` page if they're logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      navigate("/clipboards");
    }
  }, [user, navigate]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch(console.error);
  };

  return (
    <div className="flex h-[100vh] justify-center items-center">
      <div className="border-2 border-solid rounded p-3">
        <div className="mb-[15px]">Log in or create an account with:</div>
        <Button
          className="w-full"
          startIcon={<Google />}
          variant="contained"
          onClick={() => login()}
        >
          {text}
        </Button>
      </div>
    </div>
  );
}

export default App;
