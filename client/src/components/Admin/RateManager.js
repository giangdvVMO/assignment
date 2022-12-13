import { Button, Image, Input, message, Modal, Rate, Select, Spin, Table, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { UserContext } from "../User/UserProvider";
import "../../styles/manager-page.css";
import {
  CheckCircleOutlined,
  DeleteTwoTone,
  MinusCircleOutlined,
  SafetyCertificateTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { serverURL } from "../../configs/server.config";
import { createNoti, openNotificationWithIcon } from "../../common/service";

const { Option } = Select;
const {TextArea} = Input;
export const RateManagerAdmin = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState(-1);
  const [search, setSearch] = useState("");
  const [type_rate, setType] = useState('Tất cả');
  const [listRate, setListRate] = useState([]);
  const [currentId, setCurrentId] = useState('');
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({});
  
  async function fetchListRate() {
    if(user){
    let query = "?1=1";
    query = status !== -1 ? query + "&status=" + status : query;
    query = search !== "" ? query + "&search=" + search : query;
    query = type_rate !== "Tất cả" ? query + "&type_rate=" + type_rate : query;
    const url = serverURL + "rate" + query;
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
        setListRate(result.data);
      }
    } catch (err) {
     // console.log(err);
    }
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
    fetchListRate();
  }, [user, status, search, type_rate]);
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
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Điểm đánh giá",
      dataIndex: "score",
      key: "score",
      width: 180,
      render: (_, record) => {
        return <Rate disabled defaultValue={record.score} count={10}/>
      },
    },
    {
      title: "Nội dung đánh giá",
      // dataIndex: "content",
      width: 200,
      key: "content",
      render: (_,record) =>{ 
        return <TextArea value={record.content} bordered={false}/>
    }
    },
    {
      title: "Sinh viên",
      key: "fullname",
      width: 200,
      render: (_, record) => {
        return <div>{record.account.fullname}</div>
      },
    },
    {
        title: "Doanh nghiệp",
        key: "company",
        width: 200,
        render: (_, record) => {
          return <div>{record.company.com_name}</div>
        },
      },
    {
      title: "Loại đánh giá",
      key: "type",
      width: 150,
      render: (_, record) => {
        return (record.type_rate==='student'?
        <Tag color="#87d068">{record.type_rate}</Tag>:<Tag color="#2db7f5">{record.type_rate}</Tag>
        )
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
          <Tag icon={<MinusCircleOutlined />} color="warning">
            chưa duyệt
          </Tag>
        ),
      fixed: "right",
    },
    {
      title: "Hành động",
      width: 150,
      key: "action",
      render: (_, record) => (<>
         {!record.status?<Button type="text" onClick={()=>handleConfirm(record._id, record.company)}><SafetyCertificateTwoTone size={100} /></Button>:''}
       <Button type="text" onClick={()=>handleDelete(record._id,record.company)}><DeleteTwoTone /></Button>
        </>
      ),
      fixed: "right",
    },
  ];

  const handleChangeSelect = (e) => {
    setStatus(e.value);
  };
  const handleChangeType =  (e) => {
    setType(e.value);
  };
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleConfirm = (id, company)=>{
   // console.log('id', id);
    setCurrentId(id);
   // console.log('currentId', currentId);
    setCurrentCompany({...company})
    setOpenConfirm(true);
  }

  const handleDelete =(id, company)=>{
    setCurrentId(id);
    setCurrentCompany({...company})
    setOpenDelete(true);
  }
  const handleConfirmDelete = async ()=>{
   // console.log('currentId', currentId);
    const url = serverURL + "rate/" + currentId;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 200) {
        message.error(result.message);
      } else {
        const title = "Xóa đánh giá";
          const type = "infor";
          const content = `Admin ${user.fullname} đã xóa đánh giá của bạn.`;
          createNoti(user._id, [currentCompany._id], title, type, content);
          openNotificationWithIcon('success','Thông báo',"Bạn đã xóa bài đăng tuyển dụng thành công, thông báo đã gửi tới công ty!");
          fetchListRate();
        setOpenDelete(false);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }
  const handleCancelDelete = ()=>{
    setOpenDelete(false);
  }
  const handleConfirmConfirm = async()=>{
    const url = serverURL + "rate/confirm/" + currentId;
    const data = { confirm_id: user._id };
   // console.log("request", data);
    try {
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 200) {
        message.error(result.message);
      } else {
        const title = "Duyệt đánh giá";
          const type = "infor";
          const content = `Admin ${user.fullname} đã duyệt đánh giá của bạn.`;
          createNoti(user._id, [currentCompany._id], title, type, content);
          openNotificationWithIcon('success','Thông báo',"Bạn đã duyệt đánh giá thành công, thông báo đã gửi tới công ty!");
          fetchListRate();
        setOpenConfirm(false);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }
  const handleCancelConfirm = ()=>{
   // console.log('currentId', currentId);

    setOpenConfirm(false);
  }
if(user){
  return (
    <>
      <div className="banner-content">
        <div className="text-banner">Quản lý danh sách đánh giá</div>
        <Image className="image-background-banner" src="https://i.ibb.co/X7Fw3P2/Grades-bro.png" preview={false}/>
       </div>
      <div className="container-filter">
        <div className="filter">
          <label className="label-filter">Trạng thái:</label>
          <Select
            value={status}
            defaultValue="Tất cả"
            labelInValue={true}
            className="filter-content"
            onChange={handleChangeSelect}
          >
            <Option value={-1}>Tất cả</Option>
            <Option value={1}>duyệt</Option>
            <Option value={0}>chưa duyệt</Option>
          </Select>
        </div>
        <div className="filter">
          <label className="label-filter">Loại đánh giá:</label>
          <Select
            value={type_rate}
            defaultValue="Tất cả"
            labelInValue={true}
            className="filter-content"
            onChange={handleChangeType}
          >
            <Option value={"Tất cả"}>Tất cả</Option>
            <Option value={"student"}>student</Option>
            <Option value={"company"}>company</Option>
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
      <Modal
        title="Xác nhận xóa"
        open={isOpenDelete}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Bạn có chắc chắn muốn xóa!</p>
      </Modal> 
      <Modal
        title="Xác nhận duyệt"
        open={isOpenConfirm}
        onOk={handleConfirmConfirm}
        onCancel={handleCancelConfirm}
      >
        <p>Bạn có chắc chắn muốn duyệt!</p>
      </Modal>           
      <Table
        dataSource={listRate}
        columns={columns}
        scroll={{
          x: 1000,
          y: 800,
        }}
        pagination={{pageSize:5}}
      />
    </>
  )}else{
    return <div className="spin-container">
    <Spin />
  </div>;
}
};
