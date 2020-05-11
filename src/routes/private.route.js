import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
    if (rest.isAdmin === undefined) {
        return (
            <Route
                {...rest}
                render={(props) => rest.isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
            />
        )
    } else {
        return (
            <Route
                {...rest}
                render={(props) => rest.isAuthenticated && rest.isAdmin ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
            />
        )
    }

}

export default PrivateRoute;