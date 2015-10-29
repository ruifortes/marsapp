var React = require('react')
  , clx = require('classnames')

var urlState = require('../urlState.js')

var Toggle = require('../components/toggle.jsx')

module.exports = React.createClass({
  getInitialState: function () {

    return {
      isOpen: false,
    }

  },
  handleClick: function (viewKey , viewParams) {

    this.setState({isOpen: false})
    urlState.set(viewKey, viewParams)

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
        {key:'report', label:'Report'},
        {key:'list', label:'List'},
        {key:'about', label:'About'}
      ].map(function (item, i) {

        return (<li key={item.key} className={clx('menu-item',{'active':item.key == self.props.viewKey})}>
                  <a href='javascript:void(0)' className='pure-menu-link'
                    onClick={self.handleClick.bind(self,item.key,null)}>
                    {item.label}
                  </a>
                </li>)

    })


    return (
      <nav className = { clx('menu',{'open':state.isOpen}) }>
        <div className='menu-section left'>
          <a className='brand' onClick={self.handleClick.bind(self,'','')}>
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
