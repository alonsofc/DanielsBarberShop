import axios from "axios";
import { toast } from "./toastConfig.js";

// Instancia de Axios
const api = axios.create({ baseURL: process.env.VITE_API_BASE_URL });

// Método genérico GET
api.getRequest = async (url, onSuccess, onError, onFinally) => {
  try {
    const response = await api.get(url);

    if (response.status === 200) {
      if (onSuccess) onSuccess(response.data.data);
    } else toast.error(response.data.message + " (" + response.status + ")");
  } catch (error) {
    if (onError) onError(error);
    toast.error("Api error: " + error.message);
  } finally {
    if (onFinally) onFinally();
  }
};

// Método genérico PUT
api.putRequest = async (url, data, onSuccess, onError, onFinally) => {
  try {
    const response = await api.put(url, data);

    if (response.status === 200) {
      toast.success(response.data.message);
      if (onSuccess) onSuccess(response.data.data);
    } else toast.error(response.data.message + " (" + response.status + ")");
  } catch (error) {
    if (onError) onError(error);
    toast.error("Api error: " + error.message);
  } finally {
    if (onFinally) onFinally();
  }
};

// Método genérico POST
api.postRequest = async (url, data, onSuccess, onError, onFinally) => {
  try {
    const response = await api.post(url, data);

    if (response.status === 201) {
      toast.success(response.data.message);
      if (onSuccess) onSuccess(response.data.data);
    } else toast.error(response.data.message + " (" + response.status + ")");

    return response.data;
  } catch (error) {
    if (onError) onError(error);
    toast.error("Api error: " + error.message);
  } finally {
    if (onFinally) onFinally();
  }
};

// Método genérico DELETE
api.deleteRequest = async (url, onSuccess, onError, onFinally) => {
  try {
    const response = await api.delete(url);

    if (response.status === 200) {
      toast.success(response.data.message);
      if (onSuccess) onSuccess(response.data);
    } else toast.error(response.data.message + " (" + response.status + ")");
  } catch (error) {
    if (onError) onError(error);
    toast.error("Api error: " + error.message);
  } finally {
    if (onFinally) onFinally();
  }
};

export { api };
