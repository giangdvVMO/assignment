import { Button, Card, Form, Input, message, Modal, Spin, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import { createNoti, DateToShortString, openNotificationWithIcon } from "../../common/service";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
const { TextArea } = Input;

let initialRecruit = {
  _id: -1,
  title: "x",
  way_working: "",
  salary: "",
  quantity: "",
  level: "",
  gender: null,
  status: false,
  address_working: "",
  experience: "",
  description: "",
  requirement: "",
  welfare: "",
  start_date: "",
  end_date: "",
  id_company: "",
  fields: [],
};

let initialCompany = {
  _id: -1,
  com_name: "",
  address: "",
  year: "",
  com_phone: "",
  com_email: "",
  website: "",
  status: true,
  scale: "",
  introduction: "",
  manufacture: [],
};

export const RecruitDetailAdmin = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const ids = id.split(",");
  const [company, setCompany] = useState(initialCompany);
  const [recruit, setRecruit] = useState(initialRecruit);

  //fetch manucomany and Company
  async function fetchManuCompany() {
    try {
     // console.log("fetch manu Company!", recruit.id_company);
      const _id = ids[1];
      const url = serverURL + "manu-company/company/" + _id;
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
          // setOpenModal(true);
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
     // console.log("fetch Company!", recruit.id_company);
      const url = serverURL + "company/" + ids[1];
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
         // console.log("fetch Company", result.data);
          setCompany({ ...company, ...result.data });
          fetchManuCompany();
        }
      }
    } catch (err) {
     // console.log(err);
    }
  }

  async function fetchRecruit() {
    const url = serverURL + "recruit/" + ids[0];
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
        // message.success("Load recruit thành công!");
        setRecruit({ ...result.data });
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
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
    fetchRecruit();
  }, []);
  useEffect(() => {
    fetchCompany();
  }, []);

  //initial Validate

  const ref = useRef();
  const refButtonSubmit = useRef();

  //handle change
  function handleKeyUp(e) {
    if (e.keyCode === 13) {
     // console.log("enter");
      refButtonSubmit.current.focus();
      refButtonSubmit.current.click();
    }
  }

  //handle action
  async function confirmRecruit() {
    try {
      const url = serverURL + "recruit/confirm/" + ids[0];
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
          message.success("Duyệt thành công!");
          const link = "company/recruit/" + company._id;
          const title = "Phản hồi duyệt thông tin bài đăng tuyển dụng";
          const type = "infor";
          const content = `Admin ${user.fullname} duyệt thông tin bài đăng tuyển dụng.`;
          createNoti(user._id, [company._id], title, type, content, link);
          fetchRecruit();
        }
      }
    } catch (err) {
     // console.log(err);
    }
  }

  async function deleteRecruit() {
    const url = serverURL + "recruit/" + ids[0];
    const data = { delete_id: user._id };
   // console.log("request", data);
    try {
      const response = await fetch(url, {
        method: "DELETE",
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
          const title = "Xóa bài đăng tuyển dụng";
          const type = "infor";
          const content = `Admin ${user.fullname} đã xóa bài đăng tuyển dụng của bạn.`;
          createNoti(user._id, [company._id], title, type, content);
          openNotificationWithIcon('success','Thông báo',"Bạn đã xóa bài đăng tuyển dụng thành công, thông báo đã gửi tới công ty!");
          navigate("/admin/recruit-list");
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }

  async function handleDelete(e) {
    setOpenModal(true);
    return;
  }
  async function handleConfirmDelete(e) {
    setOpenModal(false);
    deleteRecruit();
    return;
  }
  async function handleCancelDelete(e) {
    setOpenModal(false);
    message.info("Bạn xác nhận không xóa!");
    return;
  }

  async function handleAccept(e) {
    confirmRecruit();
  }
  async function handleReject(e) {
    setOpen(true);
    return;
  }
  async function handleSubmitDeny() {
    const title = "Từ chối duyệt thông tin bài tuyển dụng";
    const type = "infor";
    const content = `Admin ${user.fullname} đã từ chối duyệt thông tin bài đăng của bạn! Hãy kiểm tra lại!`;
    const link = "company/recruit/" + recruit._id;
    createNoti(user._id,[company._id], title, type, content, link);
    // set notification (later)
    message.success("Đã gửi thông báo tới doanh nghiệp!");
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
        {recruit.status ? (
          ""
        ) : (
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
        )}
        <Button
          type="submit"
          className="button delete-btn"
          onClick={handleDelete}
        >
          Xóa
        </Button>
      </>
    );
  };
  const renderStatus = () => {
    if (recruit.status) {
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

  if(recruit._id!==-1&&company){
  //render UI
  return (
    <div className="swapper-container">
      <div className="introduce-frame">
        <div className="background-image center">
          <p className="title-account center ">Chi tiết bài đăng tuyển dụng</p>
        </div>
      </div>
      <div className="detail-swapper">
        <div className="underline"></div>
        <div className="body">
          <Form
            ref={ref}
            onKeyUp={handleKeyUp}
            className="form"
            name="basic"
            layout="vertical"
          >
            <div className="title-recruit">
              <Form.Item
                label="Tiêu đề bài đăng:"
                name="title"
                className="label"
              >
                <p className="text-display">{recruit.title}</p>
              </Form.Item>
            </div>
            <Card title="Chi tiết bài đăng tuyển dụng">
              <div className="two-colums">
                <Form.Item
                  label="Lương:"
                  name="salary"
                  initialValue={recruit.salary}
                  className="label"
                >
                  <p className="text-display">{recruit.salary}</p>
                </Form.Item>

                <Form.Item
                  label="Số lượng tuyển:"
                  name="quantity"
                  className="label"
                >
                  <p className="text-display">{recruit.quantity}</p>
                </Form.Item>

                <Form.Item
                  label="Địa chỉ làm việc:"
                  name="address_working"
                  className="label"
                >
                  <p className="text-display">{recruit.address_working}</p>
                </Form.Item>

                <Form.Item
                  label="Kinh nghiệm:"
                  name="experience"
                  className="label"
                >
                  <p className="text-display">{recruit.experience}</p>
                </Form.Item>

                <Form.Item
                  label="Phương thức làm việc:"
                  name="way_working"
                  className="label"
                >
                  <p className="text-display">{recruit.way_working}</p>
                </Form.Item>
                <Form.Item label="Chức vụ:" name="level" className="label">
                  <p className="text-display">{recruit.level}</p>
                </Form.Item>
                <Form.Item label="Giới tính:" name="gender" className="label">
                  <p className="text-display">
                    {recruit.gender === null
                      ? "Tất cả"
                      : recruit.gender === false
                      ? "nam"
                      : "nữ"}
                  </p>
                </Form.Item>

                <Form.Item label="Lĩnh vực:" name="fields" className="label">
                  <div>
                    {recruit.fields.length ? (
                      recruit.fields.map((field) => {
                        return (
                          <Tag className="tag" color="cyan">
                            {field.nameField}
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
                label="Thông tin mô tả công việc:"
                name="description"
                className="label"
              >
                <pre style={{textAlign:'left'}}>
                                {recruit.description}
                            </pre>
              </Form.Item>
              <Form.Item
                label="Thông tin yêu cầu ứng tuyển:"
                name="requirement"
                className="label"
              >
                <pre style={{textAlign:'left'}}>
                                {recruit.requirement}
                            </pre>
              </Form.Item>
              <Form.Item
                label="Thông tin quyền lợi:"
                name="welfare"
                className="label"
              >
                <pre style={{textAlign:'left'}}>
                                {recruit.welfare}
                            </pre>
              </Form.Item>
              <div className="two-colums">
                <Form.Item
                  label="Ngày kết thúc:"
                  name="end_date"
                  className="label"
                >
                  <p className="text-display">
                    {DateToShortString(recruit.end_date)}
                  </p>
                </Form.Item>
              </div>
              <Form.Item name="status" label="Trạng thái">
                <div className="status">{renderStatus()}</div>
              </Form.Item>
            </Card>
            <Card>
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
                      <pre style={{textAlign:'left'}}>
                                {company.introduction}
                            </pre>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Card>
            <Form.Item>
              <div className="group-button">{renderButtonGroup()}</div>
            </Form.Item>
          </Form>
        </div>
      </div>
      
      <Modal
        title="Xác nhận"
        open={isOpenModal}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Bạn có chắc chắn muốn xóa!</p>
      </Modal>
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
  )}else{
    return <div className="spin-container">
    <Spin />
  </div>;
}
};
