"use babel"

import JspmDevBuddyView from './jspm-dev-buddy-view'
import {CompositeDisposable} from 'atom'
import sio from 'socket.io'
import http from 'http'
import fileSavedEmitter from './file-saved-emitter'

var onDeactivation = []

var JspmDevBuddy = {
  jspmDevBuddyView: null,
  modalPanel: null,
  subscriptions: null,
  activate: function (state) {
    this.jspmDevBuddyView = new JspmDevBuddyView(function startServer (port, cb) {
      var socketsConnected = []
      fileSavedEmitter(socketsConnected)
      let app = http.createServer()
      io = sio(app)
      app.listen(port, cb)

      io.on('connection', function (socket) {
         var index = socketsConnected.push(socket)
         socket.on('disconnect', function () {
           socketsConnected.splice(index - 1, 1)
         })

         socket.on('identification', function (name) {
           console.log('connected client: ', name)
         })
      })

      function stopServer() {
        socketsConnected.forEach(function (socket) {
          socket.disconnect()
        })
        io.httpServer.close()
      }

      onDeactivation.push(stopServer)
      return {
        io,
        port,
        stopServer
      }
    })

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.jspmDevBuddyView.getElement(),
      visible: false
    })
    this.subscriptions = new CompositeDisposable()
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'jspm-dev-buddy:start': this.toggle
    }))
  },
  deactivate: function () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    onDeactivation.forEach(function (cb) {
      cb()
    })
    return this.jspmDevBuddyView.destroy()
  },
  serialize: function () {
    return {
      jspmDevBuddyViewState: this.jspmDevBuddyView.serialize()
    }
  },
  toggle: function () {
    console.log('JspmDevBuddy was toggled!')
    if (JspmDevBuddy.modalPanel.isVisible()) {
      return JspmDevBuddy.modalPanel.hide()
    } else {
      return JspmDevBuddy.modalPanel.show()
    }
  }
}

export default JspmDevBuddy
