import { Google } from "@mui/icons-material";
import { Grid, Button } from "@mui/material";
import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../lib/firebase";

type Input = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

function ButtonComponent({ setUser }: Input) {
  const startText = "Get started with Google";
  const loginTextScript = "Log in to your account";

  const [text, setText] = useState(startText);
  const [loginText, setLoginText] = useState(loginTextScript);
  const [disabled, setDisabled] = useState(false);

  const signup = async () => {
    const provider = new GoogleAuthProvider();
    setText("Entering account...");
    setDisabled(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
        setText(startText);
        setDisabled(false);
      });
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    setLoginText("Entering account...");
    setDisabled(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
        setText(loginTextScript);
        setDisabled(false);
      });
  };

  return (
    <Grid item xs={12} sm={6}>
      <div className="pt-[50px] sm:pt-[0px] flex h-full w-full justify-center items-center">
        <div className="w-full sm:w-[300px] ">
          <Button
            className="w-full h-fit mb-[10px]"
            endIcon={<Google />}
            variant="outlined"
            disabled={disabled}
            onClick={() => login()}
            style={{ marginBottom: "20px" }}
          >
            {loginText}
          </Button>
          <Button
            className="w-full h-fit"
            endIcon={<Google />}
            variant="contained"
            disabled={disabled}
            onClick={() => signup()}
          >
            {text}
          </Button>
        </div>
      </div>
    </Grid>
  );
}

export default ButtonComponent;
