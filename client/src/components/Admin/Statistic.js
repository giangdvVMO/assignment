import { useEffect, useState } from "react"
import { openNotificationWithIcon } from "../../common/service";
import { serverURL } from "../../configs/server.config";
import { PieCount } from "./PieCount";

export const StatisticAdmin = ()=>{
    const [student, setStudent] = useState({accept:0,unaccept:0});
    const [company, setCompany] = useState({accept:0,unaccept:0});
    const [recruit, setRecruit] = useState({accept:0,unaccept:0});
    const fetchStudent = async()=>{
        const url = serverURL + "student/statistic";
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        //const response = await axios.post(url, JSON.stringify(account),{})
        if (response.status !== 200) {
          openNotificationWithIcon('error','Thông báo',"Lỗi hệ thống!");
        } else {
            const result = await response.json();
          setStudent({...result.data})
        }
      } catch (err) {
       // console.log(err);
      }
    }

    const fetchCompany = async()=>{
        const url = serverURL + "company/statistic";
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        //const response = await axios.post(url, JSON.stringify(account),{})
        if (response.status !== 200) {
          openNotificationWithIcon('error','Thông báo',"Lỗi hệ thống!");
        } else {
            const result = await response.json();
          setCompany({...result.data})
        }
      } catch (err) {
       // console.log(err);
      }
    }

    const fetchRecruit = async()=>{
        const url = serverURL + "recruit/statistic";
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        //const response = await axios.post(url, JSON.stringify(account),{})
        if (response.status !== 200) {
          openNotificationWithIcon('error','Thông báo',"Lỗi hệ thống!");
        } else {
            const result = await response.json();
          setRecruit({...result.data})
        }
      } catch (err) {
       // console.log(err);
      }
    }

    useEffect(()=>{fetchStudent()},[]);
    useEffect(()=>{fetchCompany()},[]);
    useEffect(()=>{fetchRecruit()},[]);

    return (
        <div className="statistic-container-admin">
            <div className="content-container">
                <div className="title-statistic">Thống kê Sinh viên</div>
                <PieCount accept={student.accept} unaccept={student.unaccept}/>
            </div>
            <div className="content-container">
                <div className="title-statistic">Thống kê Doanh nghiệp</div>
                <PieCount accept={company.accept} unaccept={company.unaccept}/>
            </div>
            <div className="content-container">
                <div className="title-statistic">Thống kê Bài đăng tuyển dụng</div>
                <PieCount accept={recruit.accept} unaccept={recruit.unaccept}/>
            </div>
        </div>
    )
}