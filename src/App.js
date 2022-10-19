import './App.css';
import React from 'react';
import { useState, useEffect } from 'react'; // use state HOOK
import { v4 as uuidv4 } from 'uuid';

const initList = [];

const App = () => {
  const [list, setList] = useState(initList);
  const [name, setName] = useState('');

  const today = new Date();
  const currentDay = String(today.getDate()).padStart(2, '0');
  const currentMonth = today.toLocaleString(
    'default', { month: 'long' }
  );
  const currentYear = today.getFullYear();

  function handleInputChange(event) {
    // track input field's state
    setName(event.target.value);
  }

  function handleAdd() {
    // add item
    const newList = list.concat({ name, id: uuidv4(), isCompleted: false });

    setList(newList);
    setName('');
  }

  function handleDelete(id) {
    // delete item
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
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

      <div className="body">
        <div id="lists">
          <List title={"To Do:"}
            list={list}
            setList={setList}
            condition={false} //isCompleted = false
            onDelete={handleDelete}
          />
          <AddItem
            name={name}
            onChange={handleInputChange}
            onAdd={handleAdd}
          />

          <List title={"Completed:"}
            list={list}
            setList={setList}
            condition={true}  //isCompleted = false
            onDelete={handleDelete}
          />
        </div>
      </div>

      <div class="Footer">
      </div>
    </div>
  );
};

const AddItem = ({ name, onChange, onAdd }) => (
  <div>
    <input id="add-item" type="text" value={name} onChange={onChange} />
    <button type="button" id="add-btn" onClick={onAdd}>
      +
    </button>
  </div>
);

const List = ({ title, list, setList, condition, onDelete }) => (
  <>
    <h2>{title}</h2>
    <ul>{list.map((item) => (
      (item.isCompleted == condition) ?
        (<li key={item.id}>
          <input
            type="checkbox"
            id={item.id}
            checked={item.isCompleted}
            name={item.name}
            onChange={e => {
              setList(list.map(data => {
                if (item.id === data.id) {
                  data.isCompleted = !data.isCompleted;
                }
                return data;
              })
              );
            }}
            className="form-check-input"
          />
          {item.name}
          <button id="delete-btn" onClick={() => onDelete(item.id)}>
            x
          </button>
        </li>) : null
    ))
    } </ul></>
);

export default App;
