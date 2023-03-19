import { ipcRenderer } from "electron";
import React from "react";
import TextInput from "@/components/forms/TextInput";
import FileInput from "@/components/forms/FileInput";

import { useRef, useEffect, useState } from 'react'

function useIsFirstRender(): boolean {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}


export default function Config() {
  const [versionsPath, setVersionsPath] = React.useState<string>("");
  const [os, setOS] = React.useState<string>("win64");
  
  const isFirst = useIsFirstRender()
  const onSubmit = () => {
    console.log(`setting ${versionsPath} as versions path`)
    ipcRenderer.invoke("store-setting", {
      key: "versions_path",
      value: versionsPath,
    });
    ipcRenderer.invoke("store-setting", {
      key: "operating_system",
      value: os,
    });
  }

  useEffect(() => {
    if (!isFirst) {
      return
    }
    ipcRenderer.invoke('get-setting', 'versions_path').then((data) => {
      console.log(`First render: ${data}`)
      setVersionsPath(data)
    })
    ipcRenderer.invoke('get-setting', 'operating_system').then((data) => {
      console.log(`First render: ${data}`)
      setOS(data)
    });
  });

  const options = [
    { value: "win64", label: "Windows 64bit" },
    { value: "win32", label: "Windows 32bit" },
    { value: "linux64", label: "Linux 64bit" },
    { value: "linux32", label: "Linux 32bit" },
    { value: "osx", label: "Mac OS" },
  ]

  const listOptions = options.map(option =>
    <option selected={option.value == os} value={option.value}>{option.label}</option>
);


  return (
    <>
      <h1>Settings</h1>
      <div>
        <FileInput openMode="openDirectory" path={(versionsPath === null) ? "" : versionsPath } label={`Directory to store Godot executables`} pathChanged={(path: string) => {
          setVersionsPath(path)
          console.log(path)
      }}/>
      </div>
      <div className="text-input">
        <p>OS version to download</p>
        <select onChange={() => {
          const value: string = (document.getElementById("os") as HTMLSelectElement).value;
          console.log(`select was called. Value is ${value}`);
          setOS(value);
        }} className="select-input" id="os">
            {listOptions}
          </select>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        margin: "10px",
      }}>
        
        <button className="submit" onClick={onSubmit}>Update Settings</button>
        <button className="submit" onClick={() => {
            ipcRenderer.invoke("store-setting", {
              key: "downloaded_versions",
              value: [],
            })
          }}>Reset the things</button>
      </div>
    </>
  );
}
