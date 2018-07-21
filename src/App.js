import React, { Component } from 'react';
import './App.css';
//import ReactDOM from 'react-dom';
import Todo from './components/todo/Todo';
import DataPersistenceService from './shared/datapersistence.service';

class App extends Component {

  todoListArray = [];
  tempMoveToDoItem = null;
  currentTodoItem = null;
  mouseDownCoordinates = {};
  mouseMoveCoordinates = {};
  tempMoveToDoItemCoordinates = {};

  currentOverTakedToDoItemData = null;
  tempHilightIndex = null;

  storageId = 'todo-data';

  isIpad = navigator.userAgent.match(/iPad/i);
  isNexus = navigator.userAgent.match(/Nexus/i);
  isTouchDevice = 'ontouchstart' in window || (navigator.msMaxTouchPoints > 0);
  isBrowserIE = (window.navigator.userAgent.indexOf('Trident/') === -1) ? false : true;
  isBrowserEdge = navigator.userAgent.toLowerCase().indexOf('edge') > -1;
  isBrowserFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  isDevice = this.isIpad || this.isNexus || this.isTouchDevice;

  constructor() {
    super();
    this.init();
    this.state = {
      todoListArray: this.todoListArray
    }
    this.updateDataToWebStorage();
  }

  init() {
    this.dataPersistenceService = new DataPersistenceService();
    this.appData = this.dataPersistenceService.retriveDataInLocalStorage(this.storageId);
    //console.log(this.appData);
    if (this.appData) {
      this.todoListArray = this.appData;
    } else {
      this.todoListArray = [
        { title: 'Title goes here', content: 'Task Details goes here' }
      ];
    }
  }

  updateDataToWebStorage() {
    this.dataPersistenceService.storeDataInLocalStorage(this.storageId, this.state.todoListArray);
  }

  showCloseToDoModel() {
    var todoInput, todoModel, plusIcon;
    todoInput = document.getElementById('add-todo-holder');
    todoModel = document.getElementById('todo-model');
    plusIcon = document.getElementById('plus-icon');
    if (plusIcon.classList.contains('rotate45')) {
      plusIcon.classList.remove("rotate45");
      plusIcon.classList.add("rotate0");

      todoInput.classList.remove("show-me");
      todoInput.classList.add("hide-me");

      todoModel.classList.remove("show-me");
      todoModel.classList.add("hide-me");
    } else {
      plusIcon.classList.remove("rotate0");
      plusIcon.classList.add("rotate45");

      todoInput.classList.remove("hidden");
      todoInput.classList.remove("hide-me");
      todoInput.classList.add("show-me");

      todoModel.classList.remove("hidden");
      todoModel.classList.remove("hide-me");
      todoModel.classList.add("show-me");
    }
  }

  clearFocussedInput() {
    document.getElementById('todo-title').innerHTML = '';
    document.getElementById('todo-content').innerHTML = '';
  }

  getClientCoordinatesFromEvent(event) {
    var clientX = null;
    var clientY = null;
    var clientIs = null;
    if (event && (event.clientX || event.clientX === 0) && (event.clientY || event.clientY === 0)) {
      clientX = event.clientX;
      clientY = event.clientY;
      clientIs = 'event';
    } else if (event && event.touches && event.touches[0] && event.touches[0].clientX && event.touches[0].clientY) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
      clientIs = 'event.touches[0]';
    } else if (event && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0] && event.originalEvent.touches[0].clientX && event.originalEvent.touches[0].clientY) {
      clientX = event.originalEvent.touches[0].clientX;
      clientY = event.originalEvent.touches[0].clientY;
      clientIs = 'event.originalEvent.touches[0]';
    } else if (event && event.targetTouches && event.targetTouches[0] && event.targetTouches[0].clientX && event.targetTouches[0].clientY) {
      clientX = event.targetTouches[0].clientX;
      clientY = event.targetTouches[0].clientY;
      clientIs = 'event.targetTouches[0]';
    } else {
      console.error('client coordinates not able to retrive from event =', event);
    }
    return { clientX: clientX, clientY: clientY, clientIs: clientIs };
  }

  edit(elm, id) {
    var elements, title, content, i;
    elements = document.getElementById(id).childNodes;
    if (elm.classList.contains('edit-btn')) {
      elm.classList.remove('edit-btn');
      elm.classList.add('add-btn');
      for (i = 0; i < elements.length; i++) {
        let elm = elements[i];
        //console.log(elm);
        if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-title')) {
          //console.log('AA');
          elm.setAttribute('contentEditable', 'true');
        }
        if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-content')) {
          //console.log('BB');
          elm.setAttribute('contentEditable', 'true');
        }
      }
    } else {
      elm.classList.remove('add-btn');
      elm.classList.add('edit-btn');
      title = null;
      content = null;
      for (i = 0; i < elements.length; i++) {
        let elm = elements[i];
        if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-title')) {
          elm.setAttribute('contentEditable', 'false');
          title = elm.innerHTML;
          //console.log(title);
        }
        if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-content')) {
          elm.setAttribute('contentEditable', 'false');
          content = elm.innerHTML;
          //console.log(content);
        }
      }
      if (title !== null && content !== null) {
        let todoListArray = this.state.todoListArray;
        todoListArray[Number(id)].title = title;
        todoListArray[Number(id)].content = content;
        this.render();
        this.componentDidMount();
        this.updateDataToWebStorage();
      }
    }
  }

  removeToDoTask(id) {
    //console.log(id);
    let todoListArray = this.state.todoListArray;
    todoListArray.splice(Number(id), 1);
    this.setState({
      todoListArray: todoListArray
    });
    this.render();
    this.updateDataToWebStorage();
  }

  swapToDoItemsData(currentOvertakeToDoItemData, currentMovingToDoItemData, todoListArray) {
    var indexOfOvertake = null;
    var indexOfMoving = null;
    todoListArray.map((elm, index) => {
      //console.log(elm, currentOvertakeToDoItemData, currentMovingToDoItemData);
      if (currentOvertakeToDoItemData.id === elm.id) {
        indexOfOvertake = index;
      }
      if (currentMovingToDoItemData.id === elm.id) {
        indexOfMoving = index;
      }
      return true;
    });
    //console.log(indexOfOvertake, indexOfMoving);
    if (indexOfOvertake !== indexOfMoving) {
      document.getElementById(indexOfMoving).style.backgroundColor = '#FFF';
      let top = currentMovingToDoItemData.top;
      let left = currentMovingToDoItemData.left;
      currentMovingToDoItemData.top = currentOvertakeToDoItemData.top;
      currentMovingToDoItemData.left = currentOvertakeToDoItemData.left;
      currentOvertakeToDoItemData.top = top;
      currentOvertakeToDoItemData.left = left;
      todoListArray[indexOfOvertake] = currentMovingToDoItemData;
      todoListArray[indexOfMoving] = currentOvertakeToDoItemData;
    }
    return { todoListArray: todoListArray, indexOfOvertake: indexOfOvertake };
  }

  mousedown(event) {
    var id, elementClientRect, coordinates, element;
    //console.log(event);
    if (event.target.classList.contains('move-btn')) {
      //console.log('A');
      id = event.currentTarget.id;
      coordinates = this.getClientCoordinatesFromEvent(event);
      this.tempMoveToDoItem = document.getElementById('todo-list-holder-temp-move');
      this.currentTodoItem = document.getElementById(id);
      this.currentTodoItem.style.backgroundColor = '#FF0';
      elementClientRect = this.currentTodoItem.getBoundingClientRect();
      this.tempMoveToDoItemCoordinates = { mouseX: elementClientRect.left, mouseY: elementClientRect.top, width: elementClientRect.width, height: elementClientRect.height }
      this.mouseDownCoordinates.mouseX = Math.round(coordinates.clientX);
      this.mouseDownCoordinates.mouseY = Math.round(coordinates.clientY);
      let todoListArray = this.state.todoListArray;
      this.currentMoveToDoItemData = todoListArray[Number(id)];
      document.getElementById("move-temp-title").innerHTML = this.currentMoveToDoItemData.title;
      document.getElementById("move-temp-content").innerHTML = this.currentMoveToDoItemData.content;
      if (document.getElementById(id).querySelectorAll('.btn')[2].classList.contains('edit-btn')) {
        this.tempMoveToDoItem.querySelectorAll('.btn')[2].classList.remove('add-btn');
        this.tempMoveToDoItem.querySelectorAll('.btn')[2].classList.add('edit-btn');
      } else {
        this.tempMoveToDoItem.querySelectorAll('.btn')[2].classList.remove('edit-btn');
        this.tempMoveToDoItem.querySelectorAll('.btn')[2].classList.add('add-btn');
      }
      this.tempMoveToDoItem.setAttribute('style', 'position:fixed;top:' + this.tempMoveToDoItemCoordinates.mouseY + 'px;left:' + this.tempMoveToDoItemCoordinates.mouseX + 'px;max-width:' + this.tempMoveToDoItemCoordinates.width + 'px;background-color:lightgrey;opacity:0.6;display:block');
      if (this.isDevice) {
        document.addEventListener('touchmove', this.mousemove.bind(this));
        document.addEventListener('touchend', this.mouseup.bind(this));
      } else {
        document.addEventListener('mousemove', this.mousemove.bind(this));
        document.addEventListener('mouseup', this.mouseup.bind(this));
      }
    } else if (event.target.classList.contains('delete-btn')) {
      //console.log('B');
      id = event.currentTarget.id;
      this.removeToDoTask(id);
      this.componentDidMount();
    } else if (event.target.classList.contains('edit-btn') || event.target.classList.contains('add-btn')) {
      //console.log('C');
      id = event.currentTarget.id;
      element = event.target;
      this.edit(element, id);
    }
  }

  mousemove(event) {
    var newMouseX, newMouseY, newTempToDoElmX, newTempToDoElmY;
    if (this.tempMoveToDoItem) {
      //event.preventDefault();
      var coordinates = this.getClientCoordinatesFromEvent(event);
      this.mouseMoveCoordinates.mouseX = Math.round(coordinates.clientX);
      this.mouseMoveCoordinates.mouseY = Math.round(coordinates.clientY);

      newMouseX = this.mouseMoveCoordinates.mouseX - this.mouseDownCoordinates.mouseX;
      newMouseY = this.mouseMoveCoordinates.mouseY - this.mouseDownCoordinates.mouseY;

      newTempToDoElmX = this.tempMoveToDoItemCoordinates.mouseX + newMouseX;
      newTempToDoElmY = this.tempMoveToDoItemCoordinates.mouseY + newMouseY;

      //console.log(newMouseX, newMouseY, newTempToDoElmX, newTempToDoElmY);
      this.tempMoveToDoItem.style.left = newTempToDoElmX + 'px';
      this.tempMoveToDoItem.style.top = newTempToDoElmY + 'px';
      let todoListArray = this.state.todoListArray;
      todoListArray.map(elm => {
        //console.log(elm.left, elm.top, newMouseX, newMouseY);
        if (newTempToDoElmY === elm.top || (newTempToDoElmY < elm.top + 35 && newTempToDoElmY > elm.top - 30)) {
          if (this.currentOverTakedToDoItemData !== elm) {
            this.currentOverTakedToDoItemData = elm;
            var obj = this.swapToDoItemsData(elm, this.currentMoveToDoItemData, todoListArray);
            todoListArray = obj.todoListArray;
            var indexToHilight = obj.indexOfOvertake;
            this.setState({
              todoListArray: todoListArray
            });
            this.render();
            this.tempHilightIndex = indexToHilight;
            document.getElementById(indexToHilight).style.backgroundColor = '#FF0';
          }
        }
        return true;
      });
    }
  }

  mouseup(event) {
    if (this.tempMoveToDoItem && this.currentTodoItem) {
      event.preventDefault();
      this.tempMoveToDoItem.setAttribute('style', 'position:fixed;top:0px;left:0px;max-width:370px;background-color:lightgrey;opacity:0;display:none');
      if (document.getElementById(this.tempHilightIndex)) {
        document.getElementById(this.tempHilightIndex).style.backgroundColor = '#FFF';
      } else {
        var elmList = document.getElementsByClassName('todo-list-holder');
        if (elmList) {
          for (var i = 0; i < elmList.length; i++) {
            elmList[i].style.backgroundColor = '#FFF';
          }
        }
      }
      if (this.isDevice) {
        document.removeEventListener('touchmove', this.mousemove);
      } else {
        document.removeEventListener('mousemove', this.mousemove);
      }
      this.tempMoveToDoItem = this.currentTodoItem = this.tempHilightIndex = null;
      this.updateDataToWebStorage();
    }
  }

  addToDoTask() {
    var todoTitleElm = document.getElementById('todo-title');
    var todoContentElm = document.getElementById('todo-content');
    var todoTitleText = todoTitleElm.innerHTML;
    var todoContentText = todoContentElm.innerHTML;
    if (todoTitleText.trim() === '' || todoContentText.trim() === '') {
      alert('some fields or empty');
      return;
    }
    let todoListArray = this.state.todoListArray;
    todoListArray.push({ title: todoTitleText, content: todoContentText });
    this.setState({
      todoListArray: todoListArray
    });
    this.render();
    this.showCloseToDoModel();
    todoTitleElm.innerHTML = '';
    todoContentElm.innerHTML = '';
    setTimeout(() => {
      this.updatePositions();
      return true;
    }, 1000);
  }

  updatePositions() {
    let todoListArray = this.state.todoListArray;
    todoListArray.map((elm, index) => {
      let todoItemCooredintes = document.getElementById(index).getBoundingClientRect();
      elm.top = todoItemCooredintes.top;
      elm.left = todoItemCooredintes.left;
      elm.id = index;
      return true;
    });
    this.setState({
      todoListArray: todoListArray
    });
    this.updateDataToWebStorage();
  }

  componentDidMount() {
    if (this.isDevice) {
      document.getElementById('todo-list-container').classList.add('remove-scrollgap');
    }
    let todoListArray = this.state.todoListArray;
    todoListArray.map((elm, index) => {
      let todoItemCooredintes = document.getElementById(index).getBoundingClientRect();
      elm.top = todoItemCooredintes.top;
      elm.left = todoItemCooredintes.left;
      elm.id = index;
      return true;
    });
    this.setState({
      todoListArray: todoListArray
    });
    this.render();
    this.updateDataToWebStorage();
    console.log('React TODO APP Ready');
  }

  render() {
    return (<div className="container">
      <div className="holder">
        <div className="bg-plain">
          <div className="bg-triangle"></div>
        </div>
        <div className="wrapper">
          <div className="comp-container">
            <header>
              <div className="title">To-Do APP</div>
              <div className="add no-selection" onClick={this.showCloseToDoModel.bind(this)}>
                <span id="plus-icon" className="">+</span>
              </div>
            </header>

            <main className="hide-scroll">
              <div className="todo-list-container" id="todo-list-container">
                {this.state.todoListArray.map((todoItem, index) => {
                  return (<Todo id={index} key={index} todoItem={todoItem} onMouseDown={this.mousedown.bind(this)} />);
                })}
              </div>
            </main>

            <main className="todo-model hidden" id="todo-model">
              <div className="todo-input-model">
                <div className="todo-input-holder hidden" id="add-todo-holder">
                  <div className="title-label">Title:</div>
                  <div className="todo-input-title" contentEditable="true" id="todo-title" ></div>
                  <div className="todo-input-content" contentEditable="true" id="todo-content"></div>
                  <div className="btn-holder no-selection">
                    <div className="btn-align-right">
                      <div className="btn clear-btn no-selection" id="clear" onClick={this.clearFocussedInput.bind(this)}></div>
                      <div className="btn delete-btn no-selection" id="delete" onClick={this.showCloseToDoModel.bind(this)}></div>
                      <div className="btn add-btn no-selection" id="add" onClick={this.addToDoTask.bind(this)}></div>
                    </div>
                  </div>
                  <div className="clear"></div>
                </div>
              </div>
            </main>

            <div className="todo-list-holder temp hidden" id="todo-list-holder-temp-move">
              <div className="btn-holder no-selection">
                <div className="btn-align-right">
                  <div className="btn move-btn no-selection"></div>
                  <div className="btn delete-btn no-selection"></div>
                  <div className="btn edit-btn no-selection"></div>
                  <div className="clear"></div>
                </div>
              </div>
              <div className="title-label">Title:</div>
              <div className="todo-input-title" id="move-temp-title"></div>
              <div className="todo-input-content listed" id="move-temp-content"></div>
              <div className="clear"></div>
            </div>

          </div>
        </div>
      </div>
    </div >);
  }
}

export default App;
