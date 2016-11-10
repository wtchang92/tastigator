var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Router = require('react-router');
var CmsHeader = require('./navbar');
var rd3 = require('rd3');
var BarChart = rd3.BarChart;

var Navigation = React.createClass({
    render: function() {
        return (
            <div className="App">
                <CmsHeader />
            </div>
        );
    }
});

var Chart = React.createClass({
  render: function() {
    return  (
      <BarChart
      data={this.props.data}
      width={500}
      height={300}
      title="Vote Count"
      xAxisLabel="Restaurant(s)"
      yAxisLabel="Votes"
     
      />
  )}
});
//

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
            this.setState({creator_id:data.user.id});
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
            var bar_graph_data = [];
            var all_graph_data = [];
            if (Object.keys(data.vote_counts).length > 0) {
              for (var k in data.vote_counts) {
                  if (data.vote_counts.hasOwnProperty(k)) {
                     column_data={'x':k, 'y':data.vote_counts[k]};
                     all_graph_data.push(column_data);                     
                  }
              }
              bar_graph_data.push({'values':all_graph_data}); 
            }
            this.setState({bar_graph_data:bar_graph_data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  },
  MoveToFoodie: function () {
    this.context.router.push('/app/foodie/'+String(this.state.creator_id));
  },
  getInitialState: function() {
    return {creator_username: '',creator_id:'', selected_choice: '',vote_counts:[],vote_check:[],bar_graph_data:[],};
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
        <Row className="text-align-center">
                <Col xs={12} md={12}>
                        <a><h2 className="PollName" value={this.props.url}>
                          {this.props.title}
                        </h2></a>
                        <p>Added on: {this.props.added} By: <a onClick={this.MoveToFoodie}>{this.state.creator_username}</a><br/>
                        {this.props.children}</p>
                        <Chart data={this.state.bar_graph_data}/>
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
      contextTypes: {
        router: React.PropTypes.object.isRequired
      },
      goAddPoll: function() {
            this.context.router.push('/app/add_poll/');
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
      loadPollFromServer: function() {
        var Polls_url = "/api/polls/"+this.state.url_param+"/";
        $.ajax({
          method: 'GET',
          url: Polls_url,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            this.setState({data: [data.poll]});
          }.bind(this),
          error: function(xhr, status, err) {
            console.log("polls page mounted - loading failed");
          }.bind(this)
        });
      },
      getInitialState: function() {
        return {
            url_param: this.props.params.id,
            data: [],
            sort:[],
            order:[],
            user:[],
            foodie:[],
        };
      },
      componentDidMount: function() {
        this.loadPollFromServer();
        this.loadUserData();
      },

    render: function() {
        return (
            <div>
            <Navigation/>
            <div className='app_body'>
                <Row className="text-align-center">
                    <Col xs={12} md={12}>
                        <PollList data={this.state.data} foodie_id={this.state.foodie.id}/>
                    </Col>
                </Row>
                </div>
            </div>


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