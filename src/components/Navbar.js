import React, { useState } from "react";
import logo from "../images/logo.svg";
import { FaAlignRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="navbar">
      <div className="nav-center">
        <div className="nav-header">
          <Link to="/">
            <img src={logo} alt="Hotel Logo" />
          </Link>
          <button onClick={handleToggle} type="button" className="nav-btn">
            <FaAlignRight className="nav-icon" />
          </button>
        </div>
        <ul className={isOpen ? "nav-links show-nav" : "nav-links"}>
            <li>
                <Link to="/">Página inicial</Link>
            </li>
            <li>
                <Link to="/rooms">Quartos</Link>
            </li>
        </ul>
      </div>
    </nav>
  );
};
