import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { FrontEndContainer } from "../../../types/APISolution";
import API from "../../../utils/API";
import "./uploadManifest.css";
import { manifestExamples } from "../../../types/manifestExamples";

interface Props {
  updateScreenState: () => void;
  updatePrevScreenState: () => void;
  setManifest: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  setManifestName: React.Dispatch<React.SetStateAction<string>>;
  manifestName: string;
}

const baseStyle = {
  height: "200px",
  width: "400px",
  border: "gray dashed 1.3px",
  textAlign: "center" as const,
  justifyContent: "center",
};

const focusedStyle = {
  border: "#2196f3 dashed 1.5px",
};

const acceptStyle = {
  border: "#00e676 dashed 1.5px",
};

const rejectStyle = {
  border: "#ff1744 dashed 1.5px",
};

export default function UploadManifest(props: Props) {
  const {
    updateScreenState,
    updatePrevScreenState,
    setManifest,
    setManifestName,
    manifestName,
  } = props;

  const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevRef = usePrevious(manifestName) ?? manifestName;

  useEffect(() => {
    if (prevRef !== manifestName) {
      console.log(`${manifestName} is uploaded.`);
      API.sendLog(`${manifestName} is uploaded.`);
      updateScreenState();
    }
  }, [manifestName]);

  const readManifest = (data: string, fileName: string) => {
    let rows = data.split("\n");
    let cells: FrontEndContainer[] = [];
    rows.forEach((element) => {
      let row = element.split(",");

      let name = row[3].trim();
      let r = Number(row[0].replace("[", ""));
      let c = Number(row[1].replace("]", ""));

      cells.push({
        row: r,
        col: c,
        weight: Number(row[2].replace("{", "").replace("}", "")),
        name: name,
      });
    });
    setManifest(cells);
    setManifestName(fileName);
  };

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    debugger;
    acceptedFiles.forEach((file: FileWithPath) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e) => {
        readManifest(String(e.target?.result), file.path ?? "Undefined Name");
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "text/*": [] },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div style={{ marginTop: "-=15px" }}>
      <div className="uploadContainer" style={{ margin: "40px" }}>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <img
            src="https://cdn-icons-png.flaticon.com/512/126/126477.png"
            style={{ width: "110px", height: "100px", paddingTop: "25px" }}
            alt="Upload Manifest"
          />
          <p style={{ fontSize: "15px" }}>
            Drag or click here to upload Manifest
          </p>
        </div>
      </div>
      <p style={{ textAlign: "center", marginBottom: "5px", fontSize: "22px" }}>
        Sample Manifests
      </p>
      <aside className="uploadContainer">
        <button
          className="exampleButton"
          onClick={() =>
            readManifest(manifestExamples[0], "Manifest Sample #1")
          }
        >
          Manifest #1
        </button>
        <button
          className="exampleButton"
          onClick={() => {
            readManifest(manifestExamples[1], "Manifest Sample #2");
          }}
        >
          Manifest #2
        </button>
        <button
          className="exampleButton"
          onClick={() =>
            readManifest(manifestExamples[2], "Manifest Sample #3")
          }
        >
          Manifest #3
        </button>
      </aside>
      <aside className="uploadContainer">
        <button
          className="exampleButton"
          onClick={() =>
            readManifest(manifestExamples[3], "Manifest Sample #4")
          }
        >
          Manifest #4
        </button>
        <button
          className="exampleButton"
          onClick={() =>
            readManifest(manifestExamples[4], "Manifest Sample #5")
          }
        >
          Manifest #5
        </button>
        <button
          className="exampleButton"
          onClick={() =>
            readManifest(manifestExamples[5], "Manifest Sample #6")
          }
        >
          Manifest #6
        </button>
      </aside>
    </div>
  );
}
