import { onAuthStateChanged, signOut } from "firebase/auth";
import { FormEvent, useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";

function ClipboardItems() {
  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, () => {
    setUser(auth.currentUser);
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user]);
  useEffect(() => {
    getClipboard().then(setClipboard).catch(console.error);
  }, []);

  const getClipboard = async (): Promise<string[]> => {
    const col = collection(db, user.uid.toString());
    const docs = await getDocs(col);
    const result: string[] = [];
    docs.forEach((doc) => {
      result.push(doc.data().item);
    });
    return result;
  };

  const [clipboard, setClipboard] = useState<string[]>([]);
  const item = useRef<HTMLInputElement>();

  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const col = collection(db, user.uid.toString());
    try {
      addDoc(col, {
        item: item.current.value,
      });

      setClipboard(await getClipboard());
      item.current.value = "";
    } catch (error) {
      alert("There was an error");
      console.error(error);
    }
  };

  const signout = () => {
    signOut(auth).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div>
      <div>
        {user?.displayName}
        <button onClick={() => signout()}>signout</button>
      </div>
      <form onSubmit={addItem}>
        <input type="text" placeholder="Write or paste text" ref={item} />
        <button type="submit">Add to universal clipboard</button>
      </form>
      {clipboard.map((item, i) => {
        return <div key={i}>{item}</div>;
      })}
    </div>
  );
}

export default ClipboardItems;
