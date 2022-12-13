import { Table } from "antd"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { serverURL } from "../../configs/server.config";

export const ApplyStatistic = ({user})=>{
    const [listApply, setListApply] = useState([]);
    const [listLetter, setListLetter] = useState([]);

    const fetchListApply = async ()=>{
      if (user) {
        try {
          const url = serverURL + "apply/statistic?id_student=" + user._id;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (response.status !== 200) {
           // console.log("Lỗi hệ thống!");
            // message.error("Lỗi hệ thống!");
          } else {
           // console.log("result", result);
             // console.log("fetch student", result.data);
              setListApply( [...result.data] );
            }
        } catch (err) {
         // console.log(err);
        }
      }
    }

    const fetchListLetter = async ()=>{
      if (user) {
        try {
          const url = serverURL + "letter-student/statistic?id_student=" + user._id;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (response.status !== 200) {
           // console.log("Lỗi hệ thống!");
            // message.error("Lỗi hệ thống!");
          } else {
           // console.log("result", result);
             // console.log("fetch student", result.data);
              setListLetter([ ...result.data ]);
            }
        } catch (err) {
         // console.log(err);
        }
      }
    }

    useEffect(()=>{fetchListApply()},[]);
    useEffect(()=>{fetchListLetter()},[]);
    const columnsLetter = [
        {
          title: "Tên công ty",
          key: "com_name",
          render: (_, record) => (
            <p>{record.company.com_name}</p>
          ),
        },
        {
          title: "Địa chỉ",
          key: "address",
          render: (_, record) => (
            <p>{record.company.address}</p>
          ),
        },
        {
          title: "Hành động",
          key: "action",
          render: (_, record) => (
            <Link to={`../company/${record.company._id}`}>Xem chi tiết</Link>
          ),
          fixed: "right",
        },
      ];

      const columnsApply= [
        {
          title: "Tên bài đăng",
          key: "recruit",
          render: (_, record) => (
            <p>{record.recruit.title}</p>
          ),
        },
        {
          title: "Tên công ty",
          key: "com_name",
          render: (_, record) => (
            <p>{record.company.com_name}</p>
          ),
        },
        {
          title: "Địa chỉ",
          key: "address",
          render: (_, record) => (
            <p>{record.company.address}</p>
          ),
        },
        {
          title: "Hành động",
          key: "action",
          render: (_, record) => (
            <Link to={`../company/${record.company._id}`}>Xem chi tiết</Link>
          ),
          fixed: "right",
        },
      ];
    return (
        <div className='statistic_container'>
          <div>
            <div className='view-count_container'>
                <div>SỐ BÀI ĐĂNG ĐÃ ỨNG TUYỂN</div>
              </div>
            <div className='view-count_container'>
                <div className='statistic-number'>
                  <div>
                    {listApply.length}
                  </div>
                </div>
            </div>

            <div className='view-count_container'>
                <div>DANH SÁCH CHI TIẾT BÀI ĐĂNG ĐÃ ỨNG TUYỂN</div>
                </div>
            <div className='table-statistic'>
              <Table
              pagination={false}
                dataSource={listApply} 
                columns={columnsApply}
                scroll={{
                  x: 400,
                  y: 400,
                }}
              />
            </div>
          </div>
          <div>
            <div className='view-count_container'>
                <div>SỐ THƯ MỜI TUYỂN DỤNG</div>
              </div>
            <div className='view-count_container'>
                <div className='statistic-number'>
                  <div>
                    {listLetter.length}
                  </div>
                </div>
            </div>

            <div className='view-count_container'>
                <div>DANH SÁCH CHI TIẾT DOANH NGHIỆP</div>
                </div>
            <div className='table-statistic'>
              <Table
              pagination={false}
                dataSource={listLetter} 
                columns={columnsLetter}
                scroll={{
                  x: 400,
                  y: 400,
                }}
              />
            </div>
          </div>
          </div>
    )
}