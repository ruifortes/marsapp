var React = require('react')
var request = require('reqwest')
var moment = require('moment')

var App = React.createClass({
  getInitialState: function(){
    return {
      route: window.location.hash.substr(1)
    }
  },
  getReport: function(dateStr){
    var self = this
    var date = moment(new Date(dateStr))

    if (date.isValid()) {
      return request('/api/report/' + date.format('YYYY-MM-DD'), function(res) {
        self.setState({
          report: res
        })
      }, function (err, msg) {
        console.log(err);
      })
    }

  },
  componentDidMount: function(){
    var self = this

    self.getReport(window.location.hash.substr(1))

    // no react-router for now. just set state on hash change
    window.addEventListener('hashchange', function() {
      self.getReport(window.location.hash.substr(1))
    })

  },
  render: function(){

    var rep = this.state.report

    return (
      <div>
        <h1>Mars Wheather</h1>
        <p>date: {rep && rep.terrestrial_date}</p>
      </div>
    )
  }

})

ReactDOM.render(<App/>, document.getElementById('app'))
