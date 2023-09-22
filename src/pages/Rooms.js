import React from "react";
import { Hero } from "../components/Hero";
import { Banner } from "../components/Banner";
import { Link } from "react-router-dom";
import RoomsContainer from "../components/RoomsContainer";

export const Rooms = () => {
  return (
    <>
      <Hero hero="roomsHero">
        <Banner title="nossos quartos">
          <Link to="/" className="btn-primary">
            Retornar p/ página inicial
          </Link>
        </Banner>
      </Hero>
      <RoomsContainer></RoomsContainer>
    </>
  );
};
