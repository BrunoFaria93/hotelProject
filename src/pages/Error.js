import React from "react";
import { Hero } from "../components/Hero";
import { Banner } from "../components/Banner";
import { Link } from "react-router-dom";

export const Error = () => {
  return (
    <>
      <Hero>
        <Banner
          title="404"
          subtitle="Página não encontrada"
        >
          <Link to="/" className="btn-primary">
            Retornar p/ página inicial
          </Link>
        </Banner>
      </Hero>
    </>
  );
};
