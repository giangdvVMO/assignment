import { Button, Card, Form, Input, message, Modal, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import {
  createNoti,
  DateToShortString,
  openNotificationWithIcon,
} from "../../common/service";
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

export const RecruitDetailStudent = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  //   const ids = id.split(",");
  const [account, setAccount] = useState(user);
  const [company, setCompany] = useState(initialCompany);
  const [recruit, setRecruit] = useState(initialRecruit);

  //fetch manucomany and Company
  async function fetchManuCompany() {
    if (company._id !== -1) {
      try {
       // console.log("fetch manu Company!", recruit.id_company);
        // const _id = ids[1];
        const url = serverURL + "manu-company/company/" + company._id;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.status !== 200) {
         // console.log("Lỗi hệ thống!");
          message.error("Lỗi fetch manu!");
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
  }
  async function fetchCompany() {
    if (recruit._id !== -1) {
      try {
        const url = serverURL + "company/" + recruit.id_company;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.status !== 200) {
         // console.log("Lỗi hệ thống!");
          message.error("Lỗi fetch company!");
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
  }

  async function fetchRecruit() {
    const url = serverURL + "recruit/" + id;
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
        setRecruit({ ...result.data });
        // setCompany({...recruit.data.company});
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra fetchRecruit!");
    }
  }

  //fetchCV
  async function fetchCV() {
   // console.log("user", user);
    if (user) {
     // console.log("fetchCV");
      const url = serverURL + "cv/" + account._id;
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
          if (result.data === {} || !result.data) {
            setOpenModal(true);
          } else {
            setOpenConfirm(true);
          }
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra cv!");
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
        if (!result || result.role !== "student") {
          message.warn("Bạn ko có quyền xem trang này");
          navigate("/");
        }
        setAccount({ ...result });
        changeUser({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };

  //fetchCondition
  async function fetchCondition() {
    if (account && recruit._id !== -1) {
      const url =
        serverURL +
        `apply/?id_student=${account._id}&id_recruit=${recruit._id}`;
      const data = {
        id_student: account._id,
        id_recruit: recruit._id,
      };
     // console.log("fetchCondition", data);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
       // console.log("condition", result);
        if (response.status !== 200) {
          message.error(result.message);
        } else {
          if (result.data.length) {
            openNotificationWithIcon(
              "warning",
              "Cảnh báo",
              "Bạn đã apply bài đăng này rồi!"
            );
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra condition!");
      }
    }
  }

  //fetchCondition
  async function createApply() {
    const url = serverURL + "apply";
    const data = {
      id_student: account._id,
      id_recruit: recruit._id,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
     // console.log("condition", result);
      if (response.status !== 201) {
        message.error(result.message);
      } else {
        if (!result.data) {
          message.error("lỗi tạo apply");
        } else {
          openNotificationWithIcon(
            "success",
            "Thông báo",
            "Bạn đã ứng tuyển thành công, hãy đợi phản hồi từ nhà tuyển dụng."
          );
          setDisabled(true);
          setOpenConfirm(false);
        }
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra create apply!");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchRecruit();
  }, []);
  useEffect(() => {
    fetchCompany();
  }, [recruit]);

  useEffect(() => {
    fetchCondition();
  }, [account, recruit]);

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
  const handleApply = () => {
    fetchCV();
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleOk = () => {
    navigate("/my-cv");
  };

  const handleCancelConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOkConfirm = async () => {
    createApply();
    //gửi  noti
    const link = "company/student/" + account._id;
    const title = "Ứng tuyển";
    const type = "apply";
    const content = `Sinh viên ${account.fullname} ứng tuyển bài đăng tuyển dụng ${recruit.title}.`;
    createNoti(account._id, [company._id], title, type, content, link);
  };

  //render UI
  return (
    <div className="swapper-container">
      <div className="introduce-frame">
        <div className="background-image center">
          <p className="title-account center ">Chi tiết bài đăng tuyển dụng</p>
        </div>
        <div className="apply-container">
          <Button
            className="apply-btn"
            type="primary"
            disabled={disabled}
            onClick={handleApply}
          >
            Ứng tuyển ngay
          </Button>
        </div>
      </div>

      <div className="detail-swapper">
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
                <TextArea
                  rows={5}
                  disabled
                  value={recruit.description}
                  defaultValue={recruit.description}
                />
                {console.log(recruit.description)}
              </Form.Item>
              <Form.Item
                label="Thông tin yêu cầu ứng tuyển:"
                name="requirement"
                className="label"
              >
                <TextArea
                  rows={5}
                  disabled
                  value={recruit.requirement}
                  defaultValue={recruit.requirement}
                />
                {console.log(recruit.requirement)}
              </Form.Item>
              <Form.Item
                label="Thông tin quyền lợi:"
                name="welfare"
                className="label"
              >
                <TextArea
                  rows={5}
                  disabled
                  value={recruit.welfare}
                  defaultValue={recruit.welfare}
                />
                {console.log(recruit.welfare)}
              </Form.Item>
              <div className="two-colums">
                {/* <Form.Item
                  label="Ngày bắt đầu:"
                  name="start_date"
                  className="label"
                >
                  <p className="text-display">
                    {DateToShortString(recruit.start_date)}
                  </p>
                </Form.Item> */}
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
                      <TextArea
                        rows={5}
                        disabled
                        value={company.introduction}
                        defaultValue={company.introduction}
                      />
                      {console.log(company.introduction)}
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Card>
          </Form>
        </div>
      </div>
      <Modal
        title="Thông báo"
        open={isOpenModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn chưa cập nhật CV nên không thể ứng tuyển, hãy cập nhật!</p>
        <Link to={`../../../my-cv`}>
          <Button type="primary">CV</Button>
        </Link>
      </Modal>
      <Modal
        title="Xác nhận"
        open={isOpenConfirm}
        onOk={handleOkConfirm}
        onCancel={handleCancelConfirm}
      >
        <p>Bạn có chắc chắn muốn ứng tuyển!</p>
      </Modal>
    </div>
  );
};
