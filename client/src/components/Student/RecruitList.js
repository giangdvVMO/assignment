import {
  Button,
  Image,
  Input,
  message,
  Pagination,
  Select,
  Spin,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { UserContext } from "../User/UserProvider";
import "../../styles/manager-page.css";
import { SearchOutlined } from "@ant-design/icons";
import { serverURL } from "../../configs/server.config";
import "../../styles/list.css";
import { DateToShortStringDate, openNotificationWithIcon, postFields } from "../../common/service";
import { CardList } from "../Common/Card";

const { Option } = Select;
export const RecruitListStudent = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const navigate = useNavigate();

  const [fields, setFields] = useState([]);
  const [field, setField] = useState([]);
  const [experience, setExperience] = useState(-1);
  const [search, setSearch] = useState("");
  const [listRecruit, setListRecruit] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setPageTotal] = useState(1);
  const [salary, setSalary] = useState(-1);

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
          const manuList = await postFields();
          setFields(manuList);
        }
      setFields(result.data);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }

  async function fetchListRecruit() {
    const date = DateToShortStringDate(new Date());
        const expired = date.split('/');
        const test = `${expired[1]}/${expired[0]}/${expired[2]}`
    let query = "?status=1&pageIndex=" + pageIndex + "&pageSize=" + pageSize+'&date='+test;;
    query = field.length && !field.includes(-1) ? query + "&field=" + field : query;
    query = experience !== -1 ? query + "&experience=" + experience : query;
    query = search !== "" ? query + "&search=" + search : query;
    query = salary !== -1 ? query + "&salary=" + salary : query;
    const url = serverURL + "recruit" + query;
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
        setPageTotal(result.total);
        setListRecruit(result.data);
      }
    } catch (err) {
     // console.log(err);
    }
  }

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
        if (!result || result.role !== "student") {
          message.warn("Bạn ko có quyền xem trang này");
          navigate("/");
        }
        changeUser({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };

  async function fetchStudent() {
    if (user) {
      try {
        const _id = user._id;
        const url = serverURL + "student/" + _id;
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
        if (result.data === "empty") {
            openNotificationWithIcon('warning', 'Cảnh báo', 'Bạn phải cập nhật thông tin sinh viên!')
            navigate("/student-profile");
          } else {
                if(result.data.status === false){
                    openNotificationWithIcon('warning', 'Cảnh báo', 'Thông tin của bạn chưa được duyệt nhé!')
                    navigate("/home");
                    return;
                }
            }
        }
      } catch (err) {
        message.error('Đã có lỗi xảy ra');
      }
    }
  }

  useEffect(() => {fetchUser();}, []);
  useEffect(() => {fetchStudent();}, []);
  useEffect(() => {fetchField();}, []);
  useEffect(() => {fetchListRecruit(); }, [pageIndex, pageSize, field, experience, search, salary, user]);
  const handleChangeField = (e) => {
   // console.log(e);
    const value = e.map((item) => {
      return item.value;
    });
    setField([...value]);
    setPageIndex(1);
  };

  const handleChangeSelect = (e) => {
    setExperience(e.value);
    setPageIndex(1);
  };
  const handleChangeSalary = (e) => {
    setSalary(e.value);
    setPageIndex(1);
  };
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPageIndex(1);
  };
  const onShowSizeChange = (current, pageSize) => {
   // console.log(current, pageSize);
    setPageIndex(current);
  };
  if (user&&fields.length) {
    return (
      <>
        <div className="banner-content">
          <div className="text-banner">Danh sánh bài đăng tuyển dụng</div>
          <Image className="image-background-banner" src="https://i.ibb.co/0C9Z0r8/Job-offers-cuate.png" preview={false}/></div>
        <div className="container-filter">
          <div className="filter">
            <label className="label-filter">Lĩnh vực bài đăng:</label>
            <Select
              mode="multiple"
              value={field}
              defaultValue="Tất cả"
              labelInValue="Lĩnh vực bài đăng"
              className="filter-content"
              onChange={handleChangeField}
            >
              {fields.map((field) => {
                return (
                  <Option key={field._id} value={field._id}>
                    {field.nameField}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="filter">
            <label className="label-filter">Kinh nghiệm:</label>
            <Select
              value={experience}
              defaultValue="Tất cả"
              labelInValue="Trạng thái"
              className="filter-content"
              onChange={handleChangeSelect}
            >
              <Option value={-1}>Tất cả</Option>
              <Option value={0}>Không yêu cầu</Option>
              <Option value={1}>Dưới 1 năm</Option>
              <Option value={2}>Từ 1 tới 5 năm</Option>
            </Select>
          </div>
          <div className="filter">
            <label className="label-filter">Lương:</label>
            <Select
              value={salary}
              defaultValue="Tất cả"
              labelInValue={true}
              className="filter-content"
              onChange={handleChangeSalary}
            >
              <Option value={-1}>Tất cả</Option>
              <Option value={1}>ít hơn 5 triệu</Option>
              <Option value={2}>Từ 5 tới 10 triệu</Option>
              <Option value={3}>Lớn hơn 10 triệu</Option>
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

        <div className="list-container">
          <CardList listRecruit={listRecruit} id_student={user._id} />
        </div>

        <div className="pagination">
          <Pagination
            pageSize={pageSize}
            onChange={onShowSizeChange}
            defaultCurrent={pageIndex}
            total={total}
          />
        </div>
      </>
    );
  } else {
      return <div className="spin-container">
              <Spin size={200} />
            </div>;
  }
};
