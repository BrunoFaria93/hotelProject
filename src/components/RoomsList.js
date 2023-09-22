import React from "react";
import Room from "./Room";
export default function RoomsList({ rooms }) {
  if (rooms.length === 0) {
    return (
      <div className="empty-search">
        <h3>
          Infelizmente nenhum quarto bate com os parâmetros de sua pesquisa.
        </h3>
      </div>
    );
  }
  return (
    <>
      <section className="roomslist">
        <div className="roomslist-center">
          {rooms.map((item) => {
            return <Room key={item.id} room={item} />
          })}
        </div>
      </section>
    </>
  );
}
