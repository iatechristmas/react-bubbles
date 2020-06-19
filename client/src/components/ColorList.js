import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { Redirect } from "react-router-dom";

const initialColor = {
  color: "",
  code: { hex: "" },
};

const randomColor = () => {
  const randomizer = Math.floor(Math.random() * 16777215).toString(16);
  const colorArray = {
    color: "Random" + randomizer,
    code: { hex: "#" + randomizer },
  };
  return colorArray;
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [adding, setAdding] = useState(false);

  const editColor = (color) => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then((res) => {
        console.log("saveEdit -> res", res);
        updateColors(
          colors.map((item) => (item.id === res.data.id ? res.data : item))
        );
        setEditing(false);
        setColorToEdit(initialColor);
      });
  };

  const deleteColor = (color) => {
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then((res) => {
        console.log("ColorList -> res", res);
        updateColors(colors.filter((item) => item.id !== res.data));
      })
      .catch((err) => console.log(err));
  };

  const addColor = (e) => {
    e.preventDefault();
    axiosWithAuth()
      .post(`http://localhost:5000/api/colors`, colorToEdit)
      .then((res) => {
        console.log("addColor -> res", res);
        updateColors(res.data);
        setAdding(false);
        setColorToEdit(initialColor);
      });
  };

  const addRandomColor = (e) => {
    setColorToEdit(randomColor);
    axiosWithAuth()
      .post(`http://localhost:5000/api/colors`, randomColor())
      .then((res) => {
        console.log("addRandomColor -> res", res);
        updateColors(res.data);
      });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map((color) => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <div className="button-row">
        <button onClick={() => setAdding(true)}>Add Custom Color</button>
      </div>
      <div className="button-row">
        <button onClick={() => addRandomColor()}>Add Random Color</button>
      </div>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={(e) =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={(e) =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {adding && (
        <form onSubmit={addColor}>
          <legend>add color</legend>
          <label>
            color name:
            <input
              onChange={(e) =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={(e) =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setAdding(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
    </div>
  );
};

export default ColorList;
