import React, { useContext, useState } from "react";
import defaultBcg from "../images/room-1.jpeg";
import { Banner } from "../components/Banner";
import { Link } from "react-router-dom";
import { RoomContext } from "../context";
import StyledHero from "../components/StyledHero";

export const SingleRoom = () => {
  const { getRoom } = useContext(RoomContext);

  const currentURL = window.location.href;
  const parts = currentURL.split("/");
  const roomType = parts[parts.length - 1];

  const slug = roomType;
  const room = getRoom(slug);
  
  if (!room) {
    return (
      <div className="error">
        <h3>Não encontramos o quarto</h3>
        <Link to="/rooms" className="btn-primary">
          Voltar aos quartos
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    capacity,
    size,
    price,
    extras,
    breakfast,
    pets,
    images,
  } = room;

  const [mainImg, ...defaultImg] = images;

  return (
    <div className="singleRoomOverflow">
      <StyledHero img={mainImg || defaultBcg}>
        <Banner title={`${name}`}>
          <Link to="/rooms" className="btn-primary">
            Voltar aos quartos
          </Link>
        </Banner>
      </StyledHero>
      <section className="single-room">
        <div className="single-room-images">
          {defaultImg.map((item, index) => {
            return <img key={index} src={item} alt={name} />;
          })}
        </div>
        <div className="single-room-info">
          <article className="desc">
            <h3>Detalhes</h3>
            <p>{description}</p>
          </article>
          <article className="info">
            <h3>Informações</h3>
            <h6>Preço: R${price},00</h6>
            <h6>Tamanho: {(size * 0.092903).toFixed()}m²</h6>
            <h6>
              Capacidade máxima:{" "}
              {capacity > 1 ? capacity + " pessoas" : capacity + " pessoa"}
            </h6>
            <h6>{pets ? "pets permitidos" : "pets não permitidos"}</h6>
            <h6>{breakfast && "café da manhã incluido"}</h6>
          </article>
        </div>
      </section>
      <section className="room-extras">
        <h6>Extra</h6>
        <ul className="extras">
          {extras.map((item, index) => {
            return <li key={index}>- {item}</li>;
          })}
        </ul>
      </section>
    </div>
  );
};
