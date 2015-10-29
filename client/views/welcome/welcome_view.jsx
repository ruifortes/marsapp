var React = require('react')

var Carousel = require('nuka-carousel')

var decorators = [{
  component: React.createClass({
    render() {
      return (
        <button className='icon-nav-left' onClick={this.props.previousSlide} style={{padding: '100px 20px'}}/>
      )
    }
  }),
    position: 'CenterLeft',
    style:{}
  },
  {component: React.createClass({
    render() {
      return (
        <button className='icon-nav-right' onClick={this.props.nextSlide} style={{padding: '100px 20px'}}/>
      )
    }
  }),
  position: 'CenterRight',
  style:{}},
  {component: React.createClass({
      render() {
        var self = this;
        var indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll);
        return (
          <ul style={self.getListStyles()}>
            {
              indexes.map(function(index) {
                return (
                  <li style={self.getListItemStyles()} key={index}>
                    <button
                      style={self.getButtonStyles(self.props.currentSlide === index)}
                      onClick={self.props.goToSlide.bind(null, index)}>
                      &bull;
                    </button>
                  </li>
                )
              })
            }
          </ul>
        )
      },
      getIndexes(count, inc) {
        var arr = [];
        for (var i = 0; i < count; i += inc) {
          arr.push(i);
        }
        return arr;
      },
      getListStyles() {
        return {
          position: 'relative',
          margin: 0,
          top: -10,
          padding: 0
        }
      },
      getListItemStyles() {
        return {
          listStyleType: 'none',
          display: 'inline-block'
        }
      },
      getButtonStyles(active) {
        return {
          border: 0,
          background: 'transparent',
          color: 'black',
          cursor: 'pointer',
          padding: 10,
          outline: 0,
          fontSize: 24,
          opacity: active ? 1 : 0.5
        }
      }
    }),
    position: 'BottomCenter'
  }

]


var Welcome = React.createClass({
  // mixins: [Carousel.ControllerMixin],

  render: function () {

    return (

      <div className='welcome'>
        <Carousel ref='carousel' style={{width: '100%', margin: 'auto'}}
          decorators={decorators}>
          <img src="http://placehold.it/600x400/eeeeee/c0392b/&text=slide1"/>
          <img src="http://placehold.it/600x400/eeeeee/c0392b/&text=slide2"/>
          <img src="http://placehold.it/600x400/eeeeee/c0392b/&text=slide3"/>
        </Carousel>
      </div>

    )



    }

})

module.exports = Welcome
