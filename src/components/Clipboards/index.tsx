import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { Clipboard, getClipboard } from "../../lib";
import Header from "./Header";
import AddToClipBoard from "./AddToClipBoard";
import Body from "./Body";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";

type InputType = {
  user: User;
};

// TODO: Test this aspect, I just tried something that might help with
// detecting if the user is logged in

function ClipboardItems({ user }: InputType) {
  const navigate = useNavigate();

  onAuthStateChanged(auth, () => {
    if (auth.currentUser === null) {
      navigate("/");
    }
  });

  useEffect(() => {
    setClipboard([{ name: "Loading...", position: 0 }]);
    getClipboard(user)
      .then((result) => {
        const clip =
          result.length === 0 ? [{ name: "No content", position: 0 }] : result;
        setClipboard(clip);
      })
      .catch(console.error);
  }, [user]);

  const [clipboard, setClipboard] = useState<Clipboard>([
    { name: "No contents", position: 0 },
  ]);

  return (
    <div>
      <Header user={user} />
      <Container>
        <AddToClipBoard user={user} setClipboard={setClipboard} />
        <Body clipboard={clipboard} setClipboard={setClipboard} />
      </Container>
    </div>
  );
}

export default ClipboardItems;
