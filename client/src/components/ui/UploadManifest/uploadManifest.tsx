import React, { useCallback, useMemo } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

interface Props {
  updateScreenState: () => void;
  setManifest: any;
  setDuplicates: any;
  duplicates: any;
  setManifestName: any;
  prevScreenState: (type: string) => void;
}

const baseStyle = {
  position: "absolute" as const,
  left: "50%",
  top: "50%",
  height: "200px",
  marginTop: "-100px" /* half of you height */,
  width: "400px",
  marginLeft: "-200px" /* half of you width */,
  border: "gray dashed 1.3px",
  textAlign: "center" as const,
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
    setManifest,
    setDuplicates,
    duplicates,
    setManifestName,
  } = props;

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: FileWithPath) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e: any) => {
        let rows = e.target.result.split("\n");
        let cells: any[] = [];
        let dups: any[] = [];
        rows.forEach((element: any) => {
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

          if (!dups.some((item: any) => item.name === name)) {
            dups.push({
              name: name,
              count: 1,
              dup: [{ r, c }],
            });
          } else {
            let index = dups.findIndex((item: any) => item.name === name);
            let oldCount = dups[index].count;
            let oldDup = dups[index].dup;
            dups = [...dups.slice(0, index)].concat(
              {
                ...dups[index],
                count: oldCount + 1,
                dup: [...oldDup, { r, c }],
              },
              [...dups.slice(index + 1)]
            );
          }
        });
        setManifest(cells);
        setDuplicates(dups);
        setManifestName(file.path);
        updateScreenState();
      };
      reader.readAsText(file);
      // file.text().then(res => {
      //   setContent(res)
      // })
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
    <section className="container">
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
      {/* <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside> */}
    </section>
  );
}
