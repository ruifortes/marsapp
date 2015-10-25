var React = require('react')
  , classNames = require('classnames')


var Toggle = require('./components/toggle.jsx')

module.exports = React.createClass({
  getInitialState: function () {

    return {
      isOpen: false,
    }

  },
  handleClick: function (viewKey) {

    if(viewKey == 'about'){

      // var socket = io.connect('http://localhost:3000')

      socket.on('news', function (data) {
        console.log(data)
        socket.emit('my other event', { my: 'data' })

      })

      return
    }

    this.props.onChange(viewKey)

    this.setState({isOpen: false})


  },
  handleToggleClick: function (isOpen) {

    this.setState({isOpen: isOpen})

  },
  handle_resize: function(e) {

    this.setState({isOpen: false})

  },
  componentDidMount: function () {

    window.addEventListener('resize', this.handle_resize)

  },
  componentWillUnmount: function () {

    window.removeEventListener('resize', this.handle_resize)

  },
  render: function () {

    var self = this
      , state = self.state

    // create menu item
    var items = [
        {key:'report', label:'Today'},
        {key:'list', label:'List'},
        {key:'about', label:'About'}
      ].map(function (item, i) {

        var itemClass = (item.key == self.props.viewKey) ? 'menu-item  active' : 'menu-item'

        return (<li key={item.key} className={itemClass}>
                  <a href='javascript:void(0)' className='pure-menu-link'
                    onClick={self.handleClick.bind(self,item.key)}>
                    {item.label}
                  </a>
                </li>)

    })


    return (
      <nav className={'menu' + (state.isOpen ? ' open' : '')}>
        <div className='menu-section left'>
          <a className='brand' onClick={self.handleClick.bind(self,'')}>
            Mars Weather
          </a>
          <Toggle isOpen={state.isOpen} onClick={self.handleToggleClick}/>
        </div>
        <div className='menu-section right collapse'>
          <ul className='menu-list'>
              {items}
          </ul>
        </div>
      </nav>
    )

  }

})
