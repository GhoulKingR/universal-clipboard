import { User } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export type Item = {
  name: string;
  position: number;
  checked?: boolean;
};
export type Clipboard = Item[];

/**
 * Gets an array of all the clipboard items stored in the database
 * sorted according to how they were added.
 *
 * @returns string[]
 */
export async function getClipboard(user: User | null): Promise<Clipboard> {
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
}
