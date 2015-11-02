var React = require('react')
  , PureRenderMixin = require('react-addons-pure-render-mixin')
  , responsiveMixin = require('react-responsive-mixin')

var Link = require('react-router').Link

var ListItem = React.createClass({
  mixins: [PureRenderMixin, responsiveMixin],

  getInitialState: function () {
    return {small: false}
  },
  componentDidMount: function() {

    this.media({maxWidth: 350}, function () {
      this.setState({small: true});
    }.bind(this))

    this.media({minWidth: 350}, function () {
      this.setState({small: false});
    }.bind(this))

  },
  render: function () {

    var rep = this.props.report

    var iconClass = rep.max_temp < -25
    ? 'icon-wea-cloudy'
    : 'icon-wea-sunny'

    var fields = this.state.small
    ? [
        {label:'', key:'terrestrial_date'},
        {label:'m: ', key:'min_temp'},
        {label:'M: ', key:'max_temp'},
      ]
    : [
        {label:'Date: ', key:'terrestrial_date'},
        {label:'min: ', key:'min_temp'},
        {label:'max: ', key:'max_temp'},
      ]

    fields = fields.map(function (item, i) {
      // return <span key={i}>{item.label + rep[item.key]}</span>
      return (
        <div key={i}>{item.label + rep[item.key]}</div>
      )
    })

    // var href = 'javascript:void(0)'
    var href = '/report/' + rep.terrestrial_date

    return (
      <li>
        <i className={iconClass}/>
        <Link to={href}>{fields}</Link>
        {/*<a href={href}  onClick={this.hancleClick}>
          {fields}
        </a>*/}
      </li>
    )
  }

})

var ReportList =  React.createClass({
  mixins: [PureRenderMixin],
  render: function () {

    var list = this.props.reportList || []

    if(!list.length){
      return (
        <div className='center'>
          <div className='progress'>Loading…</div>
        </div>
      )
    }

    var items = list.map(function (item, i) {
      return <ListItem key={i} report={item}/>
    })

    return (
        <ul>{items}</ul>
    )

  }

})

module.exports =  ReportList
