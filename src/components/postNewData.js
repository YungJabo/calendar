import axios from "axios";
export const postNewDataReservation = async (id, newReservation, access) => {
  try {
    console.log(1);
    const response = await axios.patch(
      `https://monya.pythonanywhere.com/api/staff/reservations/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
        start_date: newReservation.start_date,
        end_date: newReservation.end_date,
        phone: newReservation.phone,
        telegram: newReservation.telegram,
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
