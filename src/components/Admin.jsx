import { useEffect } from "react";
import "../components/Admin.scss";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookies.auth) {
      navigate("/login");
    }
  }, []);
  return <>Admin</>;
}
export default Admin;
