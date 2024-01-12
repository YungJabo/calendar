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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/calendar" element={<Main />} />
        <Route path="/calendar/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
