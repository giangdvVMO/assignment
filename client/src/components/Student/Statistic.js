import React, { useContext, useEffect, useState } from 'react';
import { message, Segmented, Spin } from 'antd';
import { serverURL } from '../../configs/server.config';
import { UserContext } from '../User/UserProvider';
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';
import { openNotificationWithIcon } from '../../common/service';
import '../../styles/statistic.css'
import { CvStatistic } from './CVStatistic';
import { ApplyStatistic } from './ApplyStatistic';

export const Statistic = () => {
  const {user, changeUser, token} = useContext(UserContext); 
  const [value, setValue] = useState('CV');
  const [CV, setCV] = useState();
  const navigate = useNavigate();

  //fetch user
  const fetchUser = async () => {
   // console.log("fetch user account");
    const tokenx = token ? token : window.localStorage.getItem("accessToken");
   // console.log("tokenx", tokenx);
    const id = decodeToken(tokenx).sub;
   // console.log("id", id);
    const url = serverURL + "account/" + id;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status !== 200) {
        message.error("Lỗi hệ thống load user!");
      } else {
       // console.log("user fetch to set role", result);
        if (!result || result.role !== "student") {
            openNotificationWithIcon('warning', 'Cảnh báo', 'Bạn ko có quyền xem trang này')
          navigate("/");
        }
        changeUser({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };
  //FETCHCV
  async function fetchCV() {
    if(user){
   // console.log("fetchCV");
    const url = serverURL + "cv-view/list/" + user._id;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log("CV", result);
      if (response.status !== 200) {
        message.error(result.message);
      } else {
        setCV({...result.data });
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
}
  }
  useEffect(()=>{fetchUser()},[])
  useEffect(()=>{fetchCV()},[value, user]);
  if(CV&&user)
  return (
    <>
    <div className='segment'>
      <Segmented className='segment-content' block options={['CV', 'Tuyển dụng']} value={value} onChange={setValue} />
    </div>
        {
        value==='CV'&&CV?
            <CvStatistic CV={CV} />
        :
        value==='Tuyển dụng'?
            <ApplyStatistic user={user} />
        :
        <div className="spin-container">
            <Spin size={200} />
        </div>
        }
    </>
  )
  else
    return <div className="spin-container">
              <Spin size={200} />
            </div>
};