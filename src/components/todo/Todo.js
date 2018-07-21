import React, {Component} from 'react'

export default class Todo extends Component {

    render(){
        let {id, todoItem, onMouseDown} = this.props;
        return(
            <div className="todo-list-holder real" id={id} onMouseDown={onMouseDown.bind(this)} onTouchStart={onMouseDown.bind(this)}>
                <div className="btn-holder no-selection" >
                    <div className="btn-align-right" >
                        <div className="btn move-btn no-selection"></div>
                        <div className="btn delete-btn no-selection"></div>
                        <div className="btn edit-btn no-selection"></div>
                        <div className="clear"></div>
                    </div>
                </div>
                <div className="title-label" >Title:</div>
                <div className="todo-input-title" dangerouslySetInnerHTML={{ __html: todoItem.title }} />
                <div className="todo-input-content listed" dangerouslySetInnerHTML={{ __html: todoItem.content }} />
                <div className="clear"></div>
            </div>
        );
    }
}