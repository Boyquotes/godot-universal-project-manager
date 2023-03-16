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
  const isFirst = useIsFirstRender()
  const onSubmit = () => {
    console.log(`setting ${versionsPath} as versions path`)
    ipcRenderer.invoke("store-setting", {
      key: "versions_path",
      value: versionsPath,
    });
  }

  useEffect(() => {
    if (!isFirst) {
      return
    }
    ipcRenderer.invoke('get-setting', 'versions_path').then((data) => {
      console.log(`First render: ${data}`)
      setVersionsPath(data)
    });
  });


  return (
    <>
      <h1>Settings</h1>
      <div>
        <FileInput openMode="openDirectory" path={versionsPath} label={`Directory to store Godot executables`} pathChanged={(path: string) => {
          setVersionsPath(path)
          console.log(path)
      }}/>
      </div>
      <div className="text-input">
        <p>OS version to download</p>
        <select className="select-input" id="os">
            <option value="win64">Windows 64bit</option>
            <option value="win32">Windows 32bit</option>
            <option value="linux64">Linux 64bit</option>
            <option value="linux32">Linux 32bit</option>
            <option value="osx">Mac OS</option>
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
