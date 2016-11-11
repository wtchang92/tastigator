import React from 'react';
import Navigation from './navbar.jsx';


class AwesomeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {user:[]};

  }

  componentWillMount () {
    console.log("Welcome")
    this.loadUserData()
  }

  updateUserFromProfileEdit (updated_user) {
        this.setState({user:updated_user})
  }

  loadUserData () {
        $.ajax({
            method: 'GET',
            url: '/api/users/i/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                console.log(res)
                this.setState({user: res})
            }.bind(this)
        })
  }


  render() {
    return (
      <div>
        <Navigation user={this.state.user}/>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default AwesomeComponent;