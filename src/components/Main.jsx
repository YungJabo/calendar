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

function Main() {
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
        if (response.status === 400) {
          console.log(response.non_field_errors);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Обработка ошибки с статусом 400
          const errorData = error.response.data;
          if (errorData && errorData.non_field_errors) {
            const errorMessage = errorData.non_field_errors;
            setErrors(errorMessage);
          }
        }
      });
  };
  const tileDisabled = ({ date }) => {
    const today = new Date();
    date.setHours(23, 59, 59, 0);
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
    const targetTimezone = "Europe/Podgorica";
    const currentDateInTargetTimezone = moment
      .tz(targetTimezone)
      .format("DD-HH");
    const currentHour = parseInt(currentDateInTargetTimezone.split("-")[1], 10);
    const currentDay = parseInt(currentDateInTargetTimezone.split("-")[0], 10);
    const pastTimes = times.filter((time) => {
      const timeHour = parseInt(time.split(":")[0], 10);
      return newDate[0].getDate() === currentDay && timeHour < currentHour;
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
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
    const body = document.body;
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
          <Link to="/about">Go to Main</Link>
        </div>
      ) : (
        <img src={dogGif} className="img-loading" alt="" />
      )}
      {isModal ? (
        <div className="modal">
          <ul className="errors">
            {errors.map((error, index) => (
              <li key={index} className="errors__item">
                {error}
              </li>
            ))}
          </ul>
          <img className="img-close" src={closeSvg} />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Main;
