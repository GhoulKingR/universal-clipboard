import { MouseEvent } from "react";
import { Item, Clipboard } from "../../lib";
import { ContentCopy, ContentCopyTwoTone } from "@mui/icons-material";

type InputType = {
  clipboard: Clipboard;
  setClipboard: React.Dispatch<React.SetStateAction<Clipboard>>;
};

function Body({ clipboard, setClipboard }: InputType) {
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

  return (
    <div className="border-solid border-b-2">
      {clipboard.map((item, i) => {
        return (
          <div
            className="pt-[30px] pb-[30px] border-solid border-t-2 flex justify-between cursor-pointer"
            onClick={(e) => copyText(e, item)}
            key={i}
          >
            <span className="truncate w-[70%]">{item.name}</span>
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
                    <span className="mr-[5px] hidden sm:inline">
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
  );
}

export default Body;
