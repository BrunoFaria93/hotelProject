import React, { useContext, useEffect, useState } from "react";
import defaultBcg from "../images/room-1.jpeg";
import { Banner } from "../components/Banner";
import { Link } from "react-router-dom";
import { RoomContext } from "../context";
import StyledHero from "../components/StyledHero";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Client from "../Contentful";
import { toast } from "react-toastify";

export const SingleRoom = () => {
  const cSpace = process.env.REACT_APP_CONTENTFUL_SPACE;
  const admin = process.env.REACT_APP_CONTENTFUL_ADMIN;

  const { getRoom } = useContext(RoomContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [disabledDate, setDisabledDate] = useState([]);

  const currentURL = window.location.href;
  const parts = currentURL.split("/");
  const roomType = parts[parts.length - 1];

  const slug = roomType;
  const room = getRoom(slug);

  useEffect(() => {
    async function fetchData() {
      let response = await Client.getEntries({
        content_type: "hotelRoom",
        order: "sys.createdAt",
      });
      let entryId = "";
      for (let i = 0; i < response.items.length; i++) {
        if (response.items[i].fields.slug === slug) {
          entryId = response.items[i].sys.id;
        }
      }

      const { createClient } = require("contentful-management");

      const client = createClient({
        accessToken: admin,
      });

      client
        .getSpace(cSpace)
        .then((space) => space.getEnvironment("master"))
        .then((environment) => environment.getEntry(entryId))
        .then((entry) => {
          let dateArray = [];
          for (let i = 0; i < Object.keys(entry.fields.reservations["en-US"]).length;i++) {
            dateArray.push(entry.fields.reservations["en-US"][i]);
          }
          setDisabledDate(dateArray);
        })
        .catch((error) => {
          console.error("Erro no effect:", error);
        });
    }
    fetchData();
  }, []);

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

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const reservation = async () => {
    var campos = "";
    if (startDate === null || endDate === null) {
      toast.error("Por favor, insira as datas de entrada e saída para continuar");
      return;
    } else {
      campos = [startDate.toString(), endDate.toString()];

      let response = await Client.getEntries({
        content_type: "hotelRoom",
        order: "sys.createdAt",
      });

      let entryId = "";
      for (let i = 0; i < response.items.length; i++) {
        if (response.items[i].fields.slug === slug) {
          entryId = response.items[i].sys.id;
        }
      }

      const newReservationsValue = campos;

      const { createClient } = require("contentful-management");

      const client = createClient({
        accessToken: admin,
      });

      client
        .getSpace(cSpace)
        .then((space) => space.getEnvironment("master"))
        .then((environment) => environment.getEntry(entryId))
        .then((entry) => {
          if (entry.fields.reservations === undefined) {
            entry.fields.reservations = {
              "en-US": newReservationsValue,
            };
          } else {
            const updatedReservations = [
              ...entry.fields.reservations["en-US"],
              ...newReservationsValue,
            ];
            entry.fields.reservations["en-US"] = updatedReservations;
          }
          return entry.update();
        })
        .then((updatedEntry) => {
          toast.success("Registrado com sucesso.");
          // console.log("Entrada atualizada com sucesso:", updatedEntry);
        })
        .catch((error) => {
          console.error("Erro ao atualizar a entrada:", error);
        });
    }
  };

  const isDateDisabled = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const arrayData = disabledDate.map(
      (objeto) => new Date(objeto.toString()).toISOString().split("T")[0]
    );
    return !arrayData.includes(formattedDate);
  };

  return (
    <div className="singleRoomOverflow">
      <StyledHero img={mainImg || defaultBcg}>
        <Banner title={`${name}`}>
          <Link to="/rooms" className="btn-primary">
            Voltar aos quartos
          </Link>
        </Banner>
      </StyledHero>
      <div></div>
      <section className="single-room">
        <div className="date-div">
          <label>Data entrada:</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="dd/MM/yyyy"
            filterDate={isDateDisabled}
            minDate={
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
              )
            }
          />
          <label>Data saída:</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="dd/MM/yyyy"
            filterDate={isDateDisabled}
            minDate={
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
              )
            }
          />
          <button onClick={() => reservation()}>Reservar</button>
        </div>

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
