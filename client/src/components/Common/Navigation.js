import { useContext, useEffect } from 'react';
import { serverURL } from '../../configs/server.config';
import '../../styles/nav.css';
import { UserContext } from '../User/UserProvider';
import Account from "./Account";
import { MenuNav } from './MenuNav';
import { Notification } from './Notification';
import { SignInUp } from './SignInUp';
import {decodeToken , isExpired} from 'react-jwt';
import { message } from 'antd';

const Nav = () => {
    const { user, changeUser , token, changeToken} = useContext(UserContext)
   // console.log("accessToken Nav",token)
    // const fetchUser = async()=>{
    //          // console.log('fetch user account')
    //          // console.log('token', token);

    //           const tokenx = token? token: window.localStorage.getItem('accessToken');
    //           const id = decodeToken(tokenx).sub;
    //          // console.log("id",id);
    //           const url = serverURL + 'account/'+id;
    //               try {
    //                   const response = await fetch(url, {
    //                       method: 'GET',
    //                       headers: {
    //                           'Content-Type': 'application/json',
    //                       },
    //                   }
    //                   );
    //                   const result = await response.json();
    //                   if(response.status!==200){
    //                       message.error("Lỗi hệ thống load user!");
    //                   }else{
    //                       changeUser({...result})
    //                   }
    //               }
    //               catch (err) {
    //                  // console.log(err);
    //               }
    //       }
    //       useEffect(()=>{fetchUser()},[]);
    return (
        <div className="nav">
            <div className="left-nav"><MenuNav /></div>
            <div className="right-nav">
                {
                    user ?
                        (<>
                            <Notification />
                            <Account />
                        </>) :
                        (<SignInUp />)
                }
            </div>
        </div>
    )
}

export default Nav;