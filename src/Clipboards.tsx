import { signOut } from "firebase/auth";
import {
  CSSProperties,
  FormEvent,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { Container, Input, Button } from "@mui/material";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  ContentCopy,
  ContentCopyTwoTone,
  Logout,
  SaveAlt,
} from "@mui/icons-material";
import styled from "styled-components";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

type Item = {
  name: string;
  position: number;
  checked?: boolean;
};
type Clipboard = Item[];

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
    setClipboard([{ name: "Loading...", position: 0 }]);
    getClipboard()
      .then((result) => {
        setClipboard(
          result.length === 0 ? [{ name: "No content", position: 0 }] : result
        );
      })
      .catch(console.error);
    // eslint-disable-next-line
  }, []);

  /**
   * Gets an array of all the clipboard items stored in the database
   * sorted according to how they were added.
   *
   * @returns string[]
   */
  const getClipboard = async (): Promise<Clipboard> => {
    const result: Clipboard = [];
    // Make sure nothing bad happens when user isn't logged in
    if (user === null) return result;

    // Get all documents (sorted by their timestamp)
    const col = collection(db, user?.uid.toString());
    const q = query(col, orderBy("timestamp", "desc"), limit(10));
    const docs = await getDocs(q);

    // Add each document's `item` field to the `result` array
    docs.forEach((doc) => {
      const item: Item = {
        name: doc.data().item,
        checked: false,
        position: result.length,
      };
      result.push(item);
    });

    return result;
  };

  const [clipboard, setClipboard] = useState<Clipboard>([
    { name: "No contents", position: 0 },
  ]);
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
    // sign user out then navigate to home page
    signOut(auth)
      .then(() => navigate("/"))
      .catch(console.error);
  };

  /**
   * This function handles click events for each clipboard item to copy what the user's clicked
   * into their clipboard.
   *
   * @param e React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
   * @param item Item
   */
  const copyText = function (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    item: Item
  ) {
    // Make sure the user can't copy "Loading..."
    if (item.checked !== undefined) {
      // Create a new state entirely to toggle the `checked` value for our item
      const newClipboard = [...clipboard];
      newClipboard[item.position].checked = true;
      setClipboard(newClipboard);

      // Restore the `copy` box back to it's original state
      setTimeout(() => {
        const newClipboard = [...clipboard];
        newClipboard[item.position].checked = false;
        setClipboard(newClipboard);
      }, 2000);

      navigator.clipboard.writeText(item.name);
    }
  };

  // I had to set display to flex manually in `Container` just below
  const head: CSSProperties = {
    display: "flex",
  };

  return (
    <div>
      <Header className="border-solid border-b-2 mb-[30px]">
        <Container
          className="items-center justify-between flex-row p-[10px]"
          style={head}
        >
          <div className="text-2xl flex items-center">
            <img
              src={user?.photoURL}
              alt="Profile"
              className="h-[50px] mr-[15px] rounded-full border-solid border-2"
            />
            {user?.displayName.toUpperCase()}
          </div>
          <Button color="error" onClick={() => signout()}>
            <div className="hidden sm:inline mr-[10px]">signout </div>
            <Logout />
          </Button>
        </Container>
      </Header>
      <Container>
        <form onSubmit={addItem} className="flex pb-[30px]">
          <Input
            className="mr-5 flex-1"
            type="text"
            placeholder="Write or paste text"
            ref={item}
            required
          />
          <Button
            className="flex-none"
            color="primary"
            type="submit"
            variant="outlined"
            ref={addButton}
          >
            <div className="hidden sm:inline mr-[10px]">
              Add to universal clipboard
            </div>
            <SaveAlt />
          </Button>
        </form>

        <div className="border-solid border-b-2">
          {clipboard.map((item, i) => {
            return (
              <div
                className="pt-[30px] pb-[30px] border-solid border-t-2 flex justify-between cursor-pointer"
                onClick={(e) => copyText(e, item)}
                key={i}
              >
                <div>{item.name}</div>
                <div>
                  {item.checked !== undefined ? (
                    item.checked ? (
                      <>
                        <span className="mr-[5px]">
                          <small>Copied!</small>
                        </span>
                        <span>
                          <ContentCopyTwoTone />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="mr-[5px]">
                          <small>Click to copy</small>
                        </span>
                        <span>
                          <ContentCopy />
                        </span>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0px;
  left: 0px;
`;

export default ClipboardItems;
