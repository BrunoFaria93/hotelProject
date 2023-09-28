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
  const [isLoading, setIsLoading] = useState(false);
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
          for (
            let i = 0;
            i < Object.keys(entry.fields.reservations["en-US"]).length;
            i++
          ) {
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
    setIsLoading(true)
    var campos = "";
    if (startDate === null || endDate === null) {
      toast.error(
        "Por favor, insira as datas de entrada e saída para continuar"
      );
      setIsLoading(false)
      return;
    }

    if (
      startDate.toISOString().split("T")[0] ===
        endDate.toISOString().split("T")[0] ||
      startDate.toISOString().split("T")[0] >
        endDate.toISOString().split("T")[0]
    ) {
      toast.error(
        "Por favor, insira as datas de entrada e saída de forma correta"
      );
      setIsLoading(false)
      return;
    } else {
      var flag = false;
      async function checkDates() {
        flag = await fetchData2();
        if (flag) {
          toast.error("Data indisponível");

          return;
        } else {
          setIsLoading(true);

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
              setIsLoading(false);
              // console.log("Entrada atualizada com sucesso:", updatedEntry);
            })
            .catch((error) => {
              console.error("Erro ao atualizar a entrada:", error);
            });
        }
      }

      checkDates();
    }
  };

  // async function fetchData2() {
  //   const datasEntre2 = obterDatasEntre(startDate, endDate);

  //   let response = await Client.getEntries({
  //     content_type: "hotelRoom",
  //     order: "sys.createdAt",
  //   });
  //   let entryId = "";
  //   for (let i = 0; i < response.items.length; i++) {
  //     if (response.items[i].fields.slug === slug) {
  //       entryId = response.items[i].sys.id;
  //     }
  //   }

  //   const { createClient } = require("contentful-management");

  //   const client = createClient({
  //     accessToken: admin,
  //   });

  //   client
  //     .getSpace(cSpace)
  //     .then((space) => space.getEnvironment("master"))
  //     .then((environment) => environment.getEntry(entryId))
  //     .then((entry) => {
  //       let dateArray = [];
  //       for (
  //         let i = 0;
  //         i < Object.keys(entry.fields.reservations["en-US"]).length;
  //         i++
  //       ) {
  //         dateArray.push(entry.fields.reservations["en-US"][i]);
  //       }
  //       const datasFormatadas = dateArray.map((data) => {
  //         const dataObj = new Date(data);
  //         return `${dataObj.getFullYear()}-${String(
  //           dataObj.getMonth() + 1
  //         ).padStart(2, "0")}-${String(dataObj.getDate()).padStart(2, "0")}`;
  //       });

  //       async function verificaConflito(datas1, datas2) {
  //         for (const data of datas1) {
  //           if (await datas2.includes(data)) {
  //             toast.error("Data indisponível");
  //             return true;
  //           }
  //         }
  //         return false;
  //       }
  //       if (verificaConflito(datasFormatadas, datasEntre2)) {
  //         console.log("deu conflito no fetchdate2");
  //         return true;
  //       } else {
  //         console.log("nao deu conflito no fetchdate2");
  //         return false;
  //       }
  //     });
  // }

  async function fetchData2() {
    return new Promise(async (resolve, reject) => {
      const datasEntre2 = obterDatasEntre(startDate, endDate);

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
          for (
            let i = 0;
            i < Object.keys(entry.fields.reservations["en-US"]).length;
            i++
          ) {
            dateArray.push(entry.fields.reservations["en-US"][i]);
          }
          const datasFormatadas = dateArray.map((data) => {
            const dataObj = new Date(data);
            return `${dataObj.getFullYear()}-${String(
              dataObj.getMonth() + 1
            ).padStart(2, "0")}-${String(dataObj.getDate()).padStart(2, "0")}`;
          });

          function verificaConflito(datas1, datas2) {
            for (const data of datas1) {
              if (datas2.includes(data)) {
                resolve(true);
                return;
              }
            }
            resolve(false);
          }

          if (verificaConflito(datasFormatadas, datasEntre2)) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          console.error("Erro em fetchData2:", error);
          reject(error);
        });
    });
  }

  const isDateDisabled = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const arrayData = disabledDate.map(
      (objeto) => new Date(objeto.toString()).toISOString().split("T")[0]
    );

    const chunkSize = 2;
    const dividedArray = divideArray(arrayData, chunkSize);

    for (const [dataInicio, dataFim] of dividedArray) {
      const diferencaDias = calculateDayDifference(dataInicio, dataFim);
      if (diferencaDias === 1) {
        if (dataInicio === formattedDate || dataFim === formattedDate) {
          return false; // Ambas as datas estão desabilitadas
        }
      } else {
        // const contentfulData = fetchData()

        // console.log("contentfulData: ", contentfulData)
        const datasEntre = obterDatasEntre(dataInicio, dataFim);
        const datasEntre2 = obterDatasEntre(startDate, endDate);
        if (datasEntre.includes(formattedDate)) {
          return false; // A data está desabilitada
        }
      }
    }

    return true; // A data não está desabilitada
  };

  function obterDatasEntre(dataInicio, dataFim) {
    const datas = [];
    const dataAtual = new Date(dataInicio);
    const dataFimTimestamp = new Date(dataFim).getTime();

    while (dataAtual <= dataFimTimestamp) {
      datas.push(new Date(dataAtual).toISOString().split("T")[0]);
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return datas;
  }

  function divideArray(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }

  function calculateDayDifference(data1, data2) {
    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000; // 1 dia em milissegundos
    const data1Timestamp = new Date(data1).getTime();
    const data2Timestamp = new Date(data2).getTime();
    const diferencaEmDias = Math.abs(
      (data2Timestamp - data1Timestamp) / umDiaEmMilissegundos
    );
    return diferencaEmDias;
  }


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
          {isLoading ? (
            <div className="loading-btn">Loading&#8230;</div>

          ) : (
            <button onClick={() => reservation()}>Reservar</button>
          )}
          {/* <button onClick={() => fetchData2()}>Reservar</button> */}
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
