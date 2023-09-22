import React from "react";
import { Hero } from "../components/Hero";
import { Banner } from "../components/Banner";
import { Link } from "react-router-dom";
import { Services } from "../components/Services";
import FeaturedRooms from "../components/FeaturedRooms";

export const Home = () => {

  return (
    <>
      <Hero>
        <Banner
          title="Bruno's Hotel"
          subtitle="Quartos muito acolhedores a partir de R$ 100,00"
        >
          <Link to="/rooms" className="btn-primary">
            Nossos quartos
          </Link>
        </Banner>
      </Hero>
      <Services />
      <FeaturedRooms />
    </>
  );
};
