import { Image, message, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { UserContext } from "../User/UserProvider";
import "../../styles/manager-page.css";
import { serverURL } from "../../configs/server.config";
import '../../styles/news.css'
import { DateToShortStringDate } from "../../common/service";
import {
  EyeOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

export const ViewDetail = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [newsDetail, setNewsDetail] = useState('');
  const [listNews, setListNews] = useState([]);

  const {id} = useParams();

  async function fetchListNews() {
    if(user&&newsDetail){
        let query = "?status=1&&except_id="+newsDetail._id+"&&field="+newsDetail.id_fields;
        // query = search !== "" ? query + "&search=" + search : query;
       
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

  const fetchNews = async ()=>{
    if(user&&id){
        const url = serverURL + "news/" + id;
        try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (response.status !== 200) {
            message.error("Lỗi hệ thống load news!");
        } else {
           // console.log("user fetch to set role", result);
           // console.log("result.data",result.data)

            if (!result) {
            // message.warn("Bạn ko có quyền xem trang này");
            // navigate("/");
            }else{
                setNewsDetail({ ...result.data });
            }
        }
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
        const ids = decodeToken(tokenx).sub;
        const url = serverURL + "account/" + ids;
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

  useEffect(() => {
    fetchUser();
  }, [user]);
  useEffect(()=>{fetchNews()}, [user])
  useEffect(() => {
    fetchListNews();
  }, [user, newsDetail]);

  if(user&&newsDetail){
    return (
      <>
        <div className="banner-news">
          <div className='image-banner-news-container'><Image className="image-banner-news" src={newsDetail.thumnail} /></div>
          <div className="title-news-banner">{newsDetail.title}</div>
        </div>
          <div className="banner-news-bottom">
              <div className="banner-news-bottom-left">Tác giả :{newsDetail.account.fullname}</div>
              <div className="banner-news-bottom-right">Ngày đăng: {DateToShortStringDate(newsDetail.create_date)}</div>
          </div>
          <div className='content-detail-news'>
            <div dangerouslySetInnerHTML={{ __html: newsDetail.content }}/>
          </div>

        <div className='relative-news'>
          <div className='title-relative-news-container'>Các bài viết liên quan</div>
          <div className='underline-relative-news'></div>
          <div className='relative-news-container'>
                {
                    listNews.map((item)=>{
                        return (
                            <div className="news-detail-container">
                                <Image className="thumnail" src={item.thumnail}/>
                                <Link to={`../news-detail/${item._id}`}><div className="title-thumnail">{item.title}</div></Link>
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
      </>
    )
  }else{
      return <div className="spin-container">
      <Spin />
    </div>;
  }
};
