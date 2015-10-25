var React = require('react')
  , request = require('reqwest')
  , io = require('socket.io-client')
  , moment = require('moment')

var Menu = require('./menu.jsx')
  , ViewManager = require('./viewManager.jsx')
  , StatusBar = require('./statusBar.jsx')

var reportStore = require('./stores/report_store.js')
var _utils = require('./_utils.js')

var App = React.createClass({
  getInitialState: function (){

    return _utils._getUrlState()

  },
  handle_popState: function (evt) {

    evt.preventDefault()
    this.setState(_utils._getUrlState())

  },
  handle_navChange: function (view, viewParams) {

    this.setState(_utils._setUrlState(view, viewParams))
  },
  componentDidMount: function (){
    var self = this

    self.setState(_utils._getUrlState())

    var socket = io.connect('http://localhost:3000')

    socket.on('serverUpdated', function (data) {

      reportStore.latestDate = data.lastDate
      self.setState({info: data})
      
    })

    window.addEventListener('popstate', this.handle_popState)

  },
  componentWillUnmount: function() {

    window.removeEventListener('popstate', this.handle_popState)

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
