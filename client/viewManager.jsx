var React = require('react')
  , PureRenderMixin = require('react-addons-pure-render-mixin')

var ReportList = require('./reportList_view.jsx')
  , ReportView = require('./report_view.jsx')

module.exports = React.createClass({
  mixins: [PureRenderMixin],
  render: function () {

    var content

    switch (this.props.viewKey) {
      case 'report':
        content = <ReportView dateStr={this.props.viewParams}/>
        break
      case 'list':
        content = <ReportList page={this.props.viewParams}/>
        break
      default:
        content = <h1>{'theres no view ' + this.props.viewKey}</h1>
    }

    return content

    // return (
    //   <div className='fillflex'>{content}</div>
    // )

  }

})
