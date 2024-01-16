import axios from "axios";

export const getProfile = async (access) => {
  try {
    const response = await axios.get(
      "http://monya.pythonanywhere.com/api/staff/reservations/?type=active&ordering=start_date",
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};
