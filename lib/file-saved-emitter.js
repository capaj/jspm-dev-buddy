module.exports = function (connectedClients) {
  atom.workspace.observeTextEditors(function (editor){
    editor.onDidSave(function (ev){

      socketsConnected.forEach(function (socket) {
        socket.emit('change', ev)
      })
    })
  })
}
