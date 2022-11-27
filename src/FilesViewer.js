import { IconFolder, IconFile, IconFolderOpen } from './Icons'

export const FilesViewer = ({ files, onBack, onOpen, i}) => (
  <table className="table">
    <tbody>
      <tr className="clickable" onClick={onBack}>
        <td className="icon-row">
          <IconFolderOpen />
        </td>
        <td>...</td>
        <td></td>
      </tr>

      {files.map(({ id, name, directory, size }) => {
        return (
          <tr key={id} className="clickable" onClick={() => directory && onOpen(name)}>
            <td className="icon-row">
              {directory ? <IconFolder /> : <IconFile />}
            </td>
            <td>{name}</td>
            <td>
              <span className="float-end">{size}</span>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
)