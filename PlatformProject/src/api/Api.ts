import axios from "axios";
import type { ProductAnalysisDetailDTO, UserJoinDTO } from "../types/DTO";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axios.defaults.withCredentials = true;

export const priceAPI = {
  getPopularList: async (region: string = "서울", isAll: boolean = true) => {
    const res = await api.get(
      `/products/popular?region=${region}&isAll=${isAll}`,
    );
    return res.data;
  },
  getFluctuationList: async (
    region: string = "서울",
    isAll: boolean = true,
  ) => {
    const res = await api.get(
      `/products/fluctuation?region=${region}&isAll=${isAll}`,
    );
    return res.data;
  },
  getProductDetail: async (
    productId: number | string,
    region: string = "서울",
  ) =>
    api
      .get<ProductAnalysisDetailDTO>(`/products/detail/${productId}`, {
        params: { region },
      })
      .then((res) => res.data),

  getSearch: async (keyword: string, region: string = "서울") => {
    const res = await api.get("/products/search", {
      params: { keyword, region },
    });
    return res.data;
  },

  getTopBargain: async (region: string = "서울") => {
    const res = await api.get(`/products/bargainTop`, { params: { region } });
    return res.data;
  },

  getBargainList: async (region: string = "서울") => {
    const res = await api.get(`/products/bargainList`, { params: { region } });
    return res.data;
  },
};

export const userAPI = {
  join: async (data: UserJoinDTO) => {
    return await api.post("/auth/join", data);
  },

  checkId: async (id: string) => {
    const res = await api.get("/auth/checkId", { params: { id } });
    return res.data;
  },

  checkEmail: async (email: string) => {
    const res = await api.get("/auth/checkEmail", { params: { email } });
    return res.data;
  },

  login: async (loginData: { id: string; password: string }) => {
    return await api.post("/auth/login", loginData);
  },

  getMyPageData: async (userIdx: number) => {
    const res = await api.get(`/auth/mypage/${userIdx}`);
    return res.data;
  },

  updateProfile: async (
    userIdx: number,
    name: string,
    userRegion: string,
    password: string,
    email: string,
  ) => {
    const res = await api.put(`/auth/mypage/${userIdx}/profile`, {
      name,
      userRegion,
      password,
      email,
    });
    return res.data;
  },

  toggleFav: async (userIdx: number, productId: number) => {
    const res = await api.post(`/auth/mypage/${userIdx}/favorite/${productId}`);
    return res.data;
  },

  checkFavStatus: async (userIdx: number, productId: number) => {
    const res = await api.get(
      `/auth/mypage/${userIdx}/favorite-check/${productId}`,
    );
    return res.data;
  },
};
