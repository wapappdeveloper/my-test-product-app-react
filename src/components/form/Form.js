import React, { Component } from 'react';
import global from '../../services/communicate.service';
import { NavLink, Redirect } from 'react-router-dom';

export default class Form extends Component {
    listData = global.listData;
    loginSuccess = global.loginSuccess;
    newItem = { code: '', product: '', stock: '', expiry: '', edit: false };

    constructor() {
        super();
        this.state = {
            listData: this.listData,
            newItem: this.newItem,
            loginSuccess: this.loginSuccess
        }
    }

    checkEmpty(data) {
        if (data.trim() === '') {
            alert('Some fields are empty');
            return;
        } else {
            return data.trim();
        }
    }

    changeTo(e) {
        let newItem = this.state.newItem;
        if (e.target.id === 'product') {
            newItem.product = e.target.value;
        } else if (e.target.id === 'code') {
            newItem.code = e.target.value;
        } else if (e.target.id === 'stock') {
            newItem.stock = e.target.value;
        } else if (e.target.id === 'expiry') {
            newItem.expiry = e.target.value;
        } else {
            console.warn('unknown');
            return;
        }
        this.setState({
            newItem: newItem
        });

    }

    onMouseDown(mode) {
        if (mode === 'add') {
            var newItem = this.state.newItem;
            for (var x in newItem) {
                if (newItem[x] === '') {
                    alert('Some fields are empty');
                    return;
                }
            }
            let listData = this.state.listData;
            listData.push(newItem);
            this.setState({
                listData: listData
            });
            global.listData = this.state.listData;
            var newItem = { code: '', product: '', stock: '', expiry: '', edit: false };
            this.setState({
                newItem: newItem
            });
            this.render();
        } else {
            var newItem = { code: '', product: '', stock: '', expiry: '', edit: false };
            this.setState({
                newItem: newItem
            });
            this.render();
        }
    }

    render() {
        if (this.state.loginSuccess === false) {
            return <Redirect to='/' />
        }
        return (
            <div className="add-product-page" >
                <div className="top-panel">Awesome.
            <div className="profile-pic"></div>
                </div>
                <div className="main-panel">
                    <div className="inventory-text">Inventory management</div>
                    <div className="dashboard-text">Dashboard > <NavLink to="/ilMng"><span className="dashboard-text">Inventary</span></NavLink> > Add new</div>
                    <div className="main-form-panel">
                        <div className="form-add-product">
                            <div className="login-label">Basic</div>
                            <input type="text" id="product" required placeholder="Product Name" value={this.state.newItem.product} onBlur={(e) => this.changeTo(e)} onChange={(e) => this.changeTo(e)} />
                            <input type="text" id="code" required placeholder="Product Code" value={this.state.newItem.code} onBlur={(e) => this.changeTo(e)} onChange={(e) => this.changeTo(e)} />
                            <div className="gap"></div>
                            <div className="login-label">Inventory</div>
                            <input type="text" id="stock" required placeholder="Quantity(Numbers)" className="quality" value={this.state.newItem.stock} onBlur={(e) => this.changeTo(e)} onChange={(e) => this.changeTo(e)} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="text" id="expiry" required placeholder="Expiry date" className="date" value={this.state.newItem.expiry} onBlur={(e) => this.changeTo(e)} onChange={(e) => this.changeTo(e)} />
                            <div className="btn-add" onMouseDown={this.onMouseDown.bind(this, 'add')} ><NavLink to="/ilMng">Add product</NavLink></div>&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="btn-cancel" onMouseDown={this.onMouseDown.bind(this, 'cancel')} ><NavLink to="/ilMng"><span style={{ color: 'black' }}>Cancel</span></NavLink></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}