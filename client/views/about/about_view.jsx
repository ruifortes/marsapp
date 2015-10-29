var React = require('react')

var MarkdownViewer = require('../../components/markdownViewer.jsx')

var markdown = require('./about_md.js')()

var about_view = React.createClass({
  componentDidMount: function() {

  },
  render: function() {

    return <MarkdownViewer className='about' markdown={markdown} />;
  }
})

module.exports = about_view
