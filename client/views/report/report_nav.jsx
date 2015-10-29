var React = require('react')
  , moment = require('moment')
  , responsiveMixin = require('react-responsive-mixin')

var reportStore = require('../../stores/report_store.js')
var urlState = require('../../urlState.js')



module.exports = React.createClass({
  mixins: [responsiveMixin],
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
    var _urlState = urlState.get()

    if (!_urlState.viewParams) {
      _urlState.viewParams = reportStore.latestDate
    }

    var date = moment(_urlState.viewParams)
    if(!date.isValid()) return

    if(d < 0){
      _urlState.viewParams = date.subtract(1, 'd').format('YYYY-MM-DD')
    } else if (d > 0) {
      _urlState.viewParams = date.add(1, 'd').format('YYYY-MM-DD')
    }

    urlState.set(null, _urlState.viewParams)
  },
  handleKeyNavigation : function (evt) {

    // var _urlState = urlState.get()
    // if (!_urlState.viewParams) {
    //   _urlState.viewParams = reportStore.latestDate
    // }
    //
    // var date = moment(_urlState.viewParams)
    //
    // if(!date.isValid()) return
    //
    // switch (evt.keyCode) {
    //   case 39: // arrow up
    //     _urlState.viewParams = date.add(1, 'd').format('YYYY-MM-DD')
    //     break
    //   case 37: // arrow down
    //     _urlState.viewParams = date.subtract(1, 'd').format('YYYY-MM-DD')
    //     break
    //   default:
    //     return
    // }
    //
    // urlState.set(null, _urlState.viewParams)

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

    this.media({maxWidth: 300}, function () {
      this.setState({shortDate: true});
    }.bind(this))

    this.media({minWidth: 300}, function () {
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

    if(this.props.date){
      dateStr = this.props.date
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
  }
})
