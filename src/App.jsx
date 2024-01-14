import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.scss";
import { times } from "./time";
import { format } from "date-fns";
import axios from "axios";
import moment from "moment-timezone";
import Main from "./components/Main";
import About from "./components/About";
import Login from "./components/Login";
import Admin from "./components/Admin";

import { CookiesProvider } from "react-cookie";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </CookiesProvider>
    </Router>
  );
}

export default App;
