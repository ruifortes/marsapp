var React = require('react')
  , moment = require('moment')
  , responsiveMixin = require('react-responsive-mixin')

var {Link, History} = require('react-router')

module.exports = React.createClass({
  mixins: [History, responsiveMixin],
  getInitialState: function () {
    return {
        shortDate: false
    }
  },
  getNext: function () {
    this._moveDay(1)
  },
  getPrev: function () {
    this._moveDay(-1)
  },
  _moveDay: function (d) { //negative or positive integer

    var date = moment(this.props.dateStr)
    if(!date.isValid()) return

    if(d < 0){
      date.subtract(1, 'd')
      // reportStore.getReport(date.subtract(1, 'd').format('YYYY-MM-DD'))
    } else if (d > 0) {
      date.add(1, 'd')
      // reportStore.getReport(date.add(1, 'd').format('YYYY-MM-DD'))
    }

    this.history.pushState(null, '/report/' + date.format('YYYY-MM-DD'))


  },
  handleKeyNavigation : function (evt) {

    switch (evt.keyCode) {
      case 39: // arrow up
        this._moveDay(1)
        break
      case 37: // arrow down
        this._moveDay(-1)
        break
      default:
        return
    }

  },
  componentDidMount: function () {
    // add arrow key navigation
    window.addEventListener('keyup', this.handleKeyNavigation)

    this.media({maxWidth: 350}, function () {
      this.setState({shortDate: true});
    }.bind(this))

    this.media({minWidth: 350}, function () {
      this.setState({shortDate: false});
    }.bind(this))

  },
  componentWillUnmount: function () {
    window.removeEventListener('keyup', this.handleKeyNavigation)
  },
  render: function() {

    var rep = this.props.rep
    // var label = !!rep ? 'Report for ' : 'No Report for '
    var dateStr

    if(this.props.dateStr){
      dateStr = this.props.dateStr
    } else if(!!rep){
      dateStr =rep.terrestrial_date
    }

    if (this.state.shortDate) {
      dateStr = moment.utc(dateStr).format('YYYY-MM-DD')
    } else {
      dateStr = moment.utc(dateStr).format('dddd, MMMM Do YYYY')
    }


    return (
      <div className='report_nav'>
        <span>{dateStr}</span>
        <span className='control'>
          <a className='icon-nav-left' onClick={this._moveDay.bind(this,-1)} href='javascript:void(0)'/>
          <a className='icon-nav-right' onClick={this._moveDay.bind(this,1)} href='javascript:void(0)'/>
        </span>
      </div>
    )


    // return (
    //   <div className='report_nav'>
    //     <span>{dateStr}</span>
    //     <span className='control'>
    //       <a className='icon-nav-left' onClick={this._moveDay.bind(this,-1)} href='javascript:void(0)'/>
    //       <a className='icon-nav-right' onClick={this._moveDay.bind(this,1)} href='javascript:void(0)'/>
    //     </span>
    //   </div>
    // )

  }
})
