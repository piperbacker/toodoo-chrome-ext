import { useState } from "react";

interface AddItemProps {
  onAdd: (value: string) => void;
}

export const AddEntry = (props: AddItemProps) => {
  const [value, setValue] = useState<string>("");

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
      <button
        type="button"
        id="add-btn"
        className="icon-btn"
        onClick={() => {
          props.onAdd(value);
          setValue("");
        }}
        title="Add (Enter)"
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
