var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Router = require('react-router');

var Choice = React.createClass({
  handleChoice: function(e) {
    console.log("picking choice");
    console.log(e.currentTarget.value);
    this.props.updateChoice(e.currentTarget.value);
  },
  MoveToProfile: function (event) {
    console.log("move calls");
    console.log(String(this.props.restaurant_id));
    this.props.handleMoveToProfile(String(this.props.restaurant_id));
  },
  getInitialState: function() {
    return {data: '', restaurant:[],selectedChoice:[],};
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
            this.setState({restaurant: data.restaurant});
            console.log(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error("failed to load restaurant");
          }.bind(this)
        });
  },
  render: function() {
    return (
      <div className="restaurant text-align-center">
                <Col xs={3} md={3}>
                        <a><h2 className="restaurantName" onClick={this.MoveToProfile} value={this.props.restaurant_id}>
                          {this.state.restaurant.name}
                        </h2></a>
                        <p>Review average: {this.state.data.average_score}/10<br/>
                        {this.state.restaurant.description}</p>
                        <input onChange={this.handleChoice}  type="radio" name={this.props.poll_id} ref={this.props.restaurant_id} value={this.props.restaurant_id}/>
                </Col>

      </div>
    );
  }
});


var Poll = React.createClass({
  updateSelectedChoice: function(choice) {
    this.setState({selected_choice: choice}, function() {
                console.log("poll choice picked");
                console.log(this.state.selected_choice);
            });
  },
  loadCreator: function() {
       $.ajax({
          method: 'Get',
          url: "/api/foodies/"+this.props.creator_name+"/",
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            console.log("creator loaded");
            console.log(data);
            this.setState({creator_username:data.user.username});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  },
  loadVoteCounts: function() {
       $.ajax({
          method: 'Get',
          url: "/api/polls/"+this.props.poll_id+"/",
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            console.log("vote counts loaded");
            console.log(data.vote_counts);
            this.setState({vote_counts:data.vote_counts});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  },
  MoveToProfile: function (event) {
    this.context.router.push('/app/polls/'+String(this.props.poll_id)+"/");
  },
  getInitialState: function() {
    return {creator_username: '', selected_choice: '',vote_counts:[],vote_check:[],};
  },
  componentDidMount: function() {
        this.loadCreator();
        this.loadVoteCounts();
  },
  submitVote: function() {
        console.log("submitting vote");
        var vote_url = "/api/votes/";
        var foodie_id = this.props.foodie_id;
        var choice = this.state.selected_choice;
        var poll_id = this.props.poll_id;
        vote_url = vote_url+"?foodie="+String(foodie_id)+"&poll="+String(poll_id)

        $.ajax({
          url: vote_url,
          contentType:'application/json; charset=utf-8',
          dataType: 'json',
          type: 'GET',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(vote_check) {
            console.log("check vote state-0");
            console.log(vote_url);
            console.log("check vote state-1");
            this.setState({vote_check: vote_check}, function() {
                if (vote_check.length == 0) {
                data = {foodie_pk: foodie_id, choice: choice, poll:poll_id};
                console.log("posting vote");
                console.log(JSON.stringify(data));
                $.ajax({
                  url: "/api/votes/",
                  contentType:'application/json; charset=utf-8',
                  dataType: 'json',
                  type: 'POST',
                  data: JSON.stringify(data),
                  headers: {
                        'Authorization': 'Token ' + localStorage.token
                  },
                  success: function(data) {
                    this.loadVoteCounts();
                  }.bind(this),
                  error: function(xhr, status, err) {
                    console.log("vote failed");
                    console.error(this.props.url, status, err.toString());
                  }.bind(this)
                });
                } else {
                    console.log(vote_check);
                    data = {foodie_pk: foodie_id, choice: choice, poll:poll_id};
                    $.ajax({
                      url: "/api/votes/"+String(this.state.vote_check[0].id)+"/",
                      contentType:'application/json; charset=utf-8',
                      dataType: 'json',
                      type: 'PUT',
                      data: JSON.stringify(data),
                      headers: {
                            'Authorization': 'Token ' + localStorage.token
                      },
                      success: function(data) {
                        console.log("vote created");
                        this.loadVoteCounts();
                      }.bind(this),
                      error: function(xhr, status, err) {
                        console.log("vote failed");
                        console.error(this.props.url, status, err.toString());
                      }.bind(this)
                    });
                }
            });

          }.bind(this),
          error: function(xhr, status, err) {
            console.log("vote failed");
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });

  },
  goToRestaurantProfile: function(restaurantKey) {
        this.context.router.push('/app/restaurant/'+String(restaurantKey));
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired
  },
  render: function() {
    var ChoicesNodes = this.props.choices.map(function(choice) {
      return (
        <Choice updateChoice={this.updateSelectedChoice} restaurant_id={choice} poll_id={this.props.poll_id} handleMoveToProfile={this.goToRestaurantProfile}>
        </Choice>
      );
    }, this);
        var VoteCountsNodes = Object.getOwnPropertyNames(this.state.vote_counts).map(function(key) {
            var restaurantName = {key};
            var voteCount = this.state.vote_counts[key];
            return (
                <div>{key}: {voteCount}</div>
              );
        }, this);

    return (
      <div className="Poll">
        <Row className="text-align-center poll-row">
                <Col xs={12} md={12}>
                        <a><h2 className="PollName" value={this.props.url} onClick={this.MoveToProfile}>
                          {this.props.title}
                        </h2></a>
                        <p>Added on: {this.props.added} By: {this.state.creator_username}<br/>
                        {this.props.children}</p>
                        <h4>
                          Vote Count
                        </h4>
                        <span>{VoteCountsNodes}</span>
                        <Col xs={12} md={12}>
                            {ChoicesNodes}
                        </Col>
                </Col>
                <Button onClick={this.submitVote}>Vote</Button>
        </Row>
      </div>
    );
  }
});

var PollPage= React.createClass({
      loadFoodieData: function(foodie_id){
        $.ajax({
            method: 'GET',
            url: '/api/foodies/'+String(foodie_id)+'/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                this.setState({foodie: res});
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
                    this.setState({user: res});
                    this.loadFoodieData(this.state.user.foodie_id);
                }.bind(this)
            })
      },
      loadPollsFromServer: function() {
        var Polls_url = "/api/polls/";
        $.ajax({
          method: 'GET',
          url: Polls_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({data: data}, function() {
                console.log(this.state.data);
            });
          }.bind(this),
          error: function(xhr, status, err) {
            console.log("polls page mounted - loading failed");
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      getInitialState: function() {
        return {data: [],
            sort:[],
            order:[],
            user:[],
            foodie:[],
        };
      },
      componentDidMount: function() {
        this.loadPollsFromServer();
        this.loadUserData();
      },

    render: function() {
        return (
            <Row className="text-align-center">
                <Col xs={12} md={12}>
                           <h1>Polls</h1>
                           <PollList data={this.state.data} foodie_id={this.state.foodie.id}/>
                </Col>
            </Row>


        )
    }
});

var PollList = React.createClass({
  render: function() {
    var PollNodes = this.props.data.map(function(poll) {
      return (
        <Poll poll_id={poll.id} creator_name={poll.creator} foodie_id={this.props.foodie_id} title={poll.title} choices={poll.Restaurants} added={poll.added}>
          {poll.description}
        </Poll>
      );
    }, this);
    return (
      <div className="PollList">
        {PollNodes}
      </div>
    );
  }
});

module.exports = PollPage;