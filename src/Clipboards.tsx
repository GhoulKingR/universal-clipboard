import { signOut } from "firebase/auth";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

function ClipboardItems() {
  const [user] = useState(auth.currentUser);

  // Take the user back if they're not logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  // Pull all clipboard data from the server when component runs the first time
  useEffect(() => {
    getClipboard().then(setClipboard).catch(console.error);
    // eslint-disable-next-line
  }, []);

  /**
   * Gets an array of all the clipboard items stored in the database
   * sorted according to how they were added.
   *
   * @returns string[]
   */
  const getClipboard = async (): Promise<string[]> => {
    const result: string[] = [];
    // Make sure nothing bad happens when user isn't logged in
    if (user === null) return result;

    // Get all documents (sorted by their timestamp)
    const col = collection(db, user?.uid.toString());
    const q = query(col, orderBy("timestamp", "desc"), limit(10));
    const docs = await getDocs(q);

    // Add each document's `item` field to the `result` array
    docs.forEach((doc) => {
      result.push(doc.data().item);
    });

    return result;
  };

  const [clipboard, setClipboard] = useState<string[]>([]);
  const item = useRef<HTMLInputElement>();
  const addButton = useRef<HTMLButtonElement>();

  /**
   * Adds an item to the clipboard
   *
   * @param e React.FormEvent<HTMLFormElement>
   */
  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const button = addButton.current;

    try {
      // Block button clicks
      button.innerHTML = "Adding...";
      button.disabled = true;

      // Add document to collection
      const col = collection(db, user?.uid.toString());
      addDoc(col, {
        item: item.current.value,
        timestamp: serverTimestamp(), // timestamp helps with sorting
      });

      // update clipboard state with new data
      setClipboard(await getClipboard());

      // Restore button and elements
      item.current.value = "";
      button.innerHTML = "Add to universal clipboard";
      button.disabled = false;
    } catch (error) {
      // display error on button and restore after 2 seconds
      button.innerHTML = "Error adding item...";
      setTimeout(() => {
        button.innerHTML = "Add to universal clipboard";
        button.disabled = false;
      }, 2000);
      console.error(error); // also display error on console
    }
  };

  const signout = () => {
    signOut(auth).catch((error) => {
      console.error(error);
    });
  };

  const head: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  };

  return (
    <div>
      <div style={head}>
        <div>{user?.displayName}</div>
        <button onClick={() => signout()}>signout</button>
      </div>
      <form onSubmit={addItem}>
        <input type="text" placeholder="Write or paste text" ref={item} />
        <button type="submit" ref={addButton}>
          Add to universal clipboard
        </button>
      </form>
      {clipboard.map((item, i) => {
        return <div key={i}>{item}</div>;
      })}
    </div>
  );
}

export default ClipboardItems;
