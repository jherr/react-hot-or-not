'use strict';

var React = require('react/addons');

require('normalize.css');
require('../styles/main.css');

var imageURLs = [
  require('../images/food1.png'),
  require('../images/food2.png'),
  require('../images/food3.png'),
  require('../images/food4.png'),
  require('../images/food5.png'),
  require('../images/food6.png'),
  require('../images/food7.png')
];

React.initializeTouchEvents(true);

var Item = React.createClass({
  propTypes: {
    onHot: React.PropTypes.func,
    onNot: React.PropTypes.func,
    onHover: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },
  getInitialState() {
    return {
      top: 0,
      left: 0,
      tracking: null,
      rotation: 0
    };
  },
  onMouseDown(e) {
    this.setState({
      tracking: {
        x: e.nativeEvent.x,
        y: e.nativeEvent.y
      }
    });
  },
  isOverHot() {
    return (this.state.percentMoved > 0.75);
  },
  isOverNot() {
    return (this.state.percentMoved < -0.75);
  },
  onMouseUp(e) {
    this.setState({
      tracking: null,
      top: 0,
      left: 0,
      rotation: 0
    });
    if (this.isOverHot()) {
      this.props.onHot();
    }
    if (this.isOverNot()) {
      this.props.onNot();
    }
    this.props.onHover(null);
  },
  onMouseMove(e) {
    if (this.state.tracking) {
      var dx = ( this.state.tracking.x - e.nativeEvent.x ) * -1;
      var dy = this.state.tracking.y - e.nativeEvent.y;

      var pcntMoved = dx / ( this.props.width / 2 );
      if (pcntMoved > 1) { pcntMoved = 1; }
      if (pcntMoved < -1) { pcntMoved = -1; }
      var rotation = pcntMoved * 15;

      this.setState({
        top: -dy,
        left: dx,
        rotation: rotation,
        percentMoved: pcntMoved
      }, () => {
        if (this.isOverHot()) {
          this.props.onHover('hot');
        } else if (this.isOverNot()) {
          this.props.onHover('not');
        } else {
          this.props.onHover(null);
        }
      });
    }
  },
  render() {
    return (
      <div style={{
          position: 'absolute',
          width: this.props.width,
          height: this.props.height,
          top: this.state.top,
          left: this.state.left,
          'user-select': 'none',
          transform: 'rotate(' + this.state.rotation + 'deg)'
        }} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} onDragStart={(e) => { e.preventDefault(); }}>
        {this.props.children}
      </div>
    );
  }
});

var ItemContainer = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },
  render() {
    return (
      <div style={{position:'relative',width:this.props.width,height:this.props.height,overflow:'hidden'}}>
        {this.props.children}
      </div>
    );
  }
});

var HotOrNot = React.createClass({
  propTypes: {
    onHot: React.PropTypes.func,
    onNot: React.PropTypes.func,
    currentImage: React.PropTypes.string.isRequired,
    nextImage: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    hotButton: React.PropTypes.node,
    notButton: React.PropTypes.node
  },
  getInitialState() {
    return {
      hover: null
    };
  },
  onHover(region) {
    this.setState({hover:region});
  },
  render() {
    var hotButtonHolder = this.props.hotButton ?
      <div className={this.state.hover==='hot'?'active':''}>
        {this.props.hotButton}
      </div> : null;

    var notButtonHolder = this.props.notButton ?
      <div className={this.state.hover==='not'?'active':''}>
        {this.props.notButton}
      </div> : null;

    return (
      <div style={{position:'relative',width:this.props.width,height:this.props.height,overflow:'hidden'}}>
        <ItemContainer width={this.props.width} height={this.props.height}>
          {this.props.nextImage?<img src={this.props.nextImage} />:null}
          <Item width={this.props.width} height={this.props.height} onHot={this.props.onHot} onNot={this.props.onNot} onHover={this.onHover}>
            <img src={this.props.currentImage} />
          </Item>
        </ItemContainer>
        {notButtonHolder}
        {hotButtonHolder}
      </div>
    );
  }
});

var HotOrNotApp = React.createClass({
  getInitialState() {
    return {
      currentIndex: 0
    };
  },
  getCurrentItem() {
    return imageURLs[ this.state.currentIndex ];
  },
  getNextItem() {
    return this.state.currentIndex < imageURLs.length - 1 ? imageURLs[ this.state.currentIndex + 1 ] : null;
  },
  onHot() {
    this.proceedToNext();
  },
  onNot() {
    this.proceedToNext();
  },
  proceedToNext() {
    this.setState({
      currentIndex: this.state.currentIndex < imageURLs.length - 1 ? this.state.currentIndex + 1 : 0
    });
  },
  render() {
    var hotButton = <button className='btn btn-hot' onClick={this.onHot} style={{position:'absolute',top:450,left:250}}>Hot!</button>;
    var notButton = <button className='btn btn-not' onClick={this.onNot} style={{position:'absolute',top:450,left:50}}>Not!</button>;
    return (
      <HotOrNot
        currentImage={this.getCurrentItem()}
        nextImage={this.getNextItem()}
        onHot={this.onHot}
        onNot={this.onNot}
        width={380}
        height={540}
        hotButton={hotButton}
        notButton={notButton} />
    );
  }
});
React.render(<HotOrNotApp />, document.getElementById('content')); // jshint ignore:line

module.exports = HotOrNotApp;
