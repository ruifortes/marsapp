var React = require('react')
var request = require('reqwest')
var moment = require('moment')

var App = React.createClass({
  getInitialState: function (){
    return {
      route: window.location.hash.substr(1)
    }
  },
  getReport: function (dateStr){
    var self = this
    var date

    if (dateStr) {
      date = moment(new Date(dateStr))
      if (date.isValid()) {
        dateStr = date.format('YYYY-MM-DD')
      } else {
        console.log('invalid date string')
      }
    } else {
      dateStr = ''
    }

    return request('/api/report/' + dateStr).then(function (res) {

      // if retrieving last then automatically set hash to report date
      if(!dateStr) window.location.hash = '#' + res.terrestrial_date

      self.setState({
        report: res
      })
    }).catch(function (err, msg) {
      self.setState({
        report: {terrestrial_date: window.location.hash.substr(1)}
      })
    })


  },
  componentDidMount: function (){
    var self = this

    self.getReport(window.location.hash.substr(1))

    // no react-router for now. just set state on hash change
    window.addEventListener('hashchange', function (evt) {
      self.getReport(window.location.hash.substr(1))
    })

    window.onpopstate = function (evt) {
      self.getReport(window.location.hash.substr(1))
    }

    window.addEventListener('keyup', function (evt) {

      var hash = window.location.hash.substr(1)
      var date = moment(hash)

      if(!date.isValid()) return

      switch (evt.keyCode) {
        case 38: // arrow up
          hash = date.add(1, 'd').format('YYYY-MM-DD')
          break
        case 40: // arrow down
          hash = date.subtract(1, 'd').format('YYYY-MM-DD')
          break
        default:
          return
      }

      // window.location.hash = "#" + newDate.format('YYYY-MM-DD')

      if(window.history.pushState) {
        window.history.pushState(null, null, "#" + hash)
      }
      else {
          window.location.hash = "#" + hash
      }

      self.getReport(hash)

    })

  },
  render: function (){

    var rep = this.state.report

    return (
      <div onKeyUp={this.handle_keyPress}>
        <h1>Mars Wheather</h1>
        <p>date: {rep && rep.terrestrial_date}</p>
        <p>sol: {rep && rep.sol}</p>
        <p>ls: {rep && rep.ls}</p>
        <p>min_temp: {rep && rep.min_temp}</p>
        <p>min_temp_fahrenheit: {rep && rep.min_temp_fahrenheit}</p>
        <p>pressure: {rep && rep.pressure}</p>
        <p>pressure_string: {rep && rep.pressure_string}</p>
      </div>
    )
  }

})

ReactDOM.render(<App/>, document.getElementById('app'))
