import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import "./App.css";
import { ListEntry } from "./TodooList/list-entry";
import { AddEntry } from "./TodooList/add-entry";

export interface ListItem {
  id: string;
  value: string;
  isDone: boolean;
  tag?: Tag;
}

export interface Tag {
  id: string;
  value: string;
  color: string;
}

enum ThemeName {
  Sunrise = "Sunrise",
  Day = "Daylight",
  Sunset = "Sunset",
  Night = "Night",
}

interface Theme {
  name: ThemeName;
  color: string;
  icon: string;
}

const themes: Theme[] = [
  { name: ThemeName.Sunrise, color: "#f7bed9", icon: "clear_day" },
  { name: ThemeName.Day, color: "#95daff", icon: "partly_cloudy_day" },
  { name: ThemeName.Sunset, color: "#be25cc", icon: "wb_twilight" },
  { name: ThemeName.Night, color: "#0a1423", icon: "moon_stars" },
];

const tagColors = ["#00A19F", "#A55221", "#628636", "#596700", "#B03045"];

const initList: ListItem[] = [];
const initTags: Tag[] = [];

const reorder = (list: ListItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function App() {
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [list, setList] = useState<ListItem[]>(initList);
  const [tags, setTags] = useState<Tag[]>(initTags);
  // const [newTag, setNewTag] = useState<string>("");

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
        if (item.id === currentItem.id) item = currentItem;
        return item;
      })
    );
  }

  function handleItemDelete(currentId: string) {
    const updatedList = list.filter((item) => item.id !== currentId);
    setList(updatedList);
  }

  // function handleTagAdd(input: string) {
  //   if (input !== "") {
  //     const idx = tags.length;
  //     setTags([...tags, { id: uuidv4(), value: input, color: tagColors[idx] }]);
  //   }
  // }

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
    <div className="App" data-color-theme={theme.name}>
      <section id="header">
        <p>toodoo</p>
        <div className="header-btns">
          <div className="themes">
            <button
              id="selected-theme"
              style={{ background: "var(--main-color)" }}
              title={theme.name}
            >
              <span className="material-symbols-outlined theme-icon">
                {theme.icon}
              </span>
            </button>
            <div className="all-themes">
              {themes
                .filter((t) => t !== theme)
                .map((t, index) => (
                  <button
                    onClick={() => setTheme(t)}
                    key={index}
                    style={{ background: t.color }}
                    title={t.name}
                  >
                    <span className="material-symbols-outlined theme-icon">
                      {t.icon}
                    </span>
                  </button>
                ))}
            </div>
          </div>
          <button title="Github">g</button>
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
                      <div {...provided.droppableProps} ref={provided.innerRef}>
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

      {/* <section id="footer">
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
      </section> */}
    </div>
  );
}

export default App;
