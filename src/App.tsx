import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

interface ListItem {
  id: string;
  value: string;
  isDone: boolean;
}

interface AddItemProps {
  onAdd: (value: string) => void;
}
interface ListEntryProps {
  entry: ListItem;
  onUpdate: (value: ListItem) => void;
}

const initList: ListItem[] = [];
function App() {
  //const [item, setItem] = useState<string>("");
  const [list, setList] = useState<ListItem[]>(initList);

  const today = new Date();
  const currentDay = String(today.getDate());
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();

  useMemo(() => {
    const data = window.localStorage.getItem("TOO_DOO_LIST");
    if (data !== null) setList(JSON.parse(data));
  }, []);

  useMemo(() => {
    window.localStorage.setItem("TOO_DOO_LIST", JSON.stringify(list));
  }, [list]);

  function handleItemAdd(input: string) {
    if (input !== "") {
      setList([...list, { value: input, isDone: false, id: uuidv4() }]);
    }
  }

  function handleItemUpdate(currentItem: ListItem) {
    setList(
      list.map((item) => {
        if (item.id === currentItem.id) {
          item.value = currentItem.value;
        }
        return item;
      })
    );
  }

  return (
    <div className="App">
      <section id="header">
        <div>
          {currentMonth} {currentDay} {currentYear}
        </div>
        <button onClick={() => window.close()}>x</button>
      </section>

      <div id="top"></div>

      <div id="body">
        <div id="left">
          <section className="toodoo">
            <h2>Todoo</h2>
            <ul>
              {list
                .filter((i) => !i.isDone)
                .map((item) => (
                  <ListEntry
                    key={item.id}
                    entry={item}
                    onUpdate={handleItemUpdate}
                  />
                ))}
              <AddItem onAdd={handleItemAdd} />
            </ul>
          </section>
          <div id="middle"></div>
          <section className="toodoo">
            <h2>Done</h2>
            {/* <List
                list={list}
                condition={true}  //isCompleted = true
                onDelete={handleDelete}
                onCheckboxChange={handleCheckboxChange}
                onItemUpdate={handleItemUpdate}
            /> */}
          </section>
        </div>
        <div id="right"></div>
      </div>

      <section id="footer">
        <div id="themes">
          <button>-</button>
          <button>-</button>
          <button>-</button>
        </div>
        <a href="#" target="blank">
          github
        </a>
      </section>
    </div>
  );
}

const AddItem = (props: AddItemProps) => {
  let [value, setValue] = useState<string>("");

  return (
    <li id="new-item">
      <input
        id="add-item"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="it&rsquo;s a good day toodoo something"
        autoComplete="off"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            props.onAdd(value);
            setValue("");
          }
        }}
      />
      <button
        type="button"
        id="add-btn"
        onClick={() => {
          props.onAdd(value);
          setValue("");
        }}
      >
        +
      </button>
    </li>
  );
};

const ListEntry = (props: ListEntryProps) => {
  let [value, setValue] = useState<string>(props.entry.value);
  const item = props.entry;

  return (
    <li key={item.id}>
      <label className="item-checkbox">
        <input
          type="checkbox"
          id={item.id}
          checked={item.isDone}
          onChange={() => {
            console.log("checkbox change");
          }}
        />
        <span className="custom-check"></span>
      </label>
      <input
        id={item.id + item.value}
        type="text"
        className="listItem"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            item.value = value;
            props.onUpdate(item);
            // lose focus to take away tab bar
          }
        }}
      />
      {/* <button id="delete-btn" onClick={() => onDelete(item.id)}>
        x
      </button> */}
    </li>
  );
};

export default App;
