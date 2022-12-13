import { message } from "antd";
import { createContext, useEffect, useState } from "react";
import {decodeToken , isExpired} from 'react-jwt';
import { serverURL } from "../../configs/server.config";

const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const [token, setToken] = useState(window.localStorage.getItem('accessToken'));
    const [change, setChange] = useState(false);
    const fetchUser = async()=>{
       // console.log('fetch user account')
        const tokenx = token? token: window.localStorage.getItem('accessToken');
       // console.log('tokenx', tokenx);
        const id = decodeToken(tokenx).sub;
       // console.log("id",id);
        const url = serverURL + 'account/'+id;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
                if(response.status!==200){
                    message.error("Lỗi hệ thống load user!");
                }else{
                    changeUser({...result})
                }
            }
            catch (err) {
               // console.log(err);
            }
    }
    useEffect(()=>{fetchUser()},[]);

    const changeUser = (user) => {
        setUser((prev) => { return { ...user } });
    }
    const changeToken = (token) => {
        setToken(token);
    }
    return (
        <UserContext.Provider value={{ user, changeUser, token, changeToken, change, setChange }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext };