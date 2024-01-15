import { useEffect } from "react";
import "../components/Admin.scss";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkCookie } from "./checkCookie";

function Admin() {
  const [cookie, setCookie, removeCookie] = useCookies(["auth"]);
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
  return <>Admin</>;
}
export default Admin;
