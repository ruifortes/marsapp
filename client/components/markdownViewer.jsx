var React = require('react')
var Remarkable = require('remarkable')

var MarkdownViewer = React.createClass({
    componentDidMount: function() {

    },
    render: function() {

      var md = new Remarkable()
      var innerHTML = md.render(this.props.markdown)

      return <div className={this.props.className} dangerouslySetInnerHTML={{__html: innerHTML}}/>
    }
})

module.exports = MarkdownViewer
