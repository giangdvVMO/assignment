import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, Modal, Spin, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import { socket } from "../../App";
import { createNoti } from "../../common/service";
const { TextArea } = Input;

let initialCompany = {
  _id: -1,
  com_name: "",
  address: "",
  year: "",
  com_phone: "",
  com_email: "",
  website: "",
  status: false,
  scale: "",
  introduction: "",
  manufacture: [],
};

export const CompanyDetailAdmin = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const [isOpen, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const [account, setAccount] = useState(user);
  const [company, setCompany] = useState(initialCompany);

  const { id } = useParams();

  //fetch manucomany and Company
  async function fetchManuCompany() {
    try {
      const url = serverURL + "manu-company/company/" + id;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status !== 200) {
       // console.log("Lỗi hệ thống!");
        message.error("Lỗi hệ thống!");
      } else {
       // console.log("result", result);
        if (result.data === "empty") {
          setCompany({ ...initialCompany });
        } else {
         // console.log("fetch Manu Company", result.data);
          setCompany((preCompany) => {
            return { ...preCompany, manufacture: result.data.manufacture };
          });
        }
      }
    } catch (err) {
     // console.log(err);
    }
  }
  async function fetchCompany() {
    try {
      const url = serverURL + "company/" + id;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status !== 200) {
       // console.log("Lỗi hệ thống!");
        message.error("Lỗi hệ thống!");
      } else {
       // console.log("result", result);
        if (result.data === "empty") {
          navigate("/page-not-found");
          setCompany({ ...initialCompany });
        } else {
         // console.log("fetch Company", result.data);
          setCompany({ ...company, ...result.data });
          fetchManuCompany();
        }
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
          // message.warn("Bạn ko có quyền xem trang này");
          navigate("/");
        }
        changeUser({ ...result });
        setAccount({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchCompany();
  }, []);
  async function confirmCompany() {
    try {
      const url = serverURL + "company/confirm/" + id;
      const data = {
        confirm_id: user._id,
      };
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.status !== 200) {
        message.error("Lỗi hệ thống!");
      } else {
        if (result.data === false) {
          message.warning("Cập nhật không thành công, hãy kiểm tra lại!");
        } else {
          const title = "Duyệt thông tin công ty";
          const type = "infor";
          const content = `Admin ${account.fullname} đã duyệt thông tin công ty bạn! Bạn có thể sử dụng các tính năng của trang web!Chúc bạn thành công!`;
          createNoti(account._id, [company._id], title, type, content);
          message.success("Gửi thông báo thành công!");
          fetchCompany();
        }
      }
    } catch (err) {
     // console.log(err);
    }
  }

  const ref = useRef();

  async function handleAccept(e) {
    confirmCompany();
  }
  async function handleReject(e) {
    setOpen(true);
    return;
  }
  async function handleSubmitDeny() {
    const title = "Từ chối duyệt thông tin doanh nghiệp";
    const type = "infor";
    const content = `Admin ${account.fullname} đã từ chối duyệt thông tin công ty bạn vì ${reason}! Bạn hãy cập nhật lại thông tin!`;
    createNoti(account._id, [company._id], title, type, content);
    message.success("Đã gửi thông báo tới sinh viên!");
    fetchCompany();
    setOpen(false);
  }
  async function handleCancelDeny() {
    setOpen(false);
  }
  async function handleChangeReason(e) {
    setReason(e.target.value);
    return;
  }

  const renderButtonGroup = () => {
    return (
      <>
        <Button
          type="submit"
          className="button save-btn"
          onClick={handleAccept}
        >
          Duyệt
        </Button>
        <Button className="button reject-btn" onClick={handleReject}>
          Từ chối
        </Button>
      </>
    );
  };
  const renderStatus = () => {
    if (company.status) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã duyệt
        </Tag>
      );
    } else {
      return (
        <Tag icon={<MinusCircleOutlined />} color="warning">
          Chưa duyệt
        </Tag>
      );
    }
  };

  if(company){
  //render UI
  return (
    <div className="swapper-container">
      <div className="introduce-frame">
        <div className="background-image"></div>
        <div className="introduce-bottom">
        <div className='avatar-container'>
          <Avatar className="avatar" size={120} icon={<UserOutlined />} />
          </div>
          <div className="introduce-fullname">{company.com_name}</div>
        </div>
      </div>
      <div className="detail-swapper">
        <p className="title-account">Thông tin công ty</p>
        <div className="underline"></div>
        <div className="body">
          <Form
            ref={ref}
            className="form"
            name="basic"
            layout="vertical"
            autoComplete="off"
          >
            <div className="two-colums">
              <Form.Item
                label="Tên công ty:"
                name="com_name"
                initialValue={company.com_name}
                className="label"
              >
                <p className="text-display">{company.com_name}</p>
              </Form.Item>
              <Form.Item
                label="Email:"
                name="email"
                initialValue={company.com_email}
                className="label"
              >
                <p className="text-display">{company.com_email}</p>
              </Form.Item>

              <Form.Item
                label="Số điện thoại:"
                name="phone"
                initialValue={company.com_phone}
                className="label"
              >
                <p className="text-display">{company.com_phone}</p>
              </Form.Item>

              <Form.Item
                label="Website:"
                name="website"
                initialValue={company.website}
                className="label"
              >
                <p className="text-display">{company.website}</p>
              </Form.Item>

              <Form.Item
                label="Địa chỉ:"
                name="address"
                initialValue={company.address}
                className="label"
              >
                <p className="text-display">{company.address}</p>
              </Form.Item>

              <Form.Item
                label="Số lao động:"
                name="scale"
                initialValue={company.scale}
                className="label"
              >
                <p className="text-display">{company.scale}</p>
              </Form.Item>

              <Form.Item
                label="Năm thành lập:"
                name="year"
                initialValue={company.year}
                className="label"
              >
                <p className="text-display">{company.year}</p>
              </Form.Item>
              <Form.Item
                label="Ngành sản xuất:"
                name="manufacture"
                initialValue={company.manufacture}
                className="label"
              >
                <div>
                  {company.manufacture.length ? (
                    company.manufacture.map((manu) => {
                      return (
                        <Tag className="tag" color="cyan">
                          {manu.name_manu}
                        </Tag>
                      );
                    })
                  ) : (
                    <p className="text-display"></p>
                  )}
                </div>
              </Form.Item>
            </div>
            <Form.Item
              label="Thông tin giới thiệu:"
              name="introduction"
              initialValue={company.introduction}
              className="label"
            >
              <TextArea
                rows={5}
                disabled
                value={company.introduction}
                defaultValue={company.introduction}
              />
              {console.log(company.introduction)}
            </Form.Item>
            <Form.Item name="status" label="Trạng thái">
              <div className="status">{renderStatus()}</div>
            </Form.Item>
            <Form.Item>
              <div className="group-button">
                {company.status ? "" : renderButtonGroup()}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal title="Xác nhận từ chối" open={isOpen} footer={null}>
        <label>Lý do từ chối</label>
        <TextArea
          className="input-login max-width"
          placeholder="Nhập lí do"
          autoFocus={true}
          rows={6}
          defaultValue={reason}
          value={reason}
          onChange={handleChangeReason}
        />
        <br />
        <div className="group-button">
          <Button
            type="submit"
            className="button save-btn"
            onClick={handleSubmitDeny}
          >
            Từ chối
          </Button>
          <Button
            type="reset"
            className="button cancel-btn"
            onClick={handleCancelDeny}
          >
            Hủy
          </Button>
        </div>
      </Modal>
    </div>
  )
}else{
    return <div className="spin-container">
            <Spin />
          </div>;
  }
};
