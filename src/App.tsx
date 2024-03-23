import { useMemo, useState } from "react";
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
  tag?: Tag;
}

interface Tag {
  id: string;
  value: string;
  color: string;
}

enum Themes {
  Sunrise = "sunrise",
  Day = "day",
  Sunset = "sunset",
  Night = "night",
}

const themes = [
  { theme: Themes.Sunrise, color: "#f7bed9" },
  { theme: Themes.Day, color: "#95daff" },
  { theme: Themes.Sunset, color: "#be25cc" },
  { theme: Themes.Night, color: "#0a1423" },
];
const tagColors = ["#00A19F", "#A55221", "#628636", "#596700", "#B03045"];

interface AddItemProps {
  onAdd: (value: string) => void;
}

interface ListEntryProps {
  entry: ListItem;
  draggableProps?: DraggableProvidedDraggableProps;
  tags: Tag[];
  index: number;
  onUpdate: (value: ListItem) => void;
  onDelete: (id: string) => void;
}

const initList: ListItem[] = [];
const initTags: Tag[] = [];

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({ ...draggableStyle });

const getListStyle = (isDraggingOver: boolean) => ({});

const reorder = (list: ListItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function App() {
  const [theme, setTheme] = useState<Themes>(Themes.Sunrise);
  const [list, setList] = useState<ListItem[]>(initList);
  const [tags, setTags] = useState<Tag[]>(initTags);
  const [newTag, setNewTag] = useState<string>("");

  useMemo(() => {
    const listData = window.localStorage.getItem("TOODOO_LIST");
    if (listData !== null) setList(JSON.parse(listData));

    const themeData = window.localStorage.getItem("TOODOO_THEME");
    if (themeData !== null) setTheme(JSON.parse(themeData));

    const tagData = window.localStorage.getItem("TOODOO_TAGS");
    if (tagData !== null) setTags(JSON.parse(tagData));
  }, []);

  useMemo(() => {
    window.localStorage.setItem("TOODOO_LIST", JSON.stringify(list));
  }, [list]);

  useMemo(() => {
    window.localStorage.setItem("TOODOO_THEME", JSON.stringify(theme));
  }, [theme]);

  useMemo(() => {
    window.localStorage.setItem("TOODOO_TAGS", JSON.stringify(tags));
  }, [tags]);

  function handleItemAdd(input: string) {
    if (input !== "") {
      setList([...list, { value: input, isDone: false, id: uuidv4() }]);
    }
  }

  function handleItemUpdate(currentItem: ListItem) {
    setList(
      list.map((item) => {
        if (item.id === currentItem.id) {
          item = currentItem;
        }
        return item;
      })
    );
  }

  function handleItemDelete(currentId: string) {
    const updatedList = list.filter((item) => item.id !== currentId);
    setList(updatedList);
  }

  function handleTagAdd(input: string) {
    if (input !== "") {
      const idx = tags.length;
      setTags([...tags, { id: uuidv4(), value: input, color: tagColors[idx] }]);
    }
  }

  function onDragEnd(result: any, filteredList: ListItem[]) {
    if (!result.destination) {
      return;
    }

    const startItem = filteredList[result.source.index];
    const endItem = filteredList[result.destination.index];

    const items = reorder(list, list.indexOf(startItem), list.indexOf(endItem));
    setList(items);
  }

  return (
    <div className="App" data-color-theme={theme}>
      <section id="header">
        <p>toodoo</p>
        <div className="header-btns">
          <div className="themes">
            <button
              id="selected-theme"
              style={{ background: "var(--main-color)" }}
            >
              t
            </button>
            <div className="all-themes">
              {themes
                .filter((t) => t.theme !== theme)
                .map((t, index) => (
                  <button
                    onClick={() => setTheme(t.theme)}
                    key={t.theme}
                    style={{ background: t.color }}
                  ></button>
                ))}
            </div>
          </div>
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
                    onDragEnd(
                      result,
                      list.filter((i) => !i.isDone)
                    );
                  }}
                >
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {list
                          .filter((i) => !i.isDone)
                          .map((item, index) => (
                            <ListEntry
                              key={item.id}
                              entry={item}
                              tags={tags}
                              index={index}
                              onUpdate={handleItemUpdate}
                              onDelete={handleItemDelete}
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
            {list.filter((i) => i.isDone).length > 0 && (
              <section className="toodoo">
                <ul>
                  <DragDropContext
                    onDragEnd={(result) => {
                      onDragEnd(
                        result,
                        list.filter((i) => i.isDone)
                      );
                    }}
                  >
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {list
                            .filter((i) => i.isDone)
                            .map((item, index) => (
                              <ListEntry
                                key={item.id}
                                entry={item}
                                tags={tags}
                                index={index}
                                onUpdate={handleItemUpdate}
                                onDelete={handleItemDelete}
                              />
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </ul>
              </section>
            )}
          </div>
          <div id="right"></div>
        </div>
      </div>

      <section id="footer">
        <div id="tags">
          <input
            id="tag-input"
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="tags"
            autoComplete="off"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleTagAdd(newTag);
                setNewTag("");
              }
            }}
          />
          {tags.map((tag) => (
            <button key={tag.id} style={{ background: tag.color }}>
              {tag.value}
            </button>
          ))}
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
        placeholder="it&rsquo;s time toodoo something"
        autoComplete="off"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            props.onAdd(value);
            setValue("");
          }
        }}
      />
      {/* <button
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
      </button> */}
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
                props.onUpdate(item);
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
          {item.tag && (
            <span className="entry-tag" style={{ background: item.tag?.color }}>
              {item.tag.value}
            </span>
          )}
          <div className="tags-dropdown">
            <button style={{ background: item.tag?.color }}>+</button>
            <div className="tags-dropdown-list">
              {props.tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    item.tag = tag;
                    props.onUpdate(item);
                  }}
                  style={{ background: tag.color }}
                >
                  {tag.value}
                </button>
              ))}
            </div>
          </div>
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
