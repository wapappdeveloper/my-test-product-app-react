import React, { Component } from 'react';
import List from '../../components/list/List';
import global from '../../services/communicate.service';
import { NavLink, Redirect } from 'react-router-dom';

export default class InlineManagement extends Component {
    listData = global.listData;
    loginSuccess = global.loginSuccess;

    constructor() {
        super();
        this.state = {
            listData: this.listData,
            loginSuccess: this.loginSuccess
        }
    }

    onMouseDown(id, type, edit) {
        if (type === 'delete') {
            let listData = this.state.listData;
            listData.splice(Number(id), 1);
            this.setState({
                listData: listData
            });
            this.render();
        } else if (type === 'change' && edit === false) {
            let listData = this.state.listData;
            listData[Number(id)].edit = true;
            this.setState({
                listData: listData
            });
            this.render();
        } else if (type === 'change' && edit === true) {
            var elements = document.getElementById(id).childNodes;
            var obj = { code: '', product: '', stock: '', expiry: '', edit: false };
            for (var i = 0; i < elements.length; i++) {
                if (i >= 1 && i <= 4) {
                    var field = elements[i].getAttribute('field');
                    obj[String(field)] = elements[i].innerHTML;
                }
            }
            let listData = this.state.listData;
            listData[Number(id)] = obj;
            this.setState({
                listData: listData
            });
            this.render();
        } else {
            console.warn('unknown type');
        }
    }
    render() {
        if (this.state.loginSuccess === false) {
            return <Redirect to='/' />
        }
        return (
            <div className="list-page">
                <div className="top-panel">Awesome.
            <div className="profile-pic"></div>
                </div>
                <div className="main-panel">
                    <div className="inventory-text">Inventory management</div>
                    <div className="dashboard-text">Dashboard > Inventary</div>

                    <div className="add-product"><NavLink to="/Form">Add product</NavLink></div>

                    <div className="list-table">
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        <div className="box"></div>
                                    </th>
                                    <th>Code</th>
                                    <th>Product</th>
                                    <th>Stock</th>
                                    <th>Expiry date</th>
                                    <th>Actions</th>
                                </tr>
                                {this.state.listData.map((listItem, index) => {
                                    return (<List id={index} key={index} listItem={listItem} onMouseDown={this.onMouseDown.bind(this)} />);
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="button-holder">
                        <div className="prod-delete">
                            <div className="bg-color-red"></div>
                            <div className="prod-delete-text">Product Deleted</div>
                            <div className="prod-delete-close">x</div>
                        </div>

                        <div className="prod-updated">
                            <div className="bg-color-green"></div>
                            <div className="prod-updated-text">Product updated</div>
                            <div className="prod-updated-close">x</div>
                        </div>

                        <div className="prod-added">
                            <div className="bg-color-green"></div>
                            <div className="prod-added-text">New product added</div>
                            <div className="prod-added-close">x</div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}