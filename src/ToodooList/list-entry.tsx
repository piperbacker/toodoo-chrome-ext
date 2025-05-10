import { useState } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import { ListItem } from "../App";

interface ListEntryProps {
  entry: ListItem;
  draggableProps?: DraggableProvidedDraggableProps;
  index: number;
  onUpdate: (value: ListItem) => void;
  onDelete: (id: string) => void;
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({ ...draggableStyle });

export const ListEntry = (props: ListEntryProps) => {
  const [value, setValue] = useState<string>(props.entry.value);
  const [checked, setChecked] = useState<boolean>(props.entry.isDone);
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
          <button
            {...provided.dragHandleProps}
            className="dnd-btn icon-btn"
            title="Reorder"
          >
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
            title="Delete"
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
