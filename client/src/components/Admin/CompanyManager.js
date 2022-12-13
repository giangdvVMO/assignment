import { Button, Image, Input, message, Select, Table, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { UserContext } from "../User/UserProvider";
import "../../styles/manager-page.css";
import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { scaleList } from "../../data/list";
import { serverURL } from "../../configs/server.config";

const { Option } = Select;
const {TextArea} = Input;
export const CompanyManager = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [scaleBound, setScaleBound] = useState(-1);
  const [status, setStatus] = useState(-1);
  const [search, setSearch] = useState("");
  const [listUser, setListUser] = useState([]);
  async function fetchListCompany() {
    let query = "?1=1";
    query = status !== -1 ? query + "&status=" + status : query;
    query = scaleBound !== -1 ? query + "&scaleBound=" + scaleBound : query;
    query = search !== "" ? query + "&search=" + search : query;
    const url = serverURL + "company" + query;
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
        setListUser(result.data);
      }
    } catch (err) {
     // console.log(err);
    }
  }

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
        if (!result || result.role !== "admin") {
          message.warn("Bạn ko có quyền xem trang này");
          navigate("/");
        }
        changeUser({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchListCompany();
  }, [scaleBound, status, search]);

  const columns = [
    {
      title: 'STT',
      key: '_id',
      width: 80,
      fixed: 'left',
      render: (_, record, index)=>{
          return <div>{index+1}</div>
      }
  },
    {
      title: "Tên công ty",
      dataIndex: "com_name",
      width: 200,
      key: "com_name",
      render:(_, record)=>{
        return (<p className="bold-column">{record.com_name}</p>)
      }
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 150,
      key: "address",
      // width: 200,
    },
    {
      title: "Năm thành lập",
      dataIndex: "year",
      width: 200,
      key: "year",
      // width: 150,
      sorter: (a,b)=>{
        return a.year-b.year
      }
    },
    {
      title: "Số điện thoại",
      width: 130,
      dataIndex: "com_phone",
      key: "com_phone",
    },
    {
      title: "Email",
      dataIndex: "com_email",
      width: 200,
      key: "com_email",
    },
    {
      title: "Website",
      dataIndex: "website",
      width: 100,
      key: "website",
    },
    {
      title: "Số lao động",
      dataIndex: "scale",
      width: 100,
      key: "scale",
      
      sorter: (a,b)=>{
        return a.year-b.year
      }
    },
    {
      title: "Giới thiệu",
      dataIndex: "introduction",
      key: "introduction",
      width: 150,
      render: (_,record) =>{ 
        return <TextArea value={record.introduction} bordered={false}/>
    }
      // width: 200,
    },
    {
      title: "Ngành sản xuất",
      key: "manufactures",
      width: 200,
      render: (_, record) => {
        return (
          <>
            {record.manufactures.map((manu) => {
              return (
                <Tag className="tag" color="cyan">
                  {manu.name_manu}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_, record) =>
        record.status ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            duyệt
          </Tag>
        ) : (
          <Tag icon={<MinusCircleOutlined />} color="default">
            chưa duyệt
          </Tag>
        ),
      fixed: "right",
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Link to={`../admin/company/${record._id}`}>Xem chi tiết</Link>
      ),
      fixed: "right",
    },
  ];

  const handleChangeScale = (e) => {
    setScaleBound(e.value);
  };
  const handleChangeSelect = (e) => {
    setStatus(e.value);
  };
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="banner-content">
        <div className="text-banner">Quản lý danh sách doanh nghiệp</div>
        <Image className="image-background-banner" src="https://i.ibb.co/Y0DjjB8/Flood-amico.png" preview={false}/>
      </div>
        
      <div className="container-filter">
        <div className="filter">
          <label className="label-filter">Số lao động:</label>
          <Select
            value={scaleBound}
            defaultValue="Tất cả"
            labelInValue="Số lao động"
            className="filter-content"
            onChange={handleChangeScale}
          >
            <Option value={-1}>Tất cả</Option>
            {scaleList.map((scale) => {
              return (
                <Option key={scale} value={scale}>
                  {scale}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="filter">
          <label className="label-filter">Trạng thái:</label>
          <Select
            value={status}
            defaultValue="Tất cả"
            labelInValue="Trạng thái"
            className="filter-content"
            onChange={handleChangeSelect}
          >
            <Option value={-1}>Tất cả</Option>
            <Option value={1}>duyệt</Option>
            <Option value={0}>chưa duyệt</Option>
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
      <Table
        dataSource={listUser}
        columns={columns}
        scroll={{
          x: 800,
          y: 800,
        }}
        pagination={{pageSize:5}}
      />
    </>
  );
};
