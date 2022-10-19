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
      <h4>{currentMonth} {currentDay}</h4>

      <h2>To Do:</h2>
      <List list={list}
        setList={setList}
        condition={false}
        onDelete={handleDelete}
      />
      <AddItem
        name={name}
        onChange={handleInputChange}
        onAdd={handleAdd}
      />

      <h2>Completed:</h2>
      <List list={list}
        setList={setList}
        condition={true}
        onDelete={handleDelete}
      />
    </div>
  );
};

const AddItem = ({ name, onChange, onAdd }) => (
  <div>
    <input type="text" value={name} onChange={onChange} />
    <button type="button" onClick={onAdd}>
      +
    </button>
  </div>
);

const List = ({ list, setList, condition, onDelete }) => (
  (<ul>{list.map((item) => (
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
        <button onClick={() => onDelete(item.id)}>
          x
        </button>
      </li>) : null
  ))
  } </ul>)
);

export default App;
