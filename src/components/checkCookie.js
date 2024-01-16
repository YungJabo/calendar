import axios from "axios";

const getNewCookie = async (refresh, setCookie, removeCookie, navigate) => {
  try {
    const response = await axios.post(
      "https://monya.pythonanywhere.com/api/staff/refresh-token",
      {
        refresh: refresh,
      }
    );
    setCookie("access", response.data.access);
    setCookie("refresh", response.data.refresh);
  } catch (error) {
    removeCookie("access");
    removeCookie("refresh");
    navigate("/login");
    return;
  }
};

export const checkCookie = async (
  access,
  refresh,
  setCookie,
  removeCookie,
  navigate
) => {
  try {
    await axios.post(
      "https://monya.pythonanywhere.com/api/staff/verify-token",
      {
        token: access,
      }
    );
  } catch (error) {
    await getNewCookie(refresh, setCookie, removeCookie, navigate);
    return;
  }
};
