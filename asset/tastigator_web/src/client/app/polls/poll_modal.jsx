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

var PollPage= React.createClass({
      contextTypes: {
        router: React.PropTypes.object.isRequired
      },
      goAddPoll: function() {
            this.context.router.push('/app/add_poll/');
      },
      componentDidMount: function() {
          console.log("loading recent polls");
      },
      render: function() {
        return (
            <div>
              <div className='component'>
                  <Row>
                      <Col xs={12} md={12}>
                          <PollList data={this.props.polls}/>       
                      </Col>
                  </Row>
                  </div>           
            </div>
        )
      }
});


var Poll = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired
      },
  goToPoll: function() {
        this.context.router.push('/app/poll/'+String(this.props.poll_id));
  },
  render: function() {
    return (
      <div className="recent_poll">
        <Row>
          <a onClick={this.goToPoll}><h2>{this.props.title}</h2></a>
          <span>Created by: {this.props.creator.username}</span><br/>
          <span>Added on: {this.props.added}</span>
          <p>Description: {this.props.children}</p>
        </Row>
      </div>
    );
  }
});

var PollList = React.createClass({
  render: function() {
    var PollNodes = this.props.data.map(function(poll) {
      return (
        <Poll poll_id={poll.id} creator={poll.creator.user} title={poll.title} added={poll.added}>
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


var PollsModal = React.createClass({
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
          Recent Polls
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Recent Polls</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <PollPage polls={this.props.polls} close={this.close}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = PollsModal;