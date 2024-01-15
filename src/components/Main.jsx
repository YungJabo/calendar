import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../App.scss";
import { times } from "../time";
import { format } from "date-fns";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import dogGif from "../assets/dog.gif";
import dogWebm from "../assets/dog.webm";
import closeSvg from "../assets/close.svg";
import errorSvg from "../assets/error.svg";

function Main() {
  const body = document.body;
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedTimeStart, setSelectedTimeStart] = useState(null);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState(null);
  const [timesBlock, setTimesBlock] = useState([]);
  const [startTimesBlock, setStartTimesBlock] = useState([]);
  const [endTimesBlock, setEndTimesBlock] = useState(times);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [errors, setErrors] = useState([]);
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
      "https://monya.pythonanywhere.com/api/reserved_days"
    );
  };

  const closeModal = () => {
    setIsModal(false);
    setErrors([]);
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
  const sendDates = async () => {
    const startDate = selectedDate[0] || null;
    const endDate = selectedDate[1] || null;
    if (!startDate || !endDate || !selectedTimeStart || !selectedTimeEnd) {
      setErrors(["Вы не выбрали дату или время"]);
    }
    if (phoneRef.current.value === "") {
      setErrors((prevErrors) => [...prevErrors, "Вы не ввели номер телефона"]);
      setIsModal(true);
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
    setIsLoading(true);
    await axios
      .post("https://monya.pythonanywhere.com/api/reserve", {
        phone: phoneRef.current.value,
        telegram: tgName,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      })
      .then((response) => {
        if (response.status === 201) {
          getOccupiedDates();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response && error.response.status === 400) {
          // Обработка ошибки с статусом 400
          const errorData = error.response.data;
          setIsModal(true);
          if (errorData) {
            const errorMessage = errorData.errors;
            setErrors(errorMessage);
          }
        }
        setIsLoading(false);
      });
  };
  const tileDisabled = ({ date }) => {
    const targetTimezone = "Europe/Podgorica";
    const currentDateInTargetTimezone = moment
      .tz(targetTimezone)
      .format("DD-HH-MM");
    const day = parseInt(currentDateInTargetTimezone.split("-")[0], 10);
    const hours = parseInt(currentDateInTargetTimezone.split("-")[1], 10);
    const month = parseInt(currentDateInTargetTimezone.split("-")[2], 10);

    if (
      (date.getDate() < day && date.getMonth() + 1 === month) ||
      (date.getDate() === day &&
        date.getMonth() + 1 === month &&
        hours >= parseInt(times[times.length - 1].split("-")[0], 10))
    ) {
      return true;
    }
    const formattedDate = format(date, "yyyy-MM-dd");
    return occupiedDates.includes(formattedDate);
  };
  const tileClassName = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const targetTimezone = "Europe/Podgorica";
    const currentDateInTargetTimezone = moment
      .tz(targetTimezone)
      .format("DD-HH-MM");
    const day = parseInt(currentDateInTargetTimezone.split("-")[0], 10);
    const month = parseInt(currentDateInTargetTimezone.split("-")[2], 10);
    return (occupiedDates.includes(formattedDate) &&
      date.getDate() >= day &&
      date.getMonth() + 1 === month) ||
      (occupiedDates.includes(formattedDate) && date.getMonth() + 1 > month)
      ? "occupied"
      : "";
  };
  const checkTime = (newDate) => {
    const targetTimezone = "Europe/Podgorica";
    const currentDateInTargetTimezone = moment
      .tz(targetTimezone)
      .format("DD-HH-MM");
    const currentDay = parseInt(currentDateInTargetTimezone.split("-")[0], 10);
    const currentHour = parseInt(currentDateInTargetTimezone.split("-")[1], 10);
    const currentMonth = parseInt(
      currentDateInTargetTimezone.split("-")[2],
      10
    );
    const pastTimes = times.filter((time) => {
      const timeHour = parseInt(time.split(":")[0], 10);
      return (
        newDate[0].getDate() === currentDay &&
        timeHour < currentHour &&
        newDate[0].getMonth() + 1 === currentMonth
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
      "https://monya.pythonanywhere.com/api/reserved_days"
    );
    setOccupiedDates(response.data.days);
    console.log(response.data.days);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const checkPhone = (event) => {
    const keyCode = event.keyCode || event.which;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8) {
      event.preventDefault();
    }
  };
  const checkTg = (event) => {
    if (tgRef.current.value[0] !== "@") {
      let currentValue = tgRef.current.value;
      currentValue = currentValue.replace("@", "");
      tgRef.current.value = "@" + currentValue;
    }
    if (event.target.selectionStart == 1) {
      event.preventDefault();
      event.target.selectionStart = tgRef.current.value.length;
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
  }, []);
  useEffect(() => {
    if (isModal) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "visible";
    }
  }, [isModal]);
  useEffect(() => {
    if (!isLoading) {
      tgRef.current.value = "@";
    }
    console.log(times[times.length - 1]);
  }, [isLoading]);

  return (
    <>
      {!isLoading ? (
        <div className="wrapper">
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
            onInput={checkTg}
            onChange={checkTg}
            type="text"
            name=""
            id=""
            ref={tgRef}
            placeholder="@telegram_nick"
          />

          <button onClick={sendDates}>Забронировать</button>
          <button onClick={testFunc}>Тест</button>
          <Link to="/admin">Admin panel</Link>
        </div>
      ) : (
        <img src={dogGif} className="img-loading" alt="" />
      )}
      {isModal ? (
        <div className="modal">
          <div className="modal__content">
            <ul className="errors">
              {errors.map((error, index) => (
                <li key={index} className="errors__item">
                  <img src={errorSvg} alt="" className="error__img" />
                  <span className="error__text">{error}</span>
                </li>
              ))}
            </ul>
            <button className="modal__close" onClick={closeModal}>
              <img className="img-close" src={closeSvg} />
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Main;
