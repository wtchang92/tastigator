var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;


var Restaurant = React.createClass({
  updateRestaurantChoice: function() {
    this.props.handleRestaurantChoice(this.props.url);
    console.log("submitting restaurant choice to poll - 0");
  },
  MoveToProfile: function (event) {
    console.log("move calls");
    console.log(String(this.props.url));
    this.props.handleMoveToProfile(String(this.props.url));
  },
  render: function() {
    return (
      <div className="restaurant">
        <Row className="text-align-center">
                <Col xs={12} md={12}>
                        <a><h3 className="restaurantName" onClick={this.MoveToProfile} value={this.props.url}>
                          {this.props.name}
                        </h3></a>
                        <p>Review average: {this.props.avg_score}/10<br/>
                        {this.props.children}</p>
                </Col>
                <Button onClick={this.updateRestaurantChoice}>Add To Poll</Button>
        </Row>
      </div>
    );
  }
});

var Choice = React.createClass({
  MoveToProfile: function (event) {
    console.log("move calls");
    console.log(String(this.props.restaurant_id));
    this.props.handleMoveToProfile(String(this.props.restaurant_id));
  },
  getInitialState: function() {
    return {data: '', restaurant:[],restaurant_name:null};
  },
  componentDidMount: function() {
        this.loadRestaurantFromServer();
  },
  loadRestaurantFromServer: function() {
        var restaurants_url = "/api/restaurants/"+String(this.props.restaurant_id)+'/';
        $.ajax({
          method: 'GET',
          url: restaurants_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({data: data});
            this.setState({restaurant_name:data.name});
            this.setState({restaurant: data});
            console.log(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error("failed to load restaurant");
          }.bind(this)
        });
      },
  render: function() {
    return (
      <div className="restaurant">
                <Col xs={3} md={3}>
                        <a><h2 className="restaurantName" onClick={this.MoveToProfile} value={this.props.restaurant_id}>
                          {this.state.restaurant_name}
                        </h2></a>
                        <p>Review average: {this.state.restaurant.score_average}/10<br/>
                        {this.state.restaurant.description}</p>
                </Col>

      </div>
    );
  }
});

var RestaurantPage= React.createClass({
      updateSort: function(event) {
        console.log("sort update");
        if (event.target.value == "score") {
            this.setState({sort: "score"}, function() {
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
      loadRestaurantsFromServer: function() {
        var restaurants_url = "/api/restaurants/";
        if (this.state.sort == "score") {
            console.log("sort by score");
            restaurants_url = restaurants_url + "?ordering=avg_review"
        }
        else if (this.state.sort == "added") {
            console.log("sort by added");
            restaurants_url = restaurants_url + "?ordering=added"
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
            console.log(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      getInitialState: function() {
        return {data: [],
            sort:[],
            order:[],
        };
      },
      componentDidMount: function() {
        this.loadRestaurantsFromServer();
      },

    render: function() {
        return (
            <Row className="text-align-center">
                <Col xs={12} md={12}>
                           <h1>Add Restaurant(s) To Poll</h1>
                           <span>Sort by: <Button value="score" onClick={this.updateSort}>Score</Button> <Button value="added" onClick={this.updateSort}>Date</Button></span>
                           <RestaurantList data={this.state.data} handleRestaurantChoice ={this.props.handleRestaurantChoice}/>
                </Col>
            </Row>


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
        <Restaurant name={restaurant.name} avg_score={restaurant.avg_review} key={restaurant.id} url={restaurant.id} handleMoveToProfile={this.goToRestaurantProfile} handleRestaurantChoice={this.props.handleRestaurantChoice}>
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








var PollForm = React.createClass({
  goToRestaurantProfile: function(restaurantKey) {
        this.context.router.push('/app/restaurant/'+String(restaurantKey));
  },
  goToPoll: function(poll_id) {
        this.context.router.push('/app/poll/'+String(poll_id));
  },
  updateRestaurantChoices: function(restaurant) {

        console.log("submitting restaurant choice to poll - 1");
        console.log(restaurant);
        console.log(typeof this.state.restaurants);

        var newRestaurants = this.state.restaurants.slice();
        if (newRestaurants.indexOf(restaurant) < 0) {
            newRestaurants.push(restaurant);
            this.setState({ restaurants: newRestaurants }, function() {
                console.log(this.state.restaurants);
            });
        } else {
            console.log("already added");
        }

  },
  componentDidMount: function() {
  },

  contextTypes: {
        router: React.PropTypes.object.isRequired
  },
  handlePollSubmit: function(poll) {
    console.log("posting poll");
    console.log(JSON.stringify(poll));
    $.ajax({
      url: '/api/polls/',
      contentType:'application/json; charset=utf-8',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(poll),
      headers: {
                'Authorization': 'Token ' + localStorage.token
      },
      success: function(data) {
            console.log("poll submitted");
            this.goToPoll(data.id);

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {title: '', description: '', status:'', creator:'', restaurants:[], user:[],
            foodie:[],};
  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleDescriptionChange: function(e) {
    this.setState({description: e.target.value});
  },
  handleStatusChange: function(e) {
    this.setState({status: e.target.value});
  },
  handleCreatorChange: function(e) {
    this.setState({creator: e.target.value});
  },
  handleRestaurantsChange: function(e) {
    this.setState({restaurants: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var description = this.state.description.trim();
    var restaurants = this.state.restaurants;
    if (!title || !description || !restaurants) {
      return;
    }
    this.handlePollSubmit({title: title, description: description, restaurant_choices:restaurants});
  },
  render: function() {
    var choiceNodes = this.state.restaurants.map(function(restaurant) {
      return (
        <Choice restaurant_id = {restaurant} handleMoveToProfile={this.goToRestaurantProfile}>
        </Choice>
      );
    }, this);
    return (
      <div>
          <Row className='sign-up-label text-align-center'>
               <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                   <h1>Add Poll</h1>
                   <br/>
               </Col>
          </Row>
                      <Row className='text-align-center'>
                        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                          <form className="commentForm" onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                  type="text"
                                  placeholder="Title"
                                  value={this.state.title}
                                  onChange={this.handleTitleChange}
                                />
                                <br/>
                                <FormControl
                                  type="text"
                                  placeholder="Description"
                                  value={this.state.description}
                                  onChange={this.handleDescriptionChange}
                                />
                                <br/>
                                <Row>
                                {choiceNodes}
                                </Row>
                                <RestaurantPage handleRestaurantChoice={this.updateRestaurantChoices}/>
                                <br/>
                                <br/>
                                <Button type="submit">Submit</Button>
                            </FormGroup>
                          </form>
                        </Col>
                      </Row>


      </div>
    );
  }
});

export default PollForm;