import "../components/Login.scss";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLoginFocused, setLoginFocused] = useState(false);
  const [isPassFocused, setPassFocused] = useState(false);
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const loginRef = useRef(null);
  const passRef = useRef(null);
  const navigate = useNavigate();
  const [cookieAccess, setCookieAccess, removeCookieAccess] = useCookies([
    "access",
  ]);
  const [cookieRefresh, setCookieRefresh, removeCookieRefresh] = useCookies([
    "resfresh",
  ]);

  const authorization = (event) => {
    event.preventDefault();
    const login = loginRef.current.value;
    const pass = passRef.current.value;
    axios
      .post("https://monya.pythonanywhere.com/api/staff/obtain-pair", {
        username: login,
        password: pass,
      })
      .then((response) => {
        if (response.status === 200) {
          setCookieAccess(response.data.access);
          setCookieRefresh(response.data.refresh);
          navigate("/admin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

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
