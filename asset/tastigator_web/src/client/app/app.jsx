import React from 'react';
import Navigation from './navbar.jsx';

class AwesomeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {likesCount : 0};
    this.onLike = this.onLike.bind(this);
  }

  componentDidMount () {
    console.log("Welcome");
  }

  onLike () {
    let newLikesCount = this.state.likesCount + 1;
    this.setState({likesCount: newLikesCount});
  }

  render() {
    return (
      <div>
        <Navigation/>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default AwesomeComponent;