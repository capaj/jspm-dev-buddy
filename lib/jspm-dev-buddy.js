var JspmDevBuddyView = require('./jspm-dev-buddy-view')
var CompositeDisposable = require('atom').CompositeDisposable
var sio = require('socket.io')
var http = require('http')
var fileSavedEmitter = require('./file-saved-emitter')
var onDeactivation = []

var JspmDevBuddy = {
  jspmDevBuddyView: null,
  modalPanel: null,
  subscriptions: null,
  activate: function (state) {
    this.jspmDevBuddyView = new JspmDevBuddyView(function startServer (port, cb) {
      var socketsConnected = []
      fileSavedEmitter(socketsConnected)
      app = http.createServer()
      io = require('socket.io')(app)
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

      onDeactivation.push(function () {
        socketsConnected.forEach(function (socket) {
          socket.disconnect()
        })
        io.httpServer.close()
      })
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

module.exports = JspmDevBuddy
