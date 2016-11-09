var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
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
      updateSort: function(event) {
        console.log("sort update");
        if (event.target.value == "score") {
            this.setState({sort: "avg_review"}, function() {
                console.log(this.state.sort);
                this.loadRestaurantsFromServer();
            })
        }
        else if (event.target.value == "added") {
            this.setState({sort: "added"}, function() {
                console.log(this.state.sort);
                this.loadRestaurantsFromServer();
            })
        }
      },
      updateFilter: function(event) {
          console.log("sort filter");
          if (event.target.value == "newly added") {
            this.setState({filter: "newly%20added"}, function() {
                console.log(this.state.filter);
                this.loadRestaurantsFromServer();
            })
          }
          else if (event.target.value == "visited") {
              this.setState({filter: "visited"}, function() {
                  console.log(this.state.filter);
                  this.loadRestaurantsFromServer();
              })
          }
      },
      loadUserFromServer: function() {
        $.ajax({
                    method: 'GET',
                    url: '/api/users/i/',
                    datatype: 'json',
                    headers: {
                        'Authorization': 'Token ' + localStorage.token
                    },
                    success: function(user_res) {
                        console.log("loading user");
                        console.log(user_res);
                        console.log("loading user loaded");
                        if (user_res.is_guide) {
                          this.setState({can_edit:true});
                        }
                    }.bind(this)
        })
      },
      loadRestaurantsFromServer: function() {
        var restaurants_url = "/api/restaurants/?";
        if (this.state.sort) {
            restaurants_url = restaurants_url + "ordering="+String(this.state.sort)+"&";
        }
        if (this.state.filter) {
            restaurants_url = restaurants_url + "status="+String(this.state.filter);
        }
        $.ajax({
          method: 'GET',
          url: restaurants_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({data: data});
            this.loadUserFromServer();
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      getInitialState: function() {
        return {data: [],
            sort:null,
            filter:null,
            order:[],
            can_edit:false
        };
      },
      componentDidMount: function() {
        this.loadRestaurantsFromServer();
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
                               <Button className={this.state.can_edit ? ''  : 'hidden'} onClick={this.goAddRestaurant}>Add Restaurant</Button>
                        </Row>
                        <br className={this.state.can_edit ? ''  : 'hidden'} />
                        <br className={this.state.can_edit ? ''  : 'hidden'} />
                        <Row>
                               <span>Filter by: <Button value="newly added" onClick={this.updateFilter}>Newly Added</Button> <Button value="visited" onClick={this.updateFilter}>Visited</Button></span> 
                               <br/>
                               <br/>
                               <span>Sort by: <Button value="score" onClick={this.updateSort}>Score</Button> <Button value="added" onClick={this.updateSort}>Date</Button></span>
                               <RestaurantList data={this.state.data} />
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
        <Restaurant name={restaurant.name} status={restaurant.status} avg_score={restaurant.avg_review} key={restaurant.id} url={restaurant.id} handleMoveToProfile={this.goToRestaurantProfile} >
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

export default RestaurantPage