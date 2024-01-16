import "../components/Login.scss";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import closeSvg from "../assets/close.svg";
import dogGif from "../assets/dog.gif";
import { checkCookie } from "./checkCookie";

function Login() {
  const [isLoginFocused, setLoginFocused] = useState(false);
  const [isPassFocused, setPassFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const loginRef = useRef(null);
  const passRef = useRef(null);
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies(["auth"]);
  const [error, setError] = useState(false);
  const handleLoginChange = () => {
    const value = loginRef.current.value;
    setLogin(value);
    setError(false);
  };

  const handlePassChange = () => {
    const value = passRef.current.value;
    setPass(value);
    setError(false);
  };
  const authorization = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const login = loginRef.current.value;
    const pass = passRef.current.value;

    axios
      .post("https://monya.pythonanywhere.com/api/staff/obtain-pair", {
        username: login,
        password: pass,
      })
      .then((response) => {
        if (response.status === 200) {
          setCookie("access", response.data.access);
          setCookie("refresh", response.data.refresh);
          navigate("/admin");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
        setIsLoading(false);
        return;
      });
  };
  useEffect(() => {
    setIsLoading(true);
    if (!cookie.access || !cookie.refresh) {
      navigate("/login");
    } else {
      navigate("/admin");
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {!isLoading ? (
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
                onChange={handleLoginChange}
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
                onChange={handlePassChange}
              />
            </div>
            <button
              type="submit"
              className="button button--login"
              onClick={authorization}
            >
              Авторизация
            </button>
            <span className="error">
              {error ? "Вы ввели неправильный логин или пароль" : ""}
            </span>
          </form>
        </div>
      ) : (
        <img src={dogGif} className="img-loading" alt="" />
      )}
    </>
  );
}
export default Login;
