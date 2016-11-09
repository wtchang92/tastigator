var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router')

import authenticationPage from './authentication/authentication.jsx';
var auth = require('./authentication/auth.js')


import App from './app.jsx';
import Dashboard from './dashboard.jsx';
import Restaurants from './restaurants/restaurants.jsx';
import Restaurant from './restaurants/restaurant_profile.jsx';
import RestaurantAdd from './restaurants/add_restaurant.jsx'
import Foodie from './foodies/foodie_profile.jsx';
import FoodieEdit from './foodies/edit_foodie_profile.jsx';

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname:'/app/login/',
            state: {nextPathname: '/app/'}
        })
    }
}


ReactDOM.render(
        <Router.Router history={ Router.browserHistory }>
            <Router.Route path='/app/' onEnter={requireAuth} component={App}>
                    <Router.IndexRoute component={Dashboard}/>
                    <Router.Route path='home' component={Dashboard}/>
                    <Router.Route path='foodie/:id' component={Foodie}/>
                    <Router.Route path='edit_profile' component={FoodieEdit}/>
                    <Router.Route path='restaurants' component={Restaurants}/>
                    <Router.Route path='add_restaurant' component={RestaurantAdd}/>
                    <Router.Route path="restaurant/:id" component={Restaurant}/>
            </Router.Route>
            <Router.Route path='/app/login/' component={authenticationPage} />
        </Router.Router>,
    document.getElementById('app')
)
