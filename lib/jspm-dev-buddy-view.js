"use babel"

import {TextEditorView} from 'atom-space-pen-views'
import React from 'react'
import ReactDOM from 'react-dom'
import SocketEmitterServersPanel from './components/socket-emitter-servers-panel'

const startedServers = []

function JspmDevBuddyView (startServer) {
  this.element = document.createElement('div')
  this.element.classList.add('jspm-dev-buddy')
  var message = document.createElement('div')
  message.textContent = 'Port: '
  message.classList.add('message')
  this.element.appendChild(message)
  var input = new TextEditorView({mini: true, placeholderText: 9080})
  this.element.appendChild(input.element)
  var reactContainer = document.createElement('div')
  this.element.appendChild(reactContainer)
  function startUp() {
    var inputtedText = input.model.buffer.lines[0]
    var port = 9080
    if (inputtedText) {
      port = Number(inputtedText)
    }
    const startedServer = startServer(port, function (err) {
      if (err) {
        console.error('unable to start on a port ', port, err)
      } else {
        startedServers.push(startedServer)
        console.log('started socket.io server on port ', port)
      }
    })
  }

  ReactDOM.render(
    <SocketEmitterServersPanel startUp={startUp}
      startedServers={startedServers}
      portInput={input}/>
    ,
    reactContainer
  )
}

JspmDevBuddyView.prototype.serialize = function () {}

JspmDevBuddyView.prototype.destroy = function () {
  return this.element.remove()
}

JspmDevBuddyView.prototype.getElement = function () {
  return this.element
}

export default JspmDevBuddyView
