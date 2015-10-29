var _react = require('react')
  , PureRenderMixin = require('react-addons-pure-render-mixin')

var ReportList = require('./views/reportList/reportList_view.jsx')
  , ReportView = require('./views/report/report_view.jsx')
  , About      = require('./views/about/about_view.jsx')
  , Welcome    = require('./views/welcome/welcome_view.jsx')

module.exports = _react.createClass({
  mixins: [PureRenderMixin],
  render: function () {

    var content
    switch (this.props.viewKey) {
      case 'report':
        content = <ReportView initialDateStr={this.props.viewParams}/>
        break
      case 'list':
        content = <ReportList initialPage={this.props.viewParams}/>
        break
      case 'about':
        content = <About/>
        break
      default:
        content = <Welcome/>
    }

    return (
      <div className='fillflex'>{content}</div>
    )

  }

})
