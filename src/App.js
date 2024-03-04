import './App.css';
import React from 'react';
import { useState, useEffect } from 'react'; // use state HOOK
import { v4 as uuidv4 } from 'uuid';

// interface IListItem {
//     id: String,
//     value: String,
//     isDone: Boolean
// }

const initList = [];

const today = new Date();
const currentDay = String(today.getDate());
const currentMonth = today.toLocaleString(
    'default', { month: 'long' }
);
const currentYear = today.getFullYear();

const App = () => {
    const [input, setInput] = useState('');
    const [storedList, updateStoredList] = useState('');
    const [list, setList] = useState(initList);
    const [selectedTheme, setTheme] = useState('');

    useEffect(() => {
        const data = window.localStorage.getItem('TOO_DOO_LIST');
        if (data !== null) setList(JSON.parse(data));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('TOO_DOO_LIST', JSON.stringify(list));
    }, [list]);

    function handleInputChange(event) {
        setInput(event.target.value);
    }

    function handleAdd() {
        if (input !== '') {
            const newItem = { id: uuidv4(), value: input, isDone: false };
            console.log("new item", newItem)
            setList(...list, newItem);
            console.log("new list", list)
            setInput('');
        }
    }

    function handleDelete(id) {
        const newList = list.filter((item) => item.id !== id);
        setList(newList);
    }

    function handleCheckboxChange(listItem) {
        setList(list.map(item => {
            if (item.id === item.id) {
                item.isDone = !item.isDone;
            }
        }))
    }

    function handleUpdateInputChange(event) {
        updateStoredList(event.target.value);
    }

    function handleItemUpdate(listItem) {
        setList(list.map(item => {
            if (listItem.id === item.id) {
                item.value = listItem.value;
            }
            return item;
        }))
    }

    return (
        <div className="App">
            <section id="header">
                <div>{currentMonth} {currentDay} {currentYear}</div>
                <button onClick={() => (window.close())}>x</button>
            </section>

            <div id="top">

            </div>
            <div id="body">
                <div id="left">
                    <section className="toodoo">
                        <AddItem
                            name={input}
                            onChange={handleInputChange}
                            onAdd={handleAdd}
                        />
                        {list.filter((li) => !li.isDone).map((item) => {
                            <ListItem
                                item={item}
                                onDelete={handleDelete}
                                onChange={handleUpdateInputChange}
                                onCheckboxChange={handleCheckboxChange}
                                onItemUpdate={handleItemUpdate}
                            />
                        })}
                    </section>
                    <div id="middle"></div>
                    <section className="toodoo">
                        {list.filter((li) => li.isDone).map((item) => {
                            <ListItem
                                item={item}
                                onDelete={handleDelete}
                                onChange={handleUpdateInputChange}
                                onCheckboxChange={handleCheckboxChange}
                                onItemUpdate={handleItemUpdate}
                            />
                        })}
                    </section>
                </div>
                <div id="right">

                </div>
            </div>


            <section id="footer">
                <div id="themes">
                    <button>
                        -
                    </button>
                    <button>
                        -
                    </button>
                    <button>
                        -
                    </button>
                </div>
                <a href="#" target='blank'>github</a>
            </section>
        </div>
    )
};

const AddItem = ({ item, onChange, onAdd }) => (
    <div>
        <input
            id="add-item"
            type="text"
            value={item}
            onChange={onChange}
            placeholder="it&rsquo;s a good day toodoo something"
            autoComplete="off"
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    onAdd(item);
                }
            }}
        />
        <button type="button" onClick={() => onAdd(item)}>+</button>
    </div >
);

const ListItem = ({ item, onDelete, onCheckboxChange, onChange, onItemUpdate }) => (
    <li key={item.id}>
        <label className="item-checkbox">
            <input
                type="checkbox"
                id={item.id}
                checked={item.isDone}
                // name={item.value}
                onChange={() => onCheckboxChange(item)}
            />
            <span className="custom-check"></span>
        </label>

        <input
            id={item.id + item.value}
            type="text"
            value={item}
            onChange={onChange}
            autoComplete="off"
        />
        <button id="delete-btn" onClick={() => onDelete(item.id)}>x</button>
    </li>);

export default App;
