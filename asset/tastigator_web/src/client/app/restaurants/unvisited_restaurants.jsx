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
var Modal = ReactBootstrap.Modal;
var Tooltip = ReactBootstrap.Tooltip;
var Popover = ReactBootstrap.Popover;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var FontAwesome = require('react-fontawesome');
var Router = require('react-router');


var Restaurant = React.createClass({
  MoveToProfile: function (event) {
    this.props.handleMoveToProfile(String(this.props.url));
  },
  render: function() {
    return (
      <div className="restaurant">
        <Row className="text-align-center">
                <Col xs={12} md={12}>
                        <a><h2 className="restaurantName" onClick={this.MoveToProfile} value={this.props.url}>
                          {this.props.name}
                        </h2>
                        </a>
                        <h4>Status: {this.props.status}</h4>
                        <span><FontAwesome name='thumbs-o-down'/>: {this.props.thumb_downs}</span><br/>
                        <span>added: {this.props.added}</span>
                        <p>Review average: {this.props.avg_score}/10<br/>
                        {this.props.children}</p>
                </Col>
        </Row>
      </div>
    );
  }
});

var RestaurantPage= React.createClass({
      contextTypes: {
        router: React.PropTypes.object.isRequired
      },
      goAddRestaurant: function() {
            this.context.router.push('/app/add_restaurant/');
      },
      getInitialState: function() {
        return {data: [],
        };
      },

    render: function() {
        return (
            <div className="component">
                <Row className="text-align-center">
                    <Col xs={12} md={12}>
                        <Row>
                               <h1>Restaurants</h1><br/>
                        </Row>
                        <Row>
                            <RestaurantList data={this.props.restaurants} />
                        </Row>
                    </Col>
                </Row>
            </div>


        )
    }
});

var RestaurantList = React.createClass({
  goToRestaurantProfile: function(restaurantKey) {
        this.context.router.push('/app/restaurant/'+String(restaurantKey));
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired
  },
  render: function() {
    var restaurantNodes = this.props.data.map(function(restaurant) {
      return (
        <Restaurant name={restaurant.name} added={restaurant.added} thumb_downs={restaurant.thumb_downs} status={restaurant.status} avg_score={restaurant.avg_review} key={restaurant.id} url={restaurant.id} handleMoveToProfile={this.goToRestaurantProfile} >
          {restaurant.description}
        </Restaurant>
      );
    }, this);
    return (
      <div className="restaurantList">
        {restaurantNodes}
      </div>
    );
  }
});

var RestaurantsModal = React.createClass({
  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  render() {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = (
      <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
    );

    return (
      <div>
        <Button

          onClick={this.open}
        >
          Recent Restaurants
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Recent Polls</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <RestaurantPage restaurants={this.props.restaurants} close={this.close}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = RestaurantsModal;