import React, { Component } from 'react'

export default class List extends Component {

    render() {
        let { id, listItem, onMouseDown } = this.props;
        return (
            <tr id={id} className={listItem.edit?'selected':''}>
                <td>
                    <div className={(Number(listItem.stock) <= 10) ? 'box bg-red' : (Number(listItem.stock) <= 30) ? 'box bg-orange' : 'box bg-green'}></div>
                </td>
                <td contentEditable={listItem.edit} className={(Number(listItem.stock) <= 10) ? 'text-red' : (Number(listItem.stock) <= 30) ? 'text-normal' : 'text-normal'} field="code" >{listItem.code}</td>
                <td contentEditable={listItem.edit} className={(Number(listItem.stock) <= 10) ? 'text-red' : (Number(listItem.stock) <= 30) ? 'text-normal' : 'text-normal'} field="product" >{listItem.product}</td>
                <td contentEditable={listItem.edit} className={(Number(listItem.stock) <= 10) ? 'text-red' : (Number(listItem.stock) <= 30) ? 'text-normal' : 'text-normal'} field="stock" >{listItem.stock}</td>
                <td contentEditable={listItem.edit} field="expiry" >{listItem.expiry}</td>
                <td className={listItem.edit ? 'text-green-bold pointer disable-selection' : 'text-green pointer disable-selection'} onMouseDown={onMouseDown.bind(this, id, 'change', listItem.edit)}>{listItem.edit ? 'Save' : 'Change'}</td>
                <td className="text-red pointer disable-selection" onMouseDown={onMouseDown.bind(this, id, 'delete')}>Delete</td>
            </tr>
        );
    }
}