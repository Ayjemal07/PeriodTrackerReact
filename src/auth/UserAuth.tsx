import { createContext, useContext, useState } from 'react'

interface UserAuthContextType{
  isLoggedIn: boolean;
  setToken: (token: string)=> void;
  token: string;
}

const initialValue={
  isLoggedIn: false,
  setToken: (_token: string)=> {},
  token: ""
}

const UserAuth = createContext<UserAuthContextType> (initialValue);



export function useAuth() {
  return useContext(UserAuth);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const[token,_setToken]=useState("")

  const setToken = (token:string) => {
    if (token) {
      setIsLoggedIn(true);
      _setToken(token)
      // You can also store the token in localStorage/sessionStorage
    } else {
      setIsLoggedIn(false);
    }
  };

  return (
    <UserAuth.Provider value={{ isLoggedIn, setToken,token }}>
      {children}
    </UserAuth.Provider>
  );
};

export default UserAuth
