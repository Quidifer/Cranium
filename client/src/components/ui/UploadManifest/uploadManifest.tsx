import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone, FileWithPath } from "react-dropzone";

interface Props {
  setScreenState: React.Dispatch<React.SetStateAction<string>>;
  setManifest: any;
}

const baseStyle = {
  position: "absolute" as const,
  left: "50%",
  top: "50%",
  height: "200px",
  marginTop: "-100px", /* half of you height */
  width: "400px",
  marginLeft: "-200px", /* half of you width */
  border: "gray dashed 1.3px",
  textAlign: "center" as const
};

const focusedStyle = {
  border: "#2196f3 dashed 1.5px"
};

const acceptStyle = {
  border: "#00e676 dashed 1.5px"
};

const rejectStyle = {
  border: "#ff1744 dashed 1.5px"
};

export default function UploadManifest(props: Props) {
  const { setScreenState, setManifest } = props;
  

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file : FileWithPath) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = (e: any) => {
        // Do whatever you want with the file contents
        // const content = reader.result
        setManifest(e.target.result.split('\n'))
        // console.log(e.target.result)
        setScreenState("load");
      }
      reader.readAsText(file)
      // file.text().then(res => {
      //   setContent(res)
      // })
    })
    
  }, [])

  const {
    getRootProps, 
    getInputProps, 
    isFocused, 
    isDragAccept, 
    isDragReject
  } = useDropzone({
    onDrop, 
    accept: {'text/*': []}
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <section className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <img 
          src="https://cdn-icons-png.flaticon.com/512/126/126477.png"  
          style={{width: "110px", height: "100px", paddingTop: "25px"}}
        />
        <p style={{fontSize: "15px"}}>Drag or click here to upload Manifest</p>
      </div>
      {/* <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside> */}
    </section>
  );
}