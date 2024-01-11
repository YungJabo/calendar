import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.scss";
import { times } from "./time";
import { format } from "date-fns";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeStart, setSelectedTimeStart] = useState(null);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState(null);
  const occupiedDates = ["2024-01-20", "2024-01-21"];
  const currentDate = new Date();
  const firstDayOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  const selectTimeStart = (time) => {
    setSelectedTimeStart(time);
  };
  const selectTimeEnd = (time) => {
    setSelectedTimeEnd(time);
  };
  const sendDates = () => {
    const startDate = selectedDate[0];
    const endDate = selectedDate[1];
    if (!startDate || !endDate || !selectedTimeStart || !selectedTimeEnd) {
      alert("Вы не выбрали дату или время");
      return;
    }
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    console.log({
      formattedStartDate,
      formattedEndDate,
      selectedTimeStart,
      selectedTimeEnd,
    });
  };
  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }
    const formattedDate = format(date, "yyyy-MM-dd");
    return occupiedDates.includes(formattedDate);
  };
  const tileClassName = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const today = new Date();
    return occupiedDates.includes(formattedDate) && date >= today
      ? "occupied"
      : "";
  };

  const handleDateChange = (newDate) => {
    const isDateRangeValid = !occupiedDates.some((occupiedDate) => {
      const [start, end] = newDate;

      return new Date(occupiedDate) >= start && new Date(occupiedDate) <= end;
    });

    if (isDateRangeValid) {
      setSelectedDate(newDate);
    } else {
      alert("Выбранный диапазон содержит занятые даты");
    }
  };

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);
  return (
    <>
      <div className="main">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          selectRange={true}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          minDate={firstDayOfCurrentMonth}
          maxDate={lastDayOfNextMonth}
          navigationLabel={null}
        />

        <div className="times-block">
          <div className="time-block">
            <span className="time-text">Время заезда:</span>
            <ul className="time time--start">
              {times.map((time, index) => (
                <li
                  key={index}
                  className={`time__item ${
                    selectedTimeStart === time ? "active" : ""
                  }`}
                  onClick={() => selectTimeStart(time)}
                >
                  {time}
                </li>
              ))}
            </ul>
          </div>
          <div className="time-block">
            <span className="time-text">Время отъезда:</span>
            <ul className="time time--start">
              {times.map((time, index) => (
                <li
                  key={index}
                  className={`time__item ${
                    selectedTimeEnd === time ? "active" : ""
                  }`}
                  onClick={() => selectTimeEnd(time)}
                >
                  {time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button onClick={sendDates}>Забронировать</button>
    </>
  );
}

export default App;
