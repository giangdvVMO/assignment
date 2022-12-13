import { Button, Image, Input, message, Select, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { UserContext } from "../User/UserProvider";
import "../../styles/manager-page.css";
import {
  EyeOutlined,
  FieldTimeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { serverURL } from "../../configs/server.config";
import { DateToShortStringDate, postFields } from "../../common/service";
import '../../styles/news.css'

const { Option } = Select;
export const NewsView = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState(-1);
  const [search, setSearch] = useState("");
  const [listNews, setListNews] = useState([]);
  const [fields, setFields] = useState([]);
  const [field, setField] = useState([]);
  const [listHot, setListHot] = useState([]);
  const [listFresh, setListFresh] = useState([]);

  //fetch Fields
  async function fetchField() {
    const url = serverURL + "field";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 200) {
        message.error(result.message);
      } else {
        if (result.data === "empty") {
          const manuList = postFields();
          setFields(manuList);
        }
      setFields(result.data);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }

  async function fetchListNews() {
    if(user&&(search||field.length)){
        let query = "?1=1&status=1"
        // query = status !== -1 ? query + "&status=" + status : query;
        query = search !== "" ? query + "&search=" + search : query;
        query = field.length&&!field.includes(-1) ? query + "&field=" + field : query;
       // console.log('field', field)
        message.success('field', field)
        const url = serverURL + "news" + query;
       // console.log(query);
        try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (response.status !== 200) {
            message.error("Lỗi hệ thống!");
        } else {
           // console.log("result", result);
            setListNews(result.data);
        }
        } catch (err) {
       // console.log(err);
        }
    }
  }

  async function fetchListHot() {
    if(user){
        let query = "?status=1&&sort=views&&pageIndex=1&&pageSize=3";
        const url = serverURL + "news" + query;
       // console.log(query);
        try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (response.status !== 200) {
            message.error("Lỗi hệ thống!");
        } else {
           // console.log("result", result);
            setListHot(result.data);
        }
        } catch (err) {
       // console.log(err);
        }
    }
  }

  async function fetchListFresh() {
    if(user){
        let query = "?status=1&&sort=create_date&&pageIndex=1&&pageSize=3";
        const url = serverURL + "news" + query;
       // console.log(query);
        try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (response.status !== 200) {
            message.error("Lỗi hệ thống!");
        } else {
           // console.log("result", result);
            setListFresh(result.data);
        }
        } catch (err) {
       // console.log(err);
        }
    }
  }

  async function viewNews(id) {
    if(user){
      message.success('run')
        const url = serverURL + "news/views/"+ id;
        try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (response.status !== 200) {
            message.error("Không thể tăng views!");
        }else{
        message.success('run views')
        navigate(`../news-detail/${id}`)

        }
        // } else {
        //     //// console.log("result", result);
        //     fetchListFresh();
        // }
        } catch (err) {
       // console.log(err);
        }
    }
  }

  //fetch user
  const fetchUser = async () => {
    if(!user){
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
            if (!result) {
            message.warn("Bạn ko có quyền xem trang này");
            navigate("/");
            }
            changeUser({ ...result });
        }
        } catch (err) {
       // console.log(err);
        }
    }
  };

  const handleChangeField = (e) => {
   // console.log(e);
    const value = e.map((item) => {
      return item.value;
    });
    setField([...value]);
   // console.log('field-news', value)
  };

  useEffect(() => {
    fetchUser();
  }, [user]);
  useEffect(() => {
    fetchField();
  }, []);
  useEffect(() => {
    fetchListFresh();
  }, [user]);
  useEffect(() => {
    fetchListHot();
  }, [user]);
  useEffect(() => {
    fetchListNews();
  }, [user,status, search, field]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  if(user&&fields){
  return (
    <>
      <div className="banner-content">
        <div className="text-banner">Danh sách tin tức</div>
        <Image className="image-background-banner" src="https://i.ibb.co/6J065b3/Exciting-news-amico.png" preview={false}/>
      </div>
      {/* https://i.ibb.co/L5rDFrv/Resume-amico-1.png */}
      
      
      <div className="view-news-container">
        <div className="news-section-container">
            <div className="title-news-section">
                Tin nổi bật
            </div>
            <div className="underline-news"></div>
            <div className="news-cate-container">
                {
                    listHot.map((item)=>{
                        return (
                            <div className="news-detail-container">
                                <Image className="thumnail" src={item.thumnail}/>
                                <Link onClick={()=>{viewNews(item._id)}}><div className="title-thumnail">{item.title}</div></Link>
                                <div className="view-detail">
                                  <div className="view-count"><EyeOutlined className="icon-view-news"/>{item.views?item.views: 0}</div>
                                  <div className="view-date"><FieldTimeOutlined className="icon-view-news" />{DateToShortStringDate(item.create_date)}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        <div className="news-section-container">
            <div className="title-news-section">
                Tin mới nhất
            </div>
            <div className="underline-news"></div>
            <div className="news-cate-container">
                {
                    listFresh.map((item)=>{
                        return (
                            <div className="news-detail-container">
                                <Image className="thumnail" src={item.thumnail}/>
                                <Link onClick={()=>{viewNews(item._id)}}><div className="title-thumnail">{item.title}</div></Link>
                                <div className="view-detail">
                                  <div className="view-count"><EyeOutlined className="icon-view-news"/>{item.views?item.views: 0}</div>
                                  <div className="view-date"><FieldTimeOutlined className="icon-view-news" />{DateToShortStringDate(item.create_date)}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
     </div>
     <div className="title-find">Tìm kiếm bài đăng</div>
      <div className="container-filter">
      <div className="filter">
          <label className="label-filter">Lĩnh vực bài đăng:</label>
          <Select
            mode="multiple"
            value={field}
            defaultValue={-1}
            labelInValue="Lĩnh vực bài đăng"
            className="filter-content"
            onChange={handleChangeField}
          >
            <Option value={-1}>Tất cả</Option>
            {fields.map((fieldNews) => {
              return (
                <Option key={fieldNews._id} value={fieldNews._id}>
                  {fieldNews.nameField}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="filter">
          <label className="transparent">Tìm kiếm</label>
          <div className="search">
            <Input
              className="input search-input"
              placeholder="Nhập thông tin cần tìm"
              value={search}
              onChange={handleChangeSearch}
            ></Input>
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div className="news-cate-container">
                {
                    listNews.map((item)=>{
                        return (
                            <div className="news-detail-container margin-news">
                                <Image className="thumnail" src={item.thumnail}/>
                                <Link onClick={()=>{viewNews(item._id)}}><div className="title-thumnail">{item.title}</div></Link>
                                <div className="view-detail">
                                  <div className="view-count"><EyeOutlined className="icon-view-news"/>{item.views?item.views: 0}</div>
                                  <div className="view-date"><FieldTimeOutlined className="icon-view-news" />{DateToShortStringDate(item.create_date)}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
    </>
  )}
  else{
    return <div className="spin-container">
    <Spin />
  </div>;
  }
};
