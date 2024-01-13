import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../App.scss";
import { times } from "../time";
import { format } from "date-fns";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

function Main() {
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedTimeStart, setSelectedTimeStart] = useState(null);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState(null);
  const [timesBlock, setTimesBlock] = useState([]);
  const [startTimesBlock, setStartTimesBlock] = useState([]);
  const [endTimesBlock, setEndTimesBlock] = useState(times);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const phoneRef = useRef(null);
  const tgRef = useRef(null);
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

  const testFunc = async () => {
    const data = await axios.get(
      "https://monya.pythonanywhere.com/front_api/reserved_days"
    );
    console.log(data);
  };

  const selectTimeStart = (time) => {
    const currentHour = parseInt(time.split(":")[0], 10);
    if (selectedDate.length > 0) {
      const pastTimes = times.filter((time_) => {
        const timeHour = parseInt(time_.split(":")[0], 10);
        return (
          format(selectedDate[0], "MM-dd") ===
            format(selectedDate[1], "MM-dd") && timeHour <= currentHour
        );
      });
      setStartTimesBlock([]);
      setEndTimesBlock(pastTimes);
      setSelectedTimeStart(time);
    }
  };
  const selectTimeEnd = (time) => {
    const currentHour = parseInt(time.split(":")[0], 10);
    const pastTimes = times.filter((time_) => {
      const timeHour = parseInt(time_.split(":")[0], 10);
      return (
        format(selectedDate[0], "MM-dd") === format(selectedDate[1], "MM-dd") &&
        timeHour !== currentHour
      );
    });
    const currentHourStart = parseInt(selectedTimeStart.split(":")[0], 10);
    const pastTimesStart = times.filter((time_) => {
      const timeHour = parseInt(time_.split(":")[0], 10);
      return (
        format(selectedDate[0], "MM-dd") === format(selectedDate[1], "MM-dd") &&
        timeHour !== currentHourStart
      );
    });
    setStartTimesBlock(pastTimesStart);
    setEndTimesBlock(pastTimes);
    setSelectedTimeEnd(time);
  };
  const sendDates = () => {
    const startDate = selectedDate[0] || null;
    const endDate = selectedDate[1] || null;
    if (!startDate || !endDate || !selectedTimeStart || !selectedTimeEnd) {
      alert("Вы не выбрали дату или время");
      return;
    }
    if (phoneRef.current.value === "") {
      alert("Вы не ввели номер телефона");
      return;
    }
    const startDateWithTime = new Date(startDate);
    startDateWithTime.setHours(selectedTimeStart.split(":")[0]);
    startDateWithTime.setMinutes(selectedTimeStart.split(":")[1]);

    const endDateWithTime = new Date(endDate);
    endDateWithTime.setHours(selectedTimeEnd.split(":")[0]);
    endDateWithTime.setMinutes(selectedTimeEnd.split(":")[1]);

    const formattedStartDate = format(startDateWithTime, "yyyy-MM-dd HH:mm");
    const formattedEndDate = format(endDateWithTime, "yyyy-MM-dd HH:mm");
    const tgName = tgRef.current.value.length > 1 ? tgRef.current.value : "";
    console.log(
      formattedStartDate,
      formattedEndDate,
      phoneRef.current.value,
      tgName
    );

    axios
      .post("https://monya.pythonanywhere.com/front_api/reserve", {
        phone: phoneRef.current.value,
        telegram: tgName,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      })
      .then((response) => {
        if (response.status === 201) {
          getOccupiedDates();
        }
      })
      .catch((error) => {
        console.error(error);
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
  const checkTime = (newDate) => {
    const targetTimezone = "Pacific/Apia";
    const currentDateInTargetTimezone = moment().tz(targetTimezone);
    const currentTime = currentDateInTargetTimezone.format("HH:mm");
    const currentHour = parseInt(currentTime.split(":")[0], 10);
    const pastTimes = times.filter((time) => {
      const timeHour = parseInt(time.split(":")[0], 10);
      return (
        newDate[0].getDate() === currentDateInTargetTimezone.date() &&
        timeHour < currentHour
      );
    });
    setTimesBlock(pastTimes);
  };

  const handleDateChange = (newDate) => {
    const isDateRangeValid = !occupiedDates.some((occupiedDate) => {
      const [start, end] = newDate;

      return new Date(occupiedDate) >= start && new Date(occupiedDate) <= end;
    });

    if (isDateRangeValid) {
      checkTime(newDate);
      setSelectedDate(newDate);
    } else {
      alert("Выбранный диапазон содержит занятые даты");
    }
  };

  const resetTime = () => {
    setStartTimesBlock([]);
    setEndTimesBlock(times);
    setSelectedTimeStart(null);
    setSelectedTimeEnd(null);
  };
  const getOccupiedDates = async () => {
    const response = await axios.get(
      "https://monya.pythonanywhere.com/front_api/reserved_days"
    );
    setOccupiedDates(response.data.days);
  };
  const checkPhone = (event) => {
    const keyCode = event.keyCode || event.which;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8) {
      event.preventDefault();
    }
  };
  const checkTg = (event) => {
    tgRef.current.setSelectionRange(
      tgRef.current.value.length,
      tgRef.current.value.length
    );
    tgRef.current.focus();
    if (tgRef.current.value.trim() === "") {
      tgRef.current.value = "@";
    }
  };

  useEffect(() => {
    if (selectedDate.length > 0) {
      setStartTimesBlock([]);
    } else {
      setStartTimesBlock(times);
    }
    setEndTimesBlock(times);
    setSelectedTimeStart(null);
    setSelectedTimeEnd(null);
  }, [selectedDate]);
  useEffect(() => {
    getOccupiedDates();
    tgRef.current.value = "@";
  }, []);
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
                  } ${timesBlock.includes(time) ? "block" : ""} ${
                    !selectedDate ? "block" : ""
                  } ${startTimesBlock.includes(time) ? "block" : ""}`}
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
                  } ${
                    timesBlock.includes(time) &&
                    format(selectedDate[0], "MM-dd") ===
                      format(selectedDate[1], "MM-dd")
                      ? "block"
                      : ""
                  } ${!selectedDate ? "block" : ""} ${
                    endTimesBlock.includes(time) ? "block" : ""
                  }`}
                  onClick={() => selectTimeEnd(time)}
                >
                  {time}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button onClick={resetTime}>Сбросить время</button>
      </div>

      <input
        onKeyDown={checkPhone}
        type="tel"
        name=""
        id=""
        ref={phoneRef}
        placeholder="Введите номер телефона"
      />
      <input
        onChange={checkTg}
        onKeyDown={checkTg}
        type="text"
        name=""
        id=""
        ref={tgRef}
        placeholder="@telegram_nick"
      />
      <button onClick={sendDates}>Забронировать</button>
      <button onClick={testFunc}>Тест</button>
      <Link to="/about">Go to Main</Link>
    </>
  );
}

export default Main;
