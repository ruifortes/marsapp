var React = require('react')
  , moment = require('moment')

module.exports = React.createClass({

  render: function () {

    var info = this.props.info

    var time = info ? moment().format('HH:mm:ss') : '...'
    var msg = '...'

    if(info){
      msg = info.count
        ? 'server fetch new reports until ' + info.lastDate
        : 'server checked for new reports'
    }

    return (
      <div className='statusBar'>
        <div>{time}</div>
        <div>{msg}</div>
      </div>
    )
  }

})
