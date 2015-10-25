var React = require('react')

var ListItem = React.createClass({

  render: function () {

    var rep = this.props.report

    var fields = [
      {label:'Date: ', key:'terrestrial_date'},
      {label:'min: ', key:'min_temp'},
      {label:'max: ', key:'max_temp'},
    ].map(function (item, i) {
      return <span key={i}>{item.label + rep[item.key]}</span>
    })

    return (
      <li>
        <div>
          <i className='md-lg md-chevron-up'/>
          {fields}
        </div>
      </li>
    )


  }

})


module.exports = React.createClass({

  render: function () {

    var list = this.props.reportList || []

    if(!list.length) return <div>LISTEMPTY</div>

    var items = list.map(function (item, i) {
      return <ListItem key={i} report={item}/>
    })

    return (
      <ul>{items}</ul>
    )


  }

})
