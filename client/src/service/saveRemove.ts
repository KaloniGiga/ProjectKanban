import jwtDecode, {JwtPayload} from "jwt-decode";
import { Retryer } from "react-query/types/core/retryer";

export const saveToken = (accessToken:string, refreshToken:string) => {
     localStorage.setItem("accessToken", accessToken);
     localStorage.setItem("refreshToken", refreshToken);
};


export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const saveAccessToken = (accessToken: string) => {
   localStorage.setItem("accessItem", accessToken);
}


export const getTokens = () => {
  
  try {
     const accessToken = localStorage.getItem("accessToken");
     const refreshToken = localStorage.getItem("refreshToken");

     if(accessToken ){
      
     }
  } catch (error) {
    
  }

}