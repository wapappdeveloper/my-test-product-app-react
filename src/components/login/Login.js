import React, { Component } from 'react';
import global from '../../services/communicate.service';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {

    loginSuccess = global.loginSuccess;

    hardCodeCredential = {
        username: 'abcd',
        password: '1234'
    }

    credential = {
        username: '',
        password: ''
    }
    constructor() {
        super();
        this.state = {
            credential: this.credential,
            loginSuccess: this.loginSuccess
        }
    }

    checkLogin(credential) {
        if (this.hardCodeCredential.username === credential.username && this.hardCodeCredential.password && credential.password) {
            this.setState({
                loginSuccess: true
            })
            global.loginSuccess = this.loginSuccess = true;
            this.render();
        } else {
            alert('Invalid Credential Please try username=abcd password=1234');
        }
    }

    changeTo(e) {
        let credential = this.state.credential;
        if (e.target.id === 'username') {
            credential.username = e.target.value;
        } else if (e.target.id === 'password') {
            credential.password = e.target.value;
        }
        this.setState({
            credential: credential
        });
    }

    onMouseDown(credential) {
        this.checkLogin(credential);
    }

    render() {
        if (this.state.loginSuccess === true) {
            return <Redirect to='/ilMng' />
        }
        return (
            <div className="login" >
                <div className="left-panel">
                    <div className="content">
                        <div className="title green">Awesome.</div>
                        <div className="middle">Inventory management
              software for growing business.<br />
                            <span className="middle-footer">Increase your sales and track of every unit.</span></div>
                        <div className="footer green">support@awesome.com</div>
                    </div>
                </div>
                <div className="right-panel">
                    <div className="form-container">
                        <div className="login-label">Login</div>
                        <input id="username" type="text" required placeholder="Email" value={this.state.credential.username} onBlur={(e) => this.changeTo(e)} onChange={(e) => this.changeTo(e)} />
                        <input id="password" type="text" required placeholder="Password" value={this.state.credential.password} onBlur={(e) => this.changeTo(e)} onChange={(e) => this.changeTo(e)} />
                        <input type="button" value="Login" readOnly onMouseUp={this.onMouseDown.bind(this, this.credential)} />
                        <input type="text" className="forget-pass" value="Forget password?" readOnly />
                    </div>
                </div>
            </div>
        );
    }
}