import { useEffect, useRef, useState } from "react";
import "../components/Admin.scss";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkCookie } from "./checkCookie";
import "./Admin.scss";
import dogGif from "../assets/dog.gif";
import { format } from "date-fns";
import closeSvg from "../assets/close.svg";
import okSvg from "../assets/ok.svg";
import { postNewDataReservation } from "./postNewData";
import { getProfile } from "./getProfile";

function Admin() {
  const [cookie, setCookie, removeCookie] = useCookies(["auth"]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const start_dateRef = useRef(null);
  const end_dateRef = useRef(null);
  const phoneRef = useRef(null);
  const tgRef = useRef(null);

  const getReservations = async () => {
    await checkCookie(
      cookie.access,
      cookie.refresh,
      setCookie,
      removeCookie,
      navigate
    );
    const response = await getProfile(cookie.access);
    const reservations = response.data.map((reservation) => {
      return {
        ...reservation,
        end_date: format(new Date(reservation.end_date), "yyyy-MM-dd HH:mm"),
        start_date: format(
          new Date(reservation.start_date),
          "yyyy-MM-dd HH:mm"
        ),
      };
    });
    console.log(reservations);
    setReservations(reservations);
    setIsLoading(false);
  };
  const closeModal = () => {
    setIsModal(false);
  };
  const saveData = async () => {
    setIsModal(false);
    setIsLoading(true);
    await checkCookie(
      cookie.access,
      cookie.refresh,
      setCookie,
      removeCookie,
      navigate
    );

    const newReservation = {
      end_date: end_dateRef.current.value,
      start_date: start_dateRef.current.value,
      phone: phoneRef.current.value,
      telegram: tgRef.current.value,
    };
    const response = await postNewDataReservation(
      start_dateRef.current.getAttribute("data-id"),
      newReservation,
      cookie.access
    );
    console.log(response);
  };

  const changeData = (reservation) => {
    start_dateRef.current.value = reservation.start_date;
    start_dateRef.current.setAttribute("data-id", reservation.id);
    end_dateRef.current.value = reservation.end_date;
    phoneRef.current.value = reservation.phone;
    tgRef.current.value = reservation.telegram;
    setIsModal(true);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!cookie.access || !cookie.refresh) {
      navigate("/login");
    } else {
      getReservations();
    }
  }, []);
  return (
    <>
      {!isLoading ? (
        <div className="data">
          <ul className="data__header">
            <li className="data__header__item">
              <div className="data__header__text">Время заезда</div>
            </li>
            <li className="data__header__item">
              <div className="data__header__text">Время отъезда</div>
            </li>
            <li className="data__header__item">
              <div className="data__header__text">Телефон</div>
            </li>
            <li className="data__header__item">
              <div className="data__header__text">Телеграм</div>
            </li>
            <li className="data__header__item">
              <div className="data__header__text"></div>
            </li>
          </ul>
          <ul className="data_body">
            {reservations.map((reservation, index) => (
              <li
                className="data__body__item"
                key={index}
                data-id={reservation.id}
              >
                <div className="data__body__data-block">
                  <div className="data__body__text">
                    {reservation.start_date}
                  </div>
                  <div className="data__body__text">{reservation.end_date}</div>
                  <div className="data__body__text">{reservation.phone}</div>
                  <div className="data__body__text">{`${
                    reservation.telegram ? reservation.telegram : "-"
                  }`}</div>
                  <div className="buttons">
                    <button className="button button--del">del</button>
                    <button
                      className="button button--del"
                      onClick={() => changeData(reservation)}
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <img src={dogGif} className="img-loading" alt="" />
      )}
      <div className={`modal ${isModal ? "modal--active" : ""}`}>
        <div
          className={`modal__content ${
            isModal ? "modal__content--active" : ""
          }`}
        >
          <div className="modal__edit">
            <div className="modal__input-block">
              <span>Время заезда:</span>
              <input type="datetime-local" name="" id="" ref={start_dateRef} />
            </div>
            <div className="modal__input-block">
              <span>Время отъезда:</span>
              <input type="datetime-local" name="" id="" ref={end_dateRef} />
            </div>
            <div className="modal__input-block">
              <span>Телефон:</span>{" "}
              <input type="tel" name="" id="" ref={phoneRef} />
            </div>
            <div className="modal__input-block">
              <span>Телеграм:</span>
              <input type="text" name="" id="" ref={tgRef} />
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__confirm" onClick={saveData}>
              <img src={okSvg} alt="" className="img-ok" />
            </button>
            <button
              className="modal__close modal__close--admin"
              onClick={closeModal}
            >
              <img className="img-close" src={closeSvg} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Admin;
