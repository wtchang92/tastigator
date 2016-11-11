import React from 'react';
import RecentPolls from './polls/poll_modal.jsx'
import RecentRestaurant from './restaurants/restaurant_modal.jsx'
var ReactBootstrap = require('react-bootstrap');
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {polls: [],restaurants: [],unvisisted_restaurants:[], user:[]};
    this.onLike = this.onLike.bind(this);
  }

  loadPollsFromServer () {

        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() 
        console.log(datetime);
        var Polls_url = "/api/polls/?added_gte="+datetime;
        $.ajax({
          method: 'GET',
          url: Polls_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({polls: data}, function() {
                console.log(this.state.polls);
            });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  }

  loadRestaurantsFromServer () {

        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() 
        console.log(datetime);
        var Restaurants_url = "/api/restaurants/?added_gte="+datetime;
        $.ajax({
          method: 'GET',
          url: Restaurants_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({restaurants: data}, function() {
                console.log(this.state.restaurants);
            });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  }

  loadUnvisitedRestaurantsFromServer () {
        var Restaurants_url = "/api/restaurants/?status="+"newly%20added";
        $.ajax({
          method: 'GET',
          url: Restaurants_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({unvisisted_restaurants: data}, function() {
                console.log(this.state.unvisisted_restaurants);
            });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  }

  componentDidMount () {
      this.loadPollsFromServer();
      this.loadRestaurantsFromServer();
      this.loadUnvisitedRestaurantsFromServer();
  }

  onLike () {
    let newLikesCount = this.state.likesCount + 1;
    this.setState({likesCount: newLikesCount});
  }

  render() {
    return (
      <div className="component">
     
            <Row className="widget-container text-align-center">
              <Col className="widget" xs={12} sm={4} md={4} mdOffset={4}>
                <h3># of Polls Created Today</h3><br/>
                <div className="kpi">{this.state.polls.length}</div>
                <RecentPolls polls={this.state.polls}/>
              </Col>
            </Row>
            <Row className="widget-container text-align-center">
              <Col className="widget" xs={12} sm={4} md={4} mdOffset={4}>
                <h3># of Restaurants Created Today</h3><br/>
                <div className="kpi">{this.state.restaurants.length}</div>
                <RecentRestaurant restaurants={this.state.restaurants}/>
              </Col>
            </Row>
            <Row className="widget-container text-align-center">
              <Col className="widget" xs={12} sm={4} md={4} mdOffset={4}>
                <h3># of Unvisited Restaurants</h3><br/>
                <div className="kpi">{this.state.unvisisted_restaurants.length}</div>
                <RecentRestaurant restaurants={this.state.unvisisted_restaurants}/>
              </Col>
            </Row>
    
      </div>
    );
  }

}

export default Dashboard;