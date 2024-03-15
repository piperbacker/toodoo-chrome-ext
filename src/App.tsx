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
  onDelete: (id: string) => void;
  onDone: (value: ListItem) => void;
}

const initList: ListItem[] = [];
function App() {
  const [list, setList] = useState<ListItem[]>(initList);

  const today = new Date();
  const currentDay = String(today.getDate());
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();

  useMemo(() => {
    const data = window.localStorage.getItem("TOODOO_LIST");
    if (data !== null) setList(JSON.parse(data));
  }, []);

  useMemo(() => {
    window.localStorage.setItem("TOODOO_LIST", JSON.stringify(list));
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

  function handleItemDelete(currentId: string) {
    const updatedList = list.filter((item) => item.id !== currentId);
    setList(updatedList);
  }

  function handleItemDone(currentItem: ListItem) {
    setList(
      list.map((item) => {
        if (item.id === currentItem.id) {
          item.isDone = currentItem.isDone;
        }
        return item;
      })
    );
  }

  return (
    <div className="App">
      <section id="header">
        <p>toodoo</p>
        <div>
          <button>t</button>
          <button>g</button>
        </div>
      </section>

      <div id="body">
        <div id="top"></div>

        <div id="container">
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
                      onDelete={handleItemDelete}
                      onDone={handleItemDone}
                    />
                  ))}
                <AddItem onAdd={handleItemAdd} />
              </ul>
            </section>
            <div id="middle"></div>
            <section className="toodoo">
              <h2>Done</h2>
              <ul>
                {list
                  .filter((i) => i.isDone)
                  .map((item) => (
                    <ListEntry
                      key={item.id}
                      entry={item}
                      onUpdate={handleItemUpdate}
                      onDelete={handleItemDelete}
                      onDone={handleItemDone}
                    />
                  ))}
              </ul>
            </section>
          </div>
          <div id="right"></div>
        </div>
      </div>

      <section id="footer">
        <div id="tags">
          <p>tags:</p>
          <button>important</button>
          <button>school</button>
          <button>misc</button>
        </div>
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
  let [checked, setChecked] = useState<boolean>(props.entry.isDone);
  const item = props.entry;

  return (
    <li key={item.id}>
      <label className="item-checkbox">
        <input
          type="checkbox"
          id={item.id}
          checked={checked}
          onChange={() => {
            setChecked(!checked);
            item.isDone = !item.isDone;
            props.onDone(item);
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
      <button className="delete-btn" onClick={() => props.onDelete(item.id)}>
        x
      </button>
    </li>
  );
};

export default App;
