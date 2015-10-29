var React = require('react')

module.exports = React.createClass({
  render: function () {

    var rep = this.props.report

    if (!rep) {
      return (
        <div className='report empty'>
          <p>No report</p>
        </div>
      )
    }

    var items = rep
        ? Object.keys(rep).map(function (key, i) {
            return (
              <li key={i}>
                <span>{key}</span>
                <span>{rep[key]}</span>
              </li>
            )
          })
        : []

    return (
      <div className='report'>
        <ul>{items}</ul>
      </div>
    )

  }
})
