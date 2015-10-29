var React = require('react')
  , clx = require('classnames')


var autoLoadList = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  getDefaultProps: function() {
    return {
      dist: 70
    };
  },
  getInitialState: function() {
    return {
      isLoading: false,
      autoLoad: true
    }
  },
  onScroll: function (evt) {
    // var content = React.Children.only(this.props.children)
    var self = this

    if(this.props.onLoadMore && !this.state.isLoading){

      var container = ReactDOM.findDOMNode(this.refs.container)
      var inner = ReactDOM.findDOMNode(this.refs.inner)

      var delta = inner.scrollHeight - container.clientHeight
      var scrollTop = container.scrollTop

      if(delta - scrollTop < this.props.dist){
        this.setState({isLoading: true})
        this.props.onLoadMore(function (endOfList) {
          self.setState({
            isLoading: false,
            autoLoad: !endOfList
          })
        })
      }
    }

  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this).addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onScroll)
  },
  componentWillUnmount: function () {
    ReactDOM.findDOMNode(this).removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onScroll)
  },
  render: function() {

    var child = React.cloneElement(this.props.children, { ref: 'inner' })

    var style = {}
    if(this.state.isLoading){
      style.overflow = 'hidden'
    }

    return (
      <div ref='container' style={style}
          className={clx(this.props.className,{'isLoading':this.state.isLoading})}>
        {child}
      </div>
    )

  }

});

module.exports = autoLoadList;
