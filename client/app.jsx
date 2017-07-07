require('./css/main.scss')

var React = require('react')
  , ReactDOM = require('react-dom')
  , io = require('socket.io-client')
  , moment = require('moment')

var {Router, Route, Link, IndexRoute} = require('react-router')
var history = require('history/lib/createBrowserHistory')()

var Menu = require('./views/menu.jsx')
  , StatusBar = require('./views/statusBar.jsx')

var ReportList = require('./views/reportList/reportList_view.jsx')
  , Report = require('./views/report/report_view.jsx')
  , About      = require('./views/about/about_view.jsx')
  , Welcome    = require('./views/welcome/welcome_view.jsx')

var reportStore = require('./stores/report_store.js')

var App = React.createClass({
  getInitialState: function (){
    return {
      info: null
    }
  },

  componentDidMount: function (){
    var self = this

    var socket = io.connect()

    socket.on('serverUpdated', function (data) {

      // set Store latestDate prop and update state
      reportStore.latestDate = data.lastDate
      self.setState({info: data})
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
          <Menu/>
        </header>
        <main className='main'>
          <div className='fillflex'>
            {this.props.children}
          </div>
        </main>
        <footer className='footer'>
          <StatusBar info={state.info}/>
        </footer>
      </div>
    )

  }

})

var notFound = function () {
  return <div className='center'>NOT FOUND</div>
}


ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Welcome}/>
      <Route path="report(/:date)" component={Report}/>
      <Route path="list" component={ReportList}/>
      <Route path="about" component={About}/>
      <Route path="*" component={notFound}/>
    </Route>
  </Router>
), document.getElementById('react'))
