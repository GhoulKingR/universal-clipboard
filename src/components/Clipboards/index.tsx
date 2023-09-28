import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { Clipboard, getClipboard } from "../../lib";
import Header from "./Header";
import AddToClipBoard from "./AddToClipBoard";
import Body from "./Body";

type InputType = {
  user: User;
};

function ClipboardItems({ user }: InputType) {
  const [clipboard, setClipboard] = useState<Clipboard>([
    { name: "No contents", position: 0 },
  ]);

  // Pull all clipboard data from the server when component runs the first time
  useEffect(() => {
    setClipboard([{ name: "Loading...", position: 0 }]);
    getClipboard(user)
      .then((result) => {
        const clip =
          result.length === 0 ? [{ name: "No content", position: 0 }] : result;
        setClipboard(clip);
      })
      .catch(console.error);
    // eslint-disable-next-line
  }, [user]);

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
