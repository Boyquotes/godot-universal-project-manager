interface VersionBoxProps {
  version: string;
  installed?: boolean;
  path: string;
}


export default function VersionBox({version, path, installed = false}: VersionBoxProps) {
  return (
    <div className="version-box">
      <p>{version}</p>
      <div>
        {installed ? <button>Open</button> : <></>}
        {installed ? <button>Uninstall</button> : <button>Install</button>}
      </div>
      <p>{path}</p>
    </div>
  )
}