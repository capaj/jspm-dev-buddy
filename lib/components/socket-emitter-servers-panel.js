'use babel'
import React, { PropTypes, Component } from 'react'
import {observeStoreByString} from 'react-observe-store'

class SocketEmitterServersPanel extends Component {
  constructor (props) {
    super(props)
    observeStoreByString(this, this.props.startedServers, 'startedServers')
    props.portInput.on('keyup', () => {
      setTimeout(() => {
        this.forceUpdate()
      })
    })
  }
  render () {
    let {startUp, startedServers, portInput} = this.props
    let disableStartUp = startedServers.some(
      (server) => server.port == portInput.model.buffer.lines[0]
    )
    return <div>
      <button disabled={disableStartUp} onClick={startUp}
        className="pull-right update-all-button btn btn-primary">
        Start up
      </button>
      {startedServers.map((server) => {
        return <button onClick={() => {
          server.stopServer()
          startedServers.splice(startedServers.indexOf(server), 1)
        }} className="pull-left update-all-button btn btn-warning">
          stop {server.port}
        </button>
      })}
    </div>
  }
}

export default SocketEmitterServersPanel
