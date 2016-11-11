var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var Router = require('react-router');
var rd3 = require('rd3');
var BarChart = rd3.BarChart;

var Chart = React.createClass({
  render: function() {
    return  (
      <BarChart
      data={this.props.data}
      width={360}
      height={240}
      title="Vote Count"
      xAxisLabel="Restaurant(s)"
      yAxisLabel="Votes"
     
      />
  )}
});
//

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
                  console.log(res);
                    this.setState({user: res.foodie_id});
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
        return {data: [],user:[],
        };
      },
      componentDidMount: function() {
        console.log("starting poll page");
        this.loadPollsFromServer();
        this.loadUserData();
      },

    render: function() {
        return (
            <div>
              <div className='text-align-center'>
                <Button onClick={this.goAddPoll}>Add Poll</Button>
              </div>
              <div className='component'>
                  <Row className="text-align-center">
                      <Col xs={12} md={12}>
                          <PollList data={this.state.data} user={this.state.user}/>       
                      </Col>
                  </Row>
                </div>
           
            </div>
        )
    }
});

var Choice = React.createClass({
  handleChoice: function(e) {
    console.log("picking choice");
    console.log(e.currentTarget.value);
    this.props.updateChoice(e.currentTarget.value);
  },
  MoveToProfile: function (event) {
    console.log("move calls");
    console.log(String(this.props.choice_id));
    this.props.handleMoveToProfile(String(this.props.choice_id));
  },
  getInitialState: function() {
    return {data: '', restaurant:[],selectedChoice:[],};
  },
  componentDidMount: function() {

  },
  render: function() {
    return (
      <div className="restaurant text-align-center">
                <Col xs={3} md={3}>
                        <a><h2 className="restaurantName" onClick={this.MoveToProfile} value={this.props.choice_id}>
                          {this.props.choice_name}
                        </h2></a>
                        <p>{this.props.status}<br/>
                        average review: {this.props.avg_score}/10
                        </p>
                        <input onChange={this.handleChoice}  type="radio" name={this.props.poll_id} ref={this.props.choice_id} value={this.props.choice_id}/>
                </Col>

      </div>
    );
  }
});

var ChoiceList = React.createClass({
  render: function() {
    var ChoiceNodes = this.props.choices.map(function(choice) {
      return (
        <Choice choice_id={choice.id} choice_name={choice.name}
         status={choice.status} poll_id={this.props.poll_id}
         updateChoice={this.props.updateSelectedChoice} avg_score={choice.score_average} handleMoveToProfile={this.props.handleMoveToProfile}
        />
      );
    }, this);
    return (
      <div className="PollList">
        {ChoiceNodes}
      </div>
    );
  }
});

var Poll = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired
      },
  updateSelectedChoice: function(choice) {
    this.setState({selected_choice: choice}, function() {
                console.log("poll choice picked");
                console.log(this.state.selected_choice);
            });
  },
  getInitialState: function() {
    return {selected_choice: '',vote_counts:[],vote_check:[],bar_graph_data:[],};
  },
  componentDidMount: function() {
        this.loadVoteCounts();
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
            console.log(data);
            console.log(data.vote_counts);
            this.setState({vote_counts:data.vote_counts});
            var bar_graph_data = [];
            var all_graph_data = [];
            if (Object.keys(data.vote_counts).length > 0) {
              for (var k in data.vote_counts) {
                  if (data.vote_counts.hasOwnProperty(k)) {
                     var column_data={'x':k, 'y':data.vote_counts[k]};
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
  submitVote: function() {
        console.log("submitting vote");
        var vote_url = "/api/votes/";
        var choice = this.state.selected_choice;
        var poll_id = this.props.poll_id;
        var foodie_id = this.props.user;
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
                var data = {"choice": choice, "poll":poll_id};
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
                    var data = {"choice": choice, "poll":poll_id};
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
  goToPoll: function() {
        this.context.router.push('/app/poll/'+String(this.props.poll_id));
  },
  render: function() {
    return (
      <div className="poll app_container">
      <Row>
      <a onClick={this.goToPoll}><h2>{this.props.title}</h2></a>
      <span>Created by: {this.props.creator.username}</span><br/>
      <span>Added on: {this.props.added}</span>
      <p>Description: {this.props.children}</p>
      <Chart data={this.state.bar_graph_data}/>
      <ChoiceList poll_id={this.props.poll_id} choices={this.props.choices} updateSelectedChoice={this.updateSelectedChoice} handleMoveToProfile={this.goToRestaurantProfile}/>
      </Row>
      <Button onClick={this.submitVote}>Vote</Button>
      </div>
    );
  }
});

var PollList = React.createClass({
  render: function() {
    var PollNodes = this.props.data.map(function(poll) {
      return (
        <Poll poll_id={poll.id} creator={poll.creator.user} user={this.props.user} title={poll.title} choices={poll.restaurants} added={poll.added}>
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

export default PollPage;