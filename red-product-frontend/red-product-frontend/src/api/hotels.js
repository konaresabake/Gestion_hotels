import client from "./client";

export const listHotels = () => client.get("/hotels/");

export const getHotel = (id) => client.get(`/hotels/${id}/`);

export const createHotel = (formData) =>
  client.post("/hotels/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateHotel = (id, formData) =>
  client.patch(`/hotels/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteHotel = (id) => client.delete(`/hotels/${id}/`);
