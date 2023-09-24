import React from "react";
import { useContext } from "react";
import { RoomContext } from "../context";
import { Title } from "../components/Title";

// get all unique values
const getUnique = (items, value) => {
  return [...new Set(items.map((item) => item[value]))];
};
export default function RoomsFilter({ rooms }) {
  const context = useContext(RoomContext);
  const {
    handleChange,
    type,
    capacity,
    price,
    minPrice,
    maxPrice,
    minSize,
    maxSize,
    breakfast,
    pets,
  } = context;

  // get unique types
  let types = getUnique(rooms, "type");

  // add all
  types = ["all", ...types];
  // map to jsx
  types = types.map((item, index) => {
    return (
      <option value={item} key={index}>
        {item === "all" && "Todos"}
        {item === "presidential" && "Presidencial"}
        {item === "family" && "Família"}
        {item === "double" && "Casal"}
        {item === "single" && "Solteiro"}
      </option>
    );
  });
  let people = getUnique(rooms, "capacity").sort();
  people = people.sort((a, b) => a - b);
  people = people.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });
  return (
    <>
      <section className="filter-container">
        <Title title="Filtro de quartos" />
        <form className="filter-form">
          {/* select type */}
          <div className="form-group">
            <label htmlFor="type">Tipo de quarto</label>
            <select
              name="type"
              id="type"
              value={type}
              className="form-control"
              onChange={handleChange}
            >
              {types}
            </select>
          </div>
          {/* end select type */}
          {/* guests */}
          <div className="form-group">
            <label htmlFor="capacity">Hóspedes</label>
            <select
              name="capacity"
              id="capacity"
              value={capacity}
              className="form-control"
              onChange={handleChange}
            >
              {people}
            </select>
          </div>
          {/* end guests */}
          {/* room price */}
          <div className="form-group">
            <label htmlFor="price">Preço R${price},00</label>
            <input
              style={{ cursor: 'pointer' }}
              type="range"
              name="price"
              min={minPrice}
              max={maxPrice}
              id="price"
              value={price}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {/* end room price */}
          {/* extras */}
          <div className="form-group">
            <div className="single-extra">
              <input
                style={{ cursor: 'pointer' }}
                type="checkbox"
                name="breakfast"
                id="breakfast"
                checked={breakfast}
                onChange={handleChange}
              />
              <label htmlFor="breakfast">Café da manhã</label>
            </div>
            <div className="single-extra">
              <input
                style={{ cursor: 'pointer' }}
                type="checkbox"
                name="pets"
                id="pets"
                checked={pets}
                onChange={handleChange}
              />
              <label htmlFor="pets">pets</label>
            </div>
          </div>
          {/* end extra */}
        </form>
      </section>
    </>
  );
}
