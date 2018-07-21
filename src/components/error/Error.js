import React, { Component } from 'react';
import global from '../../services/communicate.service';
import { Redirect, NavLink } from 'react-router-dom';

export default class Error extends Component {
    loginSuccess = global.loginSuccess;
    constructor(){
        super();
        this.state = {
            loginSuccess: this.loginSuccess
        }
    }

    render() {
        if (this.state.loginSuccess === false) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <h1>Page Not Found</h1>
                <p><NavLink to="/">click here to main page</NavLink></p>
            </div>
        );
    }
}