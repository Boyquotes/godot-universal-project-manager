import * as download from 'electron-dl';
import { ipcRenderer } from 'electron';
import VersionBox from '@/components/VersionBox';
import { useEffect, useState } from 'react';


export default function Versions() {
  
  
  const handleClick = () => {
    ipcRenderer.send('crawl-tuxfamily');
  };

  const handleDebug = () => {
    ipcRenderer.invoke('download-godot', {
      version: '4.0',
      os: 'win64',
      release: 'stable',
      mono: false,
    }).then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
  }

  
  const [crawled, setCrawled] = useState([]);
  const [installed, setInstalled] = useState([]);
  const reloadDownloads = () => {
    ipcRenderer.invoke('get-setting', 'crawl_results').then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
    ipcRenderer.invoke('get-setting', 'downloaded_versions').then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  };

  ipcRenderer.on('crawl-finished', reloadDownloads);
  ipcRenderer.on('godot-downloaded', reloadDownloads);


  useEffect(() => {
    reloadDownloads();
  }, []);

  return (
    <div className="versions-page">
      <div className="filter">
        <div>
          <label htmlFor="version">Version</label>
          <input id="version" type="text"/>
        </div>
        
        <div>
          <label htmlFor="os">OS</label>
          <select id="os">
            <option value="win64">Windows 64</option>
            <option value="win32">Windows 32</option>
            <option value="linux64">Linux 64</option>
            <option value="linux32">Linux 32</option>
            <option value="osx">OSX</option>
          </select>
        </div>

        <div>
          <label htmlFor="show-unstable">Unstable Versions</label>
          <input id="show-unstable" type="checkbox"/>
        </div>

         <div>
          <label htmlFor="show-mono">Use Mono</label>
          <input id="show-mono" type="checkbox"/>
        </div>

        <button className="submit" onClick={handleClick}>Reload</button>
        <button className="submit" onClick={handleDebug}>Debug</button>
      </div>
      <div className="versions">
        <div id="installed-versions" className="versions-split">
          
        </div>
        <div id="available-versions" className="versions-split">
          
        </div>
      </div>
    </div>
  );
}
