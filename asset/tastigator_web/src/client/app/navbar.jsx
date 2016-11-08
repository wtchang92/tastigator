var React = require('react')
var auth = require('./authentication/auth')
var ReactBootstrap = require('react-bootstrap');
var Router = require('react-router');

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





var Navigation = React.createClass({
    logoutHandler: function() {
        auth.logout()
        this.context.router.replace('/app/login/')
    },
    returnHome: function() {
        this.context.router.push('/app/');
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    goAddRestaurant: function() {
        this.context.router.push('/app/add_restaurant/');
    },
    goRestaurantListing: function() {
        this.context.router.push('/app/restaurants/');
    },
    goPollListing: function() {
        this.context.router.push('/app/polls/');
    },
    goCircleListing: function() {
        this.context.router.push('/app/circles/');
    },
    goToFoodieProfile: function() {
        var foodie_key = this.state.user.foodie_id;
        this.context.router.replace('/app/foodie/'+foodie_key);
    },
    goAddPoll: function() {
        this.context.router.push('/app/add_poll/');
    },

    handleSubmit: function(e) {
        e.preventDefault()

        var username = this.refs.username.value
        var pass = this.refs.pass.value

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
    logoutHandler: function() {
        auth.logout()
        this.context.router.replace('/app/login/')
    },

    getInitialState: function() {
        return {'user':[]}
    },
    componentDidMount: function() {
        this.loadUserData()
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
                this.setState({user: res})
            }.bind(this)
        })
    },

    render: function() {
      
                    const navbarInstance = (
                      <Navbar className="fixed_nav" fixedTop>
                        <Navbar.Header>
                          <Navbar.Brand>
                            <a onClick={this.returnHome}>Tastigator</a>
                          </Navbar.Brand>
                          <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                          <Nav>
                            <NavItem eventKey={1} onClick={this.goPollListing}>Dashboard</NavItem>
                            <NavItem eventKey={2} onClick={this.goPollListing}>Polls</NavItem>
                            <NavItem eventKey={3} onClick={this.goRestaurantListing}>Restaurants</NavItem>
                          </Nav>
                          <Nav pullRight>
                            <NavItem eventKey={1} onClick={this.goToFoodieProfile}>{this.state.user.username}</NavItem>
                            <NavItem eventKey={2} href="#" onClick={this.logoutHandler}>Log out</NavItem>
                          </Nav>
                        </Navbar.Collapse>
                      </Navbar>
                    );
                    return navbarInstance;
    

    }
});

export default Navigation;
