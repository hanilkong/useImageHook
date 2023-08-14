import React from "react";

const FILESIZE = 15 * 1024 * 1024;
const INPUTFILEACCEPT =
  "image/png, image/jpeg, image/jpg, image/webm, image/gif";
/**
 * Image file to base64 and Blob
 * @param ref event button ref
 * @param argFileSize max file size
 * @param argInputFileAccept  input accept options
 * @returns {result: string,file: Blob | null} Image file base64 and Blob
 */
function useImageHook(
  argRef: React.MutableRefObject<HTMLButtonElement | null>,
  argFileSize = FILESIZE,
  argInputFileAccept = INPUTFILEACCEPT
) {
  const inputRef = React.useRef<HTMLInputElement>(
    document.createElement("input")
  );
  const inputElement = inputRef.current;

  const [stateResult, setStateResult] = React.useState("");
  const [stateFile, setStateFile] = React.useState<Blob | null>(null);
  const [stateIsSuccess, setStateIsSuccess] = React.useState<boolean | null>(
    null
  );
  const [stateIsFail, setStateIsFail] = React.useState<boolean | null>(null);

  const onFileChangeClickHandle = React.useCallback(
    (event: CustomEvent<HTMLButtonElement>) => {
      setStateIsSuccess(null);
      setStateIsFail(null);
      if (
        inputRef &&
        argRef !== null &&
        argRef.current !== null &&
        argRef.current.contains(event.target as Node)
      ) {
        inputElement.click();
      }
    },
    [inputElement, argRef]
  );

  /**
   * image, video file load
   */
  const handleInput = React.useCallback(
    (event: CustomEvent<React.ChangeEvent>) => {
      const target = event.target as HTMLInputElement;
      const { files } = target;
      const reader = new FileReader();
      Array.from(files || []).forEach((data: Blob) => {
        if (data.size <= argFileSize) {
          reader.onload = (e) => {
            if (typeof e.target?.result === "string") {
              if (e.target.result) {
                setStateResult(e.target.result);
                setStateFile(data);
                setStateIsSuccess(true);
              }
            }
          };
          if (typeof files !== "string" && files !== null) {
            reader.readAsDataURL(data);
          }
        } else {
          setStateIsFail(true);
          setStateResult("big file size ");
          throw new Error();
        }
      });
    },
    [argFileSize]
  );

  React.useEffect(() => {
    if (typeof document !== undefined) {
      inputElement.style.visibility = "hidden";
      inputElement.type = "file";
      inputElement.accept = argInputFileAccept;
      document.body.appendChild(inputElement);
      document.addEventListener(
        "click",
        onFileChangeClickHandle as EventListener
      );
      inputElement.addEventListener("change", handleInput as EventListener);
    }

    return () => {
      document.body.removeChild(inputElement);
      document.removeEventListener(
        "click",
        onFileChangeClickHandle as EventListener
      );
      inputElement.removeEventListener("change", handleInput as EventListener);
    };
  }, [argInputFileAccept, inputElement, handleInput, onFileChangeClickHandle]);

  return {
    result: stateResult,
    file: stateFile,
    isSuccess: stateIsSuccess,
    isFail: stateIsFail,
  };
}

export { useImageHook };
export default useImageHook;
