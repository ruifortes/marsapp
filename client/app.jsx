var React = require('react')
  , ReactDOM = require('react-dom')
  , request = require('reqwest')
  , io = require('socket.io-client')
  , moment = require('moment')

var ViewManager = require('./viewManager.jsx')
  , Menu = require('./views/menu.jsx')
  , StatusBar = require('./views/statusBar.jsx')

var reportStore = require('./stores/report_store.js')
var urlState = require('./urlState.js')

var App = React.createClass({
  getInitialState: function (){

    return urlState.get()

  },

  componentDidMount: function (){
    var self = this

    var socket = io.connect()

    socket.on('serverUpdated', function (data) {

      // set Store latestDate prop and update state
      reportStore.latestDate = data.lastDate
      self.setState({info: data})

    })

    urlState.on('change',function (state) {
      self.setState(state)
    })

  },
  componentWillUnmount: function() {
    // window.removeEventListener('popstate', this.handle_popState)
  },
  render: function (){

    var state = this.state

    return (
      <div id='app' onKeyUp={this.handle_keyPress}>
        <header className='header'>
          <Menu viewKey={state.view} onChange={this.handle_navChange}/>
        </header>
        <main className='main'>
          <ViewManager viewKey={state.view} viewParams={state.viewParams}/>
        </main>
        <footer className='footer'>
          <StatusBar info={state.info}/>
        </footer>
      </div>
    )
  }

})

ReactDOM.render(<App/>, document.getElementById('react'))
