import React, { useState } from "react";
import { Title } from "./Title";
import { FaCocktail, FaHiking, FaShuttleVan, FaBeer } from "react-icons/fa";
export const Services = () => {
  const [services, setServices] = useState([
    {
      icon: <FaCocktail />,
      title: "Café da manhã",
      info: "O café da manhã em nosso encantador hotel é muito mais do que uma simples refeição matinal; é uma experiência que abraça todos os sentidos e inicia o dia dos nossos hóspedes com uma nota de alegria e satisfação.",
    },
    {
      icon: <FaHiking />,
      title: "Passeio",
      info: "Desfrute de um despertar memorável na nossa pitoresca pousada, onde o café da manhã se transforma em uma experiência verdadeiramente encantadora. Cada manhã é uma celebração da culinária artesanal, preparada com amor e cuidado, para nutrir não apenas o corpo, mas também a alma dos nossos estimados hóspedes.",
    },
    {
      icon: <FaShuttleVan />,
      title: "Transporte",
      info: "No nosso hotel, tornamos a sua estadia o mais conveniente e memorável possível, e uma das maneiras pelas quais fazemos isso é oferecendo um serviço de transporte exclusivo para as deslumbrantes praias da região.",
    },
    {
      icon: <FaBeer />,
      title: "Cerveja gelada",
      info: "Em nosso estabelecimento, valorizamos a arte de servir cervejas geladas como ninguém. Não há nada como saborear uma cerveja bem gelada, especialmente em um dia quente de verão ou após um longo dia de trabalho.",
    },
  ]);
  return (
    <section className="services">
      <Title title="Serviços"></Title>
      <div className="services-center">
        {services.map((item, index) => {
          return (
            <article key={index} className="service">
              <span>{item.icon}</span>
              <h6>{item.title}</h6>
              <p>{item.info}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
