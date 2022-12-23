import axios from "axios";
import { store } from "../redux/app/store";
import { logOutUser } from "../redux/features/authSlice";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers : {
        'Content-Type': 'application/json',
         'Accept' : 'application/json',
    },
    
});


axiosInstance.interceptors.request.use((config: any) => {
     
     if(config.headers["Authorization"]){
        config.headers["Authorization"] = null;
     }

     config.headers["Authorization"] = "Bearer " + store.getState().auth.accessToken;
     return config;
}, (error) => {

    Promise.reject(error)
})



axiosInstance.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest.isRetry = true;
            try {
                await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/refresh`,
                    {refreshToken: store.getState().auth.refreshToken}
                );

                return axiosInstance.request(originalRequest);
            } catch (err:any) {
                console.log(err.message);
            }
        }
        throw error;
    }
);


export default axiosInstance;


