import './App.css';
import React from 'react';
import { useState, useEffect } from 'react'; // use state HOOK
import { v4 as uuidv4 } from 'uuid';

const initList = [];
//const doneCount = 0;

const App = () => {
  const [name, setName] = useState('');
  const[item, updateItem] = useState('');
  const [list, setList] = useState(initList);

  useEffect(() => {
    const data = window.localStorage.getItem('TOO_DOO_LIST');
    if (data !== null) setList(JSON.parse(data));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('TOO_DOO_LIST', JSON.stringify(list));
  }, [list]);

  const today = new Date();
  const currentDay = String(today.getDate());
  const currentMonth = today.toLocaleString(
    'default', { month: 'long' }
  );
  const currentYear = today.getFullYear();

  function handleInputChange(event) {
    // track input field's state
    setName(event.target.value);
  }

  function handleAdd(name) {
    // check list item is not empty, then add
    if (name !== '') {
      const newList = list.concat({ name, id: uuidv4(), isCompleted: false });
      setList(newList);

      setName('');
    }
  }


  function handleDelete(id) {
    // delete item
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  }

  function handleCheckboxChange(item) {
    setList(list.map(data => {
      if (item.id === data.id) {
        data.isCompleted = !data.isCompleted;
      }
      return data;
    }))
  }

  function handleUpdateInputChange(event) {
    // track input field's state
    console.log(event.target.value);
    updateItem(event.target.value);
  }

  function handleItemUpdate(item) {
    // update item
    setList(list.map(data => {
      if (item.id === data.id) {
        data.name = item.name;
      }
      return data;
    }))
  }

  return (
    <div className="App">
      <div className="Header">
        <p id="date">{currentMonth} {currentDay} - {currentYear}</p>
        <div id="hdr-btns">
          <button id="close-window" onClick={() => (window.close())}>x</button>
          <a href="https://github.com/piperbacker" target="_blank" rel="noreferrer">
            <button id="gthb">g</button>
          </a>
        </div>
      </div>

      <div className="Body">
        <div id="lists">
          <List title={"To Do:"}
            list={list}
            condition={false} //isCompleted = false
            onDelete={handleDelete}
            onChange={handleUpdateInputChange}
            onCheckboxChange={handleCheckboxChange}
            onItemUpdate={handleItemUpdate}
          />
          <AddItem
            name={name}
            onChange={handleInputChange}
            onAdd={handleAdd}
          />

          <List title={"Completed:"}
            list={list}
            condition={true}  //isCompleted = true
            onDelete={handleDelete}
            onCheckboxChange={handleCheckboxChange}
            onItemUpdate={handleItemUpdate}
          />
        </div>
      </div>

      <div className="Footer">
      </div>
    </div>
  );
};

const AddItem = ({ name, onChange, onAdd }) => (
  <div>
    <input id="add-item"
      type="text"
      value={name}
      onChange={onChange}
      placeholder='today is a good day toodoo something'
      autoComplete="off"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onAdd(name);
        }
      }} />
    <button type="button" id="add-btn" onClick={() => onAdd(name)}>
      +
    </button>
  </div >
);

const List = ({ title, list, condition, onDelete, onCheckboxChange, onChange, onItemUpdate }) => (
  <>
    <h2>{title}</h2>
    <ul>{list.map((item) => (
      (item.isCompleted === condition) ?
        (<li key={item.id}>
          <label className="item-checkbox">
            <input
              type="checkbox"
              id={item.id}
              checked={item.isCompleted}
              name={item.name}
              onChange={() => onCheckboxChange(item)}
            />
            <span className="custom-check"></span>
          </label>
          <input type="text"
            className="listItem"
            value={item.name}
            onChange={onChange}
            autoComplete="off"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onItemUpdate(item);
              }
            }} />
          <button id="delete-btn" onClick={() => onDelete(item.id)}>
            x
          </button>
        </li>) : null
    ))
    } </ul></>
);

export default App;
