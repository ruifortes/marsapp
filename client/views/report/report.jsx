var React = require('react')

module.exports = React.createClass({
  render: function () {

    var rep = this.props.report

    if (rep === null) {
      return (
        <div className='report empty'>
          <p className='center'>No report</p>
        </div>
      )
    } else if (rep === undefined) {
      return (
        <div className='center'>
          <div className='progress'>Loading…</div>
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
