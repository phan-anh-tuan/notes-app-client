import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import Signup from './containers/Signup'
import AppliedRoute from './components/AppliedRoute'

export default ({ childProps }) => {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} props={childProps}/>
            <AppliedRoute path="/login" exact component={Login} props={childProps}/>
            <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
            <Route component={NotFound}/>
        </Switch>
    )
}