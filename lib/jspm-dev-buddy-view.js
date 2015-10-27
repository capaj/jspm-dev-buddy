var TextEditorView = require('atom-space-pen-views').TextEditorView

function JspmDevBuddyView (startServer) {

  this.element = document.createElement('div')
  this.element.classList.add('jspm-dev-buddy')
  var message = document.createElement('div')
  message.textContent = "Port: "
  message.classList.add('message')
  this.element.appendChild(message)
  var input = new TextEditorView({mini: true, placeholderText: 9080})
  this.element.appendChild(input.element)
  var btn = document.createElement('div')
  btn.innerHTML = '<button class="pull-right update-all-button btn btn-primary">Start up</button>'
  btn = btn.firstChild
  this.element.appendChild(btn)
  function startUp() {
    var inputtedText = input.model.buffer.lines[0]
    var port = 9080
    if (inputtedText) {
      port = Number(inputtedText)
    }
    startServer(port, function (err, value) {
      if (err) {
        console.log('unable to start on a port ', port)
      } else {
        console.log('started socket.io server on port ', port)
      }
    })
  }
  btn.onclick = startUp

}

JspmDevBuddyView.prototype.serialize = function () {}

JspmDevBuddyView.prototype.destroy = function () {
  return this.element.remove()
}

JspmDevBuddyView.prototype.getElement = function () {
  return this.element
}

module.exports = JspmDevBuddyView
