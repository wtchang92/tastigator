var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Navbar =  ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var MenuItem = ReactBootstrap.MenuItem;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var ReactDOM = require('react-dom');
var FormControlLabel = ReactBootstrap.ControlLabel;


var EditProfile = React.createClass({
    handleProfileEdit: function(e) {
        e.preventDefault();
        var username = ReactDOM.findDOMNode(this.refs.signup_username).value;
        var email = ReactDOM.findDOMNode(this.refs.signup_email).value;

        var profileValues = {"username":username,"email":email};
        this.updateProfile(profileValues);

    },
    handlePasswordEdit: function(e) {
        e.preventDefault();
        var current_password = ReactDOM.findDOMNode(this.refs.signup_pass).value;
        var new_password = ReactDOM.findDOMNode(this.refs.new_signup_pass).value;
        var new_confirm_password = ReactDOM.findDOMNode(this.refs.new_pass_confirm).value;

        var profileValues = {"password":current_password,"new_pass":new_password,"new_confirm_pass":new_confirm_password};
        this.updateProfile(profileValues);
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    updateProfile: function(profileValues) {
        console.log(profileValues);

        for (var value in profileValues) {
            if (profileValues[value] == "") {
                delete profileValues[value];
            }
        };
        console.log(profileValues);
        $.ajax({
          url: '/api/users/'+String(this.state.user.id)+'/',
          contentType:'application/json; charset=utf-8',
          dataType: 'json',
          type: 'PATCH',
          data: JSON.stringify(profileValues),
          headers: {
                    'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
                console.log("user updated");
                this.context.router.push('/app/foodie/'+String(this.state.foodie.id));

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    updateProfileImage: function(e) {
        e.preventDefault();
        var imageForm = this.refs.image_form;
        console.log(imageForm);
        var formData = new FormData(imageForm);

        $.ajax({
          url: '/api/profile_images/',
          contentType: false,
          processData: false,
          type: 'POST',
          data : formData,
          headers: {
                    'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
                console.log("user image updated");
                this.context.router.replace('/app/foodie/'+String(this.state.foodie.id));
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadUserData();
  },
  loadFoodieData: function(foodie_id){
        $.ajax({
            method: 'GET',
            url: '/api/foodies/'+String(foodie_id)+'/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                console.log("loading Foodie in form");
                this.setState({foodie: res});
                console.log(this.state.foodie);
            }.bind(this)
        })
  },
  loadUserData: function() {
        $.ajax({
            method: 'GET',
            url: '/api/users/i/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                console.log("loading user in form");
                this.setState({user: res});
                console.log("foodie id: "+ String(this.state.user.foodie_id));
                this.loadFoodieData(this.state.user.foodie_id);
            }.bind(this)
        })
  },
  getInitialState: function() {
    return {user:[],
            foodie:[],};
  },

    render: function() {
              return (

                  <div className='component'>
                    <Row className='sign-up-label text-align-center'>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                            <h1>Edit Profile</h1>
                            <br/>
                        </Col>
                    </Row>
                    <Row >
                        <Row className='sign-up-label text-align-center'>
                            <h3>Profile Image</h3>
                        </Row>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                          <form id="image_form" ref="image_form" encType="multipart/form-data" method="POST" onSubmit={this.updateProfileImage}>
                                    <FormGroup>
                                      <FormControlLabel>Profile Image</FormControlLabel>
                                      <FormControl name="image" type="file" placeholder="Profile Image" ref="profile_image"/>
                                      {' '}
                                      <br/>
                                      <Button type="submit">Edit</Button>
                                    </FormGroup>
                          </form>
                        </Col>
                    </Row>
                    <Row >
                        <Row className='sign-up-label text-align-center'>
                            <h3>Account Basics</h3>
                        </Row>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                          <form onSubmit={this.handleProfileEdit}>
                                    <FormGroup>
                                      <FormControlLabel>Foodie Name</FormControlLabel>
                                      <FormControl type="text" placeholder={this.state.user.username} ref="signup_username"/>
                                      <br/>
                                      <FormControlLabel>Email</FormControlLabel>
                                      <FormControl type="text" placeholder={this.state.user.email} ref="signup_email" />
                                      {' '}
                                      <br/>
                                      <Button type="submit">Edit</Button>
                                    </FormGroup>
                          </form>
                        </Col>
                    </Row>
                    <Row >
                        <Row className='sign-up-label text-align-center'>
                            <h3>Password</h3>
                        </Row>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                          <form onSubmit={this.handlePasswordEdit}>
                                    <FormGroup>
                                      <FormControlLabel>Current Password</FormControlLabel>
                                      <FormControl type="password" placeholder="current password" ref="signup_pass" />
                                      <br/>
                                      <FormControlLabel>New Password</FormControlLabel>
                                      <FormControl type="password" placeholder="new password" ref="new_signup_pass" />
                                      <br/>
                                      <FormControlLabel>Confirm New Password</FormControlLabel>
                                      <FormControl type="password" placeholder="confirm new password" ref="new_pass_confirm" />
                                      {' '}
                                      <br/>
                                      <Button type="submit">Edit</Button>
                                    </FormGroup>
                          </form>
                        </Col>
                    </Row>
                  </div>

              )
    }
});

module.exports = EditProfile;
