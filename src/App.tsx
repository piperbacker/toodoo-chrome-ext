import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
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
  draggableProps?: DraggableProvidedDraggableProps;
  index: number;
  onUpdate: (value: ListItem) => void;
  onDelete: (id: string) => void;
  onDone: (value: ListItem) => void;
}

const initList: ListItem[] = [];

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  background: isDragging ? "lightblue" : "",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  //background: isDraggingOver ? "" : "",
});

const reorder = (list: ListItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
//   const [enabled, setEnabled] = useState(false);

//   useEffect(() => {
//     const animation = requestAnimationFrame(() => setEnabled(true));

//     return () => {
//       cancelAnimationFrame(animation);
//       setEnabled(false);
//     };
//   }, []);

//   if (!enabled) {
//     return null;
//   }

//   return <Droppable {...props}>{children}</Droppable>;
// };

function App() {
  const [list, setList] = useState<ListItem[]>(initList);

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

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    const items = reorder(list, result.source.index, result.destination.index);
    setList(items);
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
              <ul>
                <DragDropContext
                  onDragEnd={(result) => {
                    onDragEnd(result);
                  }}
                >
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {list.map((item, index) => (
                          <ListEntry
                            key={item.id}
                            entry={item}
                            index={index}
                            onUpdate={handleItemUpdate}
                            onDelete={handleItemDelete}
                            onDone={handleItemDone}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <AddEntry onAdd={handleItemAdd} />
              </ul>
            </section>
            <div id="middle"></div>
            <section className="toodoo">
              {/* <ul>
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
              </ul> */}
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

const AddEntry = (props: AddItemProps) => {
  let [value, setValue] = useState<string>("");

  return (
    <li id="new-item">
      <div>{/* checkbox placeholder */}</div>
      <input
        id="add-input"
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
        className="icon-btn"
        onClick={() => {
          props.onAdd(value);
          setValue("");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 448 512"
        >
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
        </svg>
      </button>
    </li>
  );
};

const ListEntry = (props: ListEntryProps) => {
  let [value, setValue] = useState<string>(props.entry.value);
  let [checked, setChecked] = useState<boolean>(props.entry.isDone);
  const item = props.entry;

  return (
    <Draggable key={item.id} draggableId={item.id} index={props.index}>
      {(provided, snapshot) => (
        <li
          className="list-entry"
          key={item.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          // {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <label className="entry-checkbox">
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
            <span className="entry-custom-checkbox"></span>
          </label>
          <input
            id={item.id + item.value}
            type="text"
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
          <button {...provided.dragHandleProps} className="dnd-btn icon-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 448 512"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
          </button>
          <button
            className="delete-btn icon-btn"
            onClick={() => props.onDelete(item.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 448 512"
            >
              <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
            </svg>
          </button>
        </li>
      )}
    </Draggable>
  );
};

export default App;
