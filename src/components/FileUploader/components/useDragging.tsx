import { useState, useEffect, useCallback } from "react";

let draggingCount = 0;
type Params = {
  div: any;
  clickRef: any;
  setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (arg0: FileList | null) => void;
};
const useDragging = ({ div, clickRef, setUploaded, handleChange }:Params) => {
  const [dragging, setDragging] = useState(false);
  const handleClick = useCallback(() => {
    clickRef.current.click();
  }, [clickRef]);

  const handleDragIn = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount++;
    if (ev.dataTransfer.items && ev.dataTransfer.items.length !== 0) {
      setDragging(true);
    }
  }, []);
  const handleDragOut = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount--;
    if (draggingCount > 0) return;
    setDragging(false);
  }, []);
  const handleDrag = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);
  const handleDrop = useCallback(
    ev => {
      ev.preventDefault();
      ev.stopPropagation();
      setDragging(false);
      draggingCount = 0;
      if (ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
        handleChange(ev.dataTransfer.files[0]);
        setUploaded(true);
        ev.dataTransfer.clearData();
      }
    },
    [handleChange, setUploaded]
  );
  useEffect(() => {
    const ele = div.current;
    ele.addEventListener("click", handleClick);
    ele.addEventListener("dragenter", handleDragIn);
    ele.addEventListener("dragleave", handleDragOut);
    ele.addEventListener("dragover", handleDrag);
    ele.addEventListener("drop", handleDrop);
    return () => {
      ele.removeEventListener("click", handleClick);
      ele.removeEventListener("dragenter", handleDragIn);
      ele.removeEventListener("dragleave", handleDragOut);
      ele.removeEventListener("dragover", handleDrag);
      ele.removeEventListener("drop", handleDrop);
    };
  }, [handleClick, handleDragIn, handleDragOut, handleDrag, handleDrop, div]);

  return dragging;
};

export default useDragging;