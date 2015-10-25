require('./toggle.scss')

var React = require('react')

var classNames = require('classnames')

module.exports = React.createClass({
  // getInitialState: function () {
  //   return {isOpen: false}
  // },
  handle_Click: function (evt) {
    this.props.onClick(!this.props.isOpen)
    // this.setState({isOpen: !this.state.isOpen})
  },
  render: function () {

    var self = this

    var tglClass = classNames({
      'custom-toggle': true,
      'x': this.props.isOpen
    })

    return (
      <a className={tglClass} onClick={self.handle_Click}>
        <s className='bar'/><s className='bar'/>
      </a>
    )

  }

})
