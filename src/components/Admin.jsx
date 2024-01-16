import { useEffect, useState } from "react";
import "../components/Admin.scss";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkCookie } from "./checkCookie";
import "./Admin.scss";

function Admin() {
  const [cookie, setCookie, removeCookie] = useCookies(["auth"]);
  const [reservations, setReservations] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!cookie.access || !cookie.refresh) {
      navigate("/login");
    } else {
      checkCookie(
        cookie.access,
        cookie.refresh,
        setCookie,
        removeCookie,
        navigate
      );
    }
  }, []);
  return (
    <>
      <div className="data">
        <ul className="data__header">
          <li className="data__header__item">
            <div className="data__header__text">Колонка 1</div>
          </li>
          <li className="data__header__item">
            <div className="data__header__text">Колонка 2</div>
          </li>
          <li className="data__header__item">
            <div className="data__header__text">Колонка 3</div>
          </li>
          <li className="data__header__item">
            <div className="data__header__text"></div>
          </li>
        </ul>
        <ul className="data_body">
          <li className="data__body__item">
            <div className="data__body__data-block">
              <div className="data__body__text">1 января 10:00</div>
              <div className="data__body__text">4 января 12:00</div>
              <div className="data__body__text">Значение 3</div>
              <div className="buttons">
                <button className="button button--del">del</button>
                <button className="button button--del">del</button>
              </div>
            </div>
          </li>
          <li className="data__body__item">
            <div className="data__body__data-block">
              <div className="data__body__text">Текст</div>
              <div className="data__body__text">Текст</div>
              <div className="data__body__text">Текст11111111111111111</div>
              <div className="buttons">
                <button className="button button--del">del</button>
                <button className="button button--del">del</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
export default Admin;
