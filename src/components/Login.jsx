import "../components/Login.scss";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

function Login() {
  const loginRef = useRef(null);
  const passRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  const getToken = async () => {
    await axios
      .get("https://monya.pythonanywhere.com/api/v1/drf-auth/login/")
      .then((response) => {
        const csrfToken = response.headers["set-cookie"].find((cookie) =>
          cookie.includes("csrftoken")
        );
        console.log(csrfToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const authorization = (event) => {
    event.preventDefault();
    const login = loginRef.current.value;
    const pass = passRef.current.value;
    axios
      .post("https://monya.pythonanywhere.com/front_api/reserve", {
        username: login,
        password: pass,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    // setCookie("auth", "cookieValue", { path: "/" });
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <>
      <div className="login">
        <form className="form">
          <div className="input-block">
            <label htmlFor="">Логин</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Введите логин"
              ref={loginRef}
            />
          </div>
          <div className="input-block">
            <label htmlFor="">Пароль</label>
            <input
              type="password"
              name=""
              id=""
              placeholder="Введите пароль"
              ref={passRef}
            />
          </div>
          <button
            type="submit"
            className="button button--login"
            onClick={authorization}
          >
            Авторизация
          </button>
        </form>
      </div>
    </>
  );
}
export default Login;
