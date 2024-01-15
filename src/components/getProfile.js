import axios from "axios";

export const getProfile = async (access) => {
  try {
    const response = await axios.get(
      "https://monya.pythonanywhere.com/api/staff/profile",
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
  } catch (error) {
    return;
  }
};
