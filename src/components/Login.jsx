import "../components/Login.scss";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

function Login() {
  const [isLoginFocused, setLoginFocused] = useState(false);
  const [isPassFocused, setPassFocused] = useState(false);
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const loginRef = useRef(null);
  const passRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  const getToken = async () => {
    await axios
      .get("https://monya.pythonanywhere.com/api/v1/drf-auth/login/", {
        withCredentials: true,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFTOKEN",
      })
      .then((response) => {
        console.log(response);
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
      .post("https://monya.pythonanywhere.com/api/v1/drf-auth/login/", {
        username: login,
        password: pass,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="login">
        <form className="form">
          <div className="input-block">
            <label
              htmlFor="login"
              className={`${
                isLoginFocused || (login && login.length > 0) ? "active" : ""
              }`}
            >
              Логин
            </label>
            <input
              type="text"
              name=""
              id="login"
              ref={loginRef}
              onFocus={() => setLoginFocused(true)}
              onBlur={() => setLoginFocused(false)}
              onChange={() => setLogin(loginRef.current.value)}
            />
          </div>
          <div className="input-block">
            <label
              htmlFor="pass"
              className={`${
                isPassFocused || (pass && pass.length > 0) ? "active" : ""
              }`}
            >
              Пароль
            </label>
            <input
              type="password"
              name="pass"
              id="pass"
              ref={passRef}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              onChange={() => setPass(passRef.current.value)}
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
