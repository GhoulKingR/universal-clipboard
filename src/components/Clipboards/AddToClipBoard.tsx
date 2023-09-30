import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { FormEvent, useState } from "react";
import { db } from "../../lib/firebase";
import { User } from "@firebase/auth";
import { getClipboard, Clipboard } from "../../lib";
import { Button, Input } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";

type InputType = {
  user: User;
  setClipboard: React.Dispatch<React.SetStateAction<Clipboard>>;
};

function AddToClipBoard({ user, setClipboard }: InputType) {
  const [item, setItem] = useState("");
  const [text, setText] = useState("Add to universal clipboard");
  const [disabled, setDisabled] = useState(false);

  /**
   * Adds an item to the clipboard
   *
   * @param e React.FormEvent<HTMLFormElement>
   */
  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Block button clicks
      setText("Adding...");
      setDisabled(true);

      // Add document to collection
      const col = collection(db, user?.uid.toString());
      addDoc(col, {
        item: item,
        timestamp: serverTimestamp(), // timestamp helps with sorting
      });

      // update clipboard state with new data
      setClipboard(await getClipboard(user));

      // Restore button and elements
      setItem("");
      setText("Add to universal clipboard");
      setDisabled(false);
    } catch (error) {
      // display error on button and restore after 2 seconds
      setText("Error adding item...");
      setTimeout(() => {
        setText("Add to universal clipboard");
        setDisabled(false);
      }, 2000);
      console.error(error); // also display error on console
    }
  };

  return (
    <form onSubmit={addItem} className="flex pb-[30px]">
      <Input
        className="mr-5 flex-1 z-[0]"
        type="text"
        placeholder="Write or paste text"
        value={item}
        onChange={(e) => setItem(e.currentTarget.value)}
        required
      />
      <Button
        className="flex-none z-[0]"
        color="primary"
        type="submit"
        variant="outlined"
        disabled={disabled}
      >
        <div className="hidden sm:inline mr-[10px]">{text}</div>
        <SaveAlt />
      </Button>
    </form>
  );
}

export default AddToClipBoard;
