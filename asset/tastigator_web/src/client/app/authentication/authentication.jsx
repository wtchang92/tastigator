var React = require('react')
var auth = require('./auth')
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

var loginHeader = React.createClass({
    logoutHandler: function() {
        auth.logout()
        this.context.router.replace('/app/login/')
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    handleSubmit: function(e) {
        e.preventDefault()


        var username = ReactDOM.findDOMNode(this.refs.username).value;
        var pass = ReactDOM.findDOMNode(this.refs.pass).value;

        console.log("attempt login 4 0")
        this.moveToHomePage(username, pass);


    },
    moveToHomePage: function(username,pass) {
        console.log("attempt login 4 1")
        $.ajax({
            type: 'POST',
            url: '/api/obtain-auth-token/',
            data: {
                username: username.toLowerCase(),
                password: pass
            },
            success: function(res){
                localStorage.token = res.token;
                this.context.router.replace('/app/');
            }.bind(this),
              error: function(xhr, status, err) {
                console.error("login failed");
              }.bind(this)
        })
    },
    handleRegistration: function(e) {
        e.preventDefault()
        var username = ReactDOM.findDOMNode(this.refs.signup_username).value;
        var email = ReactDOM.findDOMNode(this.refs.signup_email).value;
        var pass = ReactDOM.findDOMNode(this.refs.signup_pass).value;
        var confirm_pass = ReactDOM.findDOMNode(this.refs.confirm_signup_pass).value;

        if (pass == confirm_pass && !!pass && !!confirm_pass) {
            console.log("testing sign up 0");
            this.signUp(username, email, pass, confirm_pass);
        }

    },
    signUp: function(username, email, pass, confirm_pass) {
        console.log("testing sign up 1");
        if (pass ===confirm_pass) {
            console.log("testing sign up 2");
            var data = {
                    username: username,
                    email:email,
                    password: pass,
                    confirm_pass: confirm_pass,
                    new_pass: null,
                    new_confirm_pass: null,
                };
            var context = this;
            $.ajax({
                type: 'POST',
                url: '/api/users/',
                data: data,
                success: function(res){
                    console.log("testing sign up 3");
                     context.moveToHomePage(username, pass)
                }.bind(this),
                  error: function(xhr, status, err) {
                    console.log("testing sign up 4");
                    console.log("registration failed");
                  }.bind(this)
            })
        }
    },
    logoutHandler: function() {
        auth.logout()
        this.context.router.replace('/app/login/')
    },

    render: function() {
              return (
                <div>
                    <Navbar>
                        <Navbar.Header>
                          <Navbar.Brand>
                            <a href="#">Food Compass</a>
                          </Navbar.Brand>
                          <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>

                          <Nav pullRight>
                            <form onSubmit={this.handleSubmit}>
                                <Navbar.Form role="form">
                                    <FormGroup>
                                      <FormControl type="text" placeholder="username" ref="username" />
                                      <FormControl type="password" placeholder="password" ref="pass" />
                                 
                                      <Button type="submit">Login</Button>
                                    </FormGroup>

                                </Navbar.Form>
                            </form>
                          </Nav>
                        </Navbar.Collapse>
                      </Navbar>
                      <Row className='sign-up-label text-align-center'>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                            <h1>Sign Up</h1>
                            <br/>
                        </Col>
                      </Row>
                      <Row className='text-align-center'>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                          <form onSubmit={this.handleRegistration}>
                                    <FormGroup>
                                      <FormControl type="text" placeholder="username" ref="signup_username" />
                                      <br/>
                                      <FormControl type="text" placeholder="email" ref="signup_email" />
                                      <br/>
                                      <FormControl type="password" placeholder="password" ref="signup_pass" />
                                      <br/>
                                      <FormControl type="password" placeholder="confirm password" ref="confirm_signup_pass" />
                                      {' '}
                                      <br/>
                                      <br/>
                                      <Button type="submit">Register</Button>
                                    </FormGroup>
                          </form>
                        </Col>
                      </Row>
                  </div>
              )
    }
});

module.exports = loginHeader;
