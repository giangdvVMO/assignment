import React, { useContext, useEffect, useState } from 'react';
import { message, Segmented, Spin, Table, Tag } from 'antd';
import { serverURL } from '../../configs/server.config';
import { UserContext } from '../User/UserProvider';
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';
import { openNotificationWithIcon } from '../../common/service';
import '../../styles/statistic.css'
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export const StatisticCompany = () => {
  const {user, changeUser, token} = useContext(UserContext); 
  const [applyTotal, setApplyTotal] = useState(0);
  const [viewsTotal, setViewsTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [recruit, setRecruit] = useState([]);
  const navigate = useNavigate();
  const now = new Date();
 // console.log(now);

  //fetch user
  const fetchUser = async () => {
    const tokenx = token ? token : window.localStorage.getItem("accessToken");
    const id = decodeToken(tokenx).sub;
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
        if (!result || result.role !== "company") {
            openNotificationWithIcon('warning', 'Cảnh báo', 'Bạn ko có quyền xem trang này')
          navigate("/");
        }
        changeUser({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };
  const calculate = (recruitList)=>{
    setCount(recruitList.length);
    let countApply = 0;
    let countViews = 0;
    recruitList.forEach(item =>{
        countApply = countApply + item.apply.length;
        if(item.views.length){
            item.views.forEach(element => {
                countViews=countViews+ element.views;
            });
        }
       
    })
    setApplyTotal(countApply);
    setViewsTotal(countViews);
  }
  //FETCHCV
  async function fetchStatistic() {
    if(user){
   // console.log("fetchCV");
    const url = serverURL + "recruit/statistic/" + user._id;
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
        calculate(result.data);
        setRecruit([...result.data ]);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
}
  }
  useEffect(()=>{fetchUser()},[])
  useEffect(()=>{fetchStatistic()},[user]);

  const sortView = (a,b)=>{
    let countViewsA = 0;
    let countViewsB = 0;
            if(a.views.length){
                a.views.forEach(element => {
                    countViewsA=countViewsA+ element.views;
                });
            }
            if(b.views.length){
              b.views.forEach(element => {
                  countViewsB=countViewsB+ element.views;
              });
            }
            return countViewsA - countViewsB
  }
  const columns = [
    {
      title: "Tiêu đề bài đăng",
      key: "com_name",
      render: (_, record) => (
        <p>{record.title}</p>
      ),
    },
    {
      title: "Trạng thái",
      key: "address",
      render: (_, record) => {
        return (new Date(record.end_date) < now? 
        <Tag icon={<ClockCircleOutlined />} color="default">Hết hạn</Tag>
        :
        record.status? 
        <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>
        :
        <Tag icon={<ExclamationCircleOutlined />} color="warning">Chưa duyệt</Tag>
      )
      }
    },
    {
      title: "Số lượt xem",
    //   dataIndex: "views",
      key: "views",
      render: (_, record) => {
            let countViews = 0;
            if(record.views.length){
                record.views.forEach(element => {
                    countViews=countViews+ element.views;
                });
            }
            return countViews
      },
      sorter:(a,b)=>{
        return sortView(a,b);
      }
    },
    {
      title: "Số lượt apply",
      key: "apply",
      render: (_, record) => (
        <p>{record.apply.length}</p>
      ),
    },
  ];

  if(user){
  return (
    <>
        <div className='statistic-company-container'>
            <div className='statistic_container'>
                <div className='view-count_container'>
                    <div>SỐ BÀI TUYỂN DỤNG</div>
                </div>
                <div className='view-count_container'>
                    <div className='statistic-number'>
                    <div>
                        {count}
                    </div>
                    </div>
                </div>
            </div>
            <div className='statistic_container-company'>
                <div className='view-count_container'>
                    <div>TỔNG SỐ LƯỢT XEM</div>
                </div>
                <div className='view-count_container'>
                    <div className='statistic-number'>
                    <div>
                        {viewsTotal}
                    </div>
                    </div>
                </div>
            </div>
            <div className='statistic_container-company'>
                <div className='view-count_container'>
                    <div>TỔNG SỐ ỨNG TUYỂN</div>
                </div>
                <div className='view-count_container'>
                    <div className='statistic-number'>
                    <div>
                        {applyTotal}
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='table-statistic-container-company'>
            <div className='title-statistic-company'>Chi tiết thống kê</div>
            <Table
                pagination={false}
                dataSource={recruit}
                columns={columns}
                scroll={{
                  x: 400,
                  y: 400,
                }}
              />
        </div>
    </>
  )
  }
};