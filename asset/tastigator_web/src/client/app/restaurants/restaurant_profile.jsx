var React = require('react')
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Router = require('react-router');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var ReactDOM = require('react-dom');
var FontAwesome = require('react-fontawesome');
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;



var ControlLabel = ReactBootstrap.ControlLabel;
var Checkbox = ReactBootstrap.Checkbox;



var FeedbackList = React.createClass({
  render: function() {
    var feedNodes = this.props.feedbacks.map(function(feedback) {
      return (
        <Feedback  key={feedback.id}
         foodie_pk={feedback.foodie} 
         foodie_name={feedback.foodie_name} added_on={feedback.added}>
          {feedback.message}
        </Feedback>
      );
    }, this);
    return (
      <Row>
        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                   {feedNodes}
        </Col>
      </Row>
    );
  }
});

var Feedback = React.createClass({
  goToFoodieProfile: function() {
        var foodie_key = String(this.props.foodie_pk);
        this.context.router.push('/app/foodie/'+foodie_key);
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div className="Feedback">
        <h5 >
          Feedback: {this.props.children}
        </h5>
        <span><em>By: <a onClick={this.goToFoodieProfile}>{this.props.foodie_name}</a></em> on {this.props.added_on}</span><br/>
        
      </div>
    );
  }
});

var FeedbackForm = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault();
      var message = ReactDOM.findDOMNode(this.refs.message).value;
      if (!message) {
        return;
      };
      this.props.onFeedbackSubmit({review: parseInt(this.props.review_id), message: message});
    },

    render: function() {
        return (
            <div>
                <Row className="text-align-center">
                    <Col xs={8} sm={8} md={6} xsOffset={2} smOffset={2} mdOffset={3}>
                        <h3>Post a review feedback:</h3>
                        <form onSubmit={this.handleSubmit}>
                          <FormGroup>
                              <ControlLabel>Message</ControlLabel>
                              <FormControl type="textarea" placeholder="Message" ref="message" />
        
                          </FormGroup>
                          <Button type="submit">Post</Button>
                        </form>
                    </Col>
                </Row>
            </div>
        );
    }
});

var Review = React.createClass({
  goToFoodieProfile: function() {
        var foodie_key = String(this.props.foodie_pk);
        this.context.router.push('/app/foodie/'+foodie_key);
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
        feedbacks:[],
    };
  },
  handleFeedbackSubmit: function(Feedback) {
    var Feedbacks = this.state.feedbacks;
    $.ajax({
      method: 'POST',
      url: '/api/feedbacks/',
      dataType: 'json',
      data: Feedback,
      headers: {
            'Authorization': 'Token ' + localStorage.token
      },
      success: function(data) {
        var newFeedbacks = Feedbacks.concat([data]);
        this.setState({feedbacks: newFeedbacks});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({feedbacks: Feedbacks});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadFeedbacks: function() {
      console.log("loading feedbacks");
      console.log(this.props.review_id);
      $.ajax({
        method: 'GET',
            url: '/api/feedbacks/'+"?review="+this.props.review_id,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
                console.log(data);
                this.setState({feedbacks: data});
              }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });       
  },
  componentDidMount: function() {
    this.loadFeedbacks();
  },
  render: function() {
    if (this.props.user_foodie_id == this.props.foodie_pk) {
      var my_review_symbol = <h4>My Review</h4>
    }
    return (
      <div className="Review">
        <h2 className="ReviewAuthor">
          {this.props.subject}
        </h2> {my_review_symbol}
        <span><em>By: <a onClick={this.goToFoodieProfile}>{this.props.foodie_name}</a></em> on {this.props.added_on}</span><br/>
        <span>score: {this.props.score}/10</span>
        <span><p>{this.props.children}</p></span>
        <FeedbackList feedbacks={this.state.feedbacks}/>
        <FeedbackForm review_id={this.props.review_id} onFeedbackSubmit={this.handleFeedbackSubmit}/>
      </div>
    );
  }
});



var ReviewBox = React.createClass({
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

            }.bind(this)
        })
  },
  loadReviewsFromServer: function() {
    var reviews_url = "/api/reviews/";
    if (this.state.sort == "score") {
        reviews_url = reviews_url + "?ordering=score"
    }
    else if (this.state.sort == "added") {
        reviews_url = reviews_url + "?ordering=added"
    }
    $.ajax({
     method: 'GET',
            url: reviews_url,
            data:{restaurant:this.props.restaurantPk},
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleReviewSubmit: function(Review) {
    var Reviews = this.state.data;
    $.ajax({
      method: 'POST',
      url: '/api/reviews/',
      dataType: 'json',
      data: Review,
      headers: {
            'Authorization': 'Token ' + localStorage.token
      },
      success: function(data) {
        var newReviews = Reviews.concat([data]);
        this.setState({data: newReviews});
        this.props.handleAverageScore();
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: Reviews});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  updateSort: function(event) {
    console.log("sort update 0");
    if (event.target.value == "score") {
        this.setState({sort: "score"}, function() {
            console.log(this.state.sort);
            this.loadReviewsFromServer();
        })
    }
    else if (event.target.value == "added") {
        this.setState({sort: "added"}, function() {
            console.log(this.state.sort);
            this.loadReviewsFromServer();
        })
    }
  },
  getInitialState: function() {
    return {
        data: [],
        url_param:this.props.restaurantPk,
        limit: 5,
        offset:0,
        sort:[],
        user:[],

    };
  },
  componentDidMount: function() {
    this.loadUserData();
    this.loadReviewsFromServer();
  },
  render: function() {
    return (
      <div className="ReviewBox">
        <Row className="text-align-center">
            <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                       <h1>Reviews</h1>
            </Col>
        </Row>
        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                       <span>Sort by: <Button value="score" onClick={this.updateSort}>Score</Button> <Button value="added" onClick={this.updateSort}>Date</Button></span>
        </Col>
        <ReviewList user_foodie_id={this.state.user.foodie_id} data={this.state.data} />
        <Row className="text-align-center">
             <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                <ReviewForm restaurant_pk={this.props.restaurantPk} onReviewSubmit={this.handleReviewSubmit} />
            </Col>
        </Row>
      </div>
    );
  }
});

var ReviewList = React.createClass({
  render: function() {
    var reviewNodes = this.props.data.map(function(review) {
      return (
        <Review review_id={review.id} user_foodie_id={this.props.user_foodie_id} subject={review.subject} 
        key={review.id} url={review.url} score={review.score} foodie_pk={review.foodie.id} 
        foodie_name={review.foodie.user.username} added_on={review.added}>
          {review.comment}
        </Review>
      );
    }, this);
    return (
      <Row>
        <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                   {reviewNodes}
        </Col>
      </Row>
    );
  }
});

var ReviewForm = React.createClass({
  componentDidMount: function() {
        this.loadUserData()
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
  getInitialState: function() {
        return {
            user:[],
            foodie:[],
        };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var subject = ReactDOM.findDOMNode(this.refs.subject).value;
    var score = parseFloat(ReactDOM.findDOMNode(this.refs.score).value);
    var restaurant_id = parseInt(this.props.restaurant_pk);
    var comment = ReactDOM.findDOMNode(this.refs.comment).value;
    if (!subject || !score || !restaurant_id  || !comment) {
      return;
    };
    this.props.onReviewSubmit({subject: subject, score: score, restaurant:restaurant_id, comment:comment});
  },
  render: function() {
    return (
        <div>
            <Row className="text-align-center">
                <Col xs={12} md={12}>
                           <h1>Post a Review:</h1>
                </Col>
            </Row>

            <form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <ControlLabel>Subject</ControlLabel>
                    <FormControl type="text" placeholder="Subject" ref="subject" />
                    <ControlLabel>Score (Out of 10)</ControlLabel>
                    <FormControl type="number" placeholder="Score" ref="score" />
                    <ControlLabel>Comment</ControlLabel>
                    <FormControl type="textarea" placeholder="Comment" ref="comment" />
                    <br/>
                    {' '}
                </FormGroup>
                <Button type="submit">Post</Button>
            </form>
        </div>
    );
  }
});

var RestaurantProfile = React.createClass({
  initTripMap: function (lat, lng) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        var isDraggable = $(document).width() > 480 ? true : false; // If document (your website) is wider than 480px, isDraggable = true, else isDraggable = false

        var mapOptions = {
              zoom: 15,
              center: latlng,
        }
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });
  },
  updateAverage: function() {
        $.ajax({
          method: 'GET',
          url: '/api/restaurants/'+this.state.url_param,
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            console.log("updating avg");
            this.setState({average_score:data.avg_review});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
  },
  thumb_down: function() {
      var thumb_data = {"restaurant":parseInt(this.state.url_param),"up_or_down":"down"};
      $.ajax({
      url: '/api/thumbs/',
      dataType: 'json',
      type: 'POST',
      data: thumb_data,
      headers: {
                'Authorization': 'Token ' + localStorage.token
      },
      success: function(data) {
            console.log("thumb submitted");
            let thumb_down = this.state.thumb_downs + 1;
            this.setState({thumb_downs:thumb_down});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("already voted")
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  markVisited: function () {
      var statusValue = {"status":"visited"};
        
      $.ajax({

          url: '/api/restaurants/'+this.state.url_param+'/',

          contentType:'application/json; charset=utf-8',
          dataType: 'json',
          type: 'PATCH',
          data: JSON.stringify(statusValue),

          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            console.log("changing status");
            console.log(data);
            this.setState({data: data});
            this.setState({status:data.status});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error("status update failed to load restaurant");
          }.bind(this)
        });
  },
  loadRestaurantsFromServer: function() {
        $.ajax({
          method: 'GET',
          url: '/api/restaurants/'+this.state.url_param+'/',
          dataType: 'json',
          headers: {
                'Authorization': 'Token ' + localStorage.token
          },
          success: function(data) {
            console.log("r profile load success");
            console.log(data);
            this.setState({data: data});
            this.setState({average_score:data.avg_review});
            this.setState({status:data.status});
            this.initTripMap(parseFloat(data.lat), parseFloat(data.log));
            this.setState({thumb_downs:data.thumb_downs});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error("failed to load restaurant");
          }.bind(this)
        });
      },
      getInitialState: function() {
        return {
            url_param: this.props.params.id,
            data:[],
            average_score: [],
            thumb_downs: [],
            status:"newly added",
        };
      },
      componentWillMount: function() {
        console.log("r profile start");
        this.loadRestaurantsFromServer();
      },


  render() {
    if (this.state.status == "visited") {
      var review_section = <Row >
            <ReviewBox restaurantPk={this.state.url_param} handleAverageScore={this.updateAverage}/>
        </Row>; 
      var visit_button = null;
    } else {
      var review_section = <Row className='text-align-center'>
            <h3>Reviews disabled - Please visit the restaurant first</h3>
        </Row>; 
        var visit_button = null;
        var visit_button = <Button value="mark_visited" onClick={this.markVisited}>mark visited</Button>;
    }
    return (
      <div>
        <div className='component'>
        <div className='app_container'>
        <Row className='text-align-center'>
              <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                   <h1>{this.state.data.name}</h1>
                   
                   <h4>Status: {this.state.data.status}</h4> {visit_button}
              </Col>
        </Row>
        <Row className='text-align-center'>
        <FontAwesome name='thumbs-o-down'/>: {this.state.thumb_downs}<br/>
        <Button value="thumb_down" onClick={this.thumb_down}>Thumb Down</Button>
        </Row>
        <Row className='text-align-center'>
              <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                <span>
                    Review average score: {this.state.average_score}/10
                </span>
                <br/>
                <span>
                    Description: {this.state.data.description}
                </span>
              </Col>
        </Row>
        <Row>
            <Col xs={8} md={6} xsOffset={2} mdOffset={3}>
                <div className ="mapContainer">
                    <div id="map" className="map">
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            {review_section}
        </Row>
        </div>
        </div>
    </div>

    )
  }
});



export default RestaurantProfile;