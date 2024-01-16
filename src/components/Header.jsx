import { Link } from "react-router-dom";
import "./Header.scss";

function Header({ activeLink }) {
  return (
    <>
      <div className="header">
        <ul className="header__links">
          <li className="header__link">
            <Link to={"/"}>Бронирование</Link>
          </li>
          <li className="header__link">
            <Link to={"/reviews"}>Отзывы</Link>
          </li>
          <li className="header__link">
            <Link to={"/about"}>О нас</Link>
          </li>
        </ul>
        <Link to={"/admin"} className="header__link header__link--right">
          Admin Panel
        </Link>
      </div>
    </>
  );
}

export default Header;
