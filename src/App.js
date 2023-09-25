import "./App.css";
import { Home } from "./pages/Home";
import { Rooms } from "./pages/Rooms";
import { SingleRoom } from "./pages/SingleRoom";
import { Error } from "./pages/Error";
import { Navbar } from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/" element={<Rooms />} />
        <Route path="/rooms/:slug" element={<SingleRoom />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
