import axios from "axios";
export const deleteReservation = async (id, access) => {
  try {
    await axios.delete(
      `https://monya.pythonanywhere.com/api/staff/reservations/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
