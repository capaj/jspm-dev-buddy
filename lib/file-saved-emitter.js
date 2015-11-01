"use babel"
import path from 'path'
import fs from 'fs'

const emitOnSave = (socketsConnected) => {
  const rootDir = atom.project.rootDirectories[0].path
  let pkgJsonPath = path.join(rootDir, 'package.json')
  fs.readFile(pkgJsonPath, 'utf8', function (err, data) {
    if (err) throw err
    let pjson = JSON.parse(data)
    let baseURL = pjson.jspm.directories.baseURL || pjson.directories.baseURL

    atom.workspace.observeTextEditors(function (editor){
      editor.onDidSave(function (atomEv){
        let absolutePath = atomEv.path
        let ev = {
          path: path.relative(path.join(rootDir, baseURL), absolutePath),
          absolutePath: absolutePath
        }
        socketsConnected.forEach(function (socket) {
          socket.emit('change', ev)
        })
      })
    })
  })


}

export default emitOnSave
