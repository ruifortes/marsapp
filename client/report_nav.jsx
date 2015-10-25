var React = require('react')

var report_nav = React.createClass({

  render: function() {

    return (
      <div className='report_nav'>
        <i/>
        <div>{'REPORT from ' + this.props.date}</div>
      </div>
    )

  }

})

module.exports = report_nav
