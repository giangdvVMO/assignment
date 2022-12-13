import {
  BulbOutlined,
  CheckCircleOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Tag,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import {
  checkAddress,
  checkScale,
  checkWebsite,
  checkComName,
  checkMail,
  checkPhone,
  checkYear,
  checkManufacture,
} from "../../common/validation";
import { messageSignUpError, messageCompanyError } from "../../common/error";
import { manufacturesList } from "../../data/list";
import { createNoti, getUserAdmin, openNotificationWithIcon, postManufactures } from "../../common/service";
const { Option } = Select;
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

export const CompanyProfile = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [manufactures, setManufactures] = useState([
    { _id: "", name_manu: "" },
  ]);
  const navigate = useNavigate();
  // if(!user||user.role!=="company"){
  //     navigate('/sign-in');
  // }
  const [account, setAccount] = useState(user);
  const [company, setCompany] = useState(initialCompany);
  const defaultTrueStatus = {
    status: "success",
    errorMsg: null,
  };
 // console.log("company.manufacture", company.manufacture);

  //fetch manucomany and Company
  async function fetchManuCompany() {
    try {
      const _id = account._id;
      const url = serverURL + "manu-company/company/" + _id;
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
      if (account) {
        const _id = account._id;
        const url = serverURL + "company/" + _id;
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
            setOpenModal(true);
            setCompany({ ...initialCompany });
          } else {
           // console.log("fetch Company", result.data);
            setCompany({ ...company, ...result.data });
            fetchManuCompany();
          }
        }
      }
    } catch (err) {
     // console.log(err);
    }
  }
  
  //fetch Manufacture
  async function fetchManufacture() {
    const url = serverURL + "manufacture";
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
          const manuList = postManufactures();
          setManufactures(manuList);
        }
        setManufactures(result.data);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }

  //fetch Accout (do not need)
  async function fetchAccount() {
    try {
      const url = serverURL + "account/" + account._id;
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
        setAccount(result);
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
        if (!result || result.role !== "company") {
          message.warn("Bạn ko có quyền xem trang này");
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
  }, [account]);
  useEffect(() => {
    fetchManufacture();
  }, []);

  //initial Validate
  const [validateComName, setValidateComName] = useState(defaultTrueStatus);
  const [validatePhone, setValidatePhone] = useState(defaultTrueStatus);
  const [validateEmail, setValidateEmail] = useState(defaultTrueStatus);
  const [validateScale, setValidateScale] = useState(defaultTrueStatus);
  const [validateAddress, setValidateAddress] = useState(defaultTrueStatus);
  const [validateYear, setValidateYear] = useState(defaultTrueStatus);
  const [validateWebsite, setValidateWebsite] = useState(defaultTrueStatus);
  const [validateManu, setValidateManu] = useState(defaultTrueStatus);
  const ref = useRef();
  const refButtonSubmit = useRef();

  //handle change
  async function handleEdit(e) {
    setIsEdit(true);
    return;
  }
  function handleKeyUp(e) {
    if (e.keyCode === 13) {
     // console.log("enter");
      refButtonSubmit.current.focus();
      refButtonSubmit.current.click();
    }
  }

  //validate
  function checkMailFunc(email) {
    if (!checkMail(email)) {
      setValidateEmail({
        status: "error",
        errorMsg: messageSignUpError.email,
      });
      return false;
    } else {
      setValidateEmail(defaultTrueStatus);
      return true;
    }
  }
  function checkPhoneFunc(phone) {
    if (!checkPhone(phone)) {
      setValidatePhone({
        status: "error",
        errorMsg: messageSignUpError.phone,
      });
      return false;
    } else {
      setValidatePhone(defaultTrueStatus);
      return true;
    }
  }
  function checkComNameFunc(ComName) {
    if (!checkComName(ComName)) {
      setValidateComName({
        status: "error",
        errorMsg: messageSignUpError.ComName,
      });
      return false;
    } else {
      setValidateComName(defaultTrueStatus);
      return true;
    }
  }
  function checkScaleFunc(Scale) {
    if (!checkScale(Scale)) {
      setValidateScale({
        status: "error",
        errorMsg: messageSignUpError.Scale,
      });
      return false;
    } else {
      setValidateScale(defaultTrueStatus);
      return true;
    }
  }
  function checkYearFunc(Year) {
    if (!checkYear(Year)) {
      setValidateYear({
        status: "error",
        errorMsg: messageCompanyError.year,
      });
      return false;
    } else {
      setValidateYear(defaultTrueStatus);
      return true;
    }
  }
  function checkWebsiteFunc(Website) {
    checkWebsite(Website);
    if (!checkWebsite(Website)) {
      setValidateWebsite({
        status: "error",
        errorMsg: messageCompanyError.website,
      });
      return false;
    } else {
      setValidateWebsite(defaultTrueStatus);
      return true;
    }
  }
  function checkAddressFunc(Address) {
    if (!checkAddress(Address)) {
      setValidateAddress({
        status: "error",
        errorMsg: messageCompanyError.address,
      });
      return false;
    } else {
      setValidateAddress(defaultTrueStatus);
      return true;
    }
  }
  function checkManuFunc(manufacture) {
    if (!checkManufacture(manufacture)) {
      setValidateManu({
        status: "error",
        errorMsg: messageCompanyError.manufacture,
      });
      return false;
    } else {
      setValidateManu(defaultTrueStatus);
      return true;
    }
  }

  //handle action
  async function updateManuCompany() {
    const url = serverURL + "manu-company";
    const data = {
      id_company: account._id,
      id_manu_array: company.manufacture,
    };
   // console.log("request", data);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 201) {
        message.error(result.message);
      } else {
        const link = "admin/company/" + account._id;
          const title = "Yêu cầu duyệt thông tin doanh nghiệp";
          const type = "infor";
          const content = `Doanh nghiệp ${company.com_name} yêu cầu duyệt thông tin doanh nghiệp.`;
          const listAdmin = await getUserAdmin();
          if (!listAdmin.length) {
            message.info("Chưa có admin, hãy tạo tài khoản admin");
          } else {
            createNoti(account._id, listAdmin, title, type, content, link);
          }
        openNotificationWithIcon('success', 'Thông báo', 'Bạn đã cập nhật thành công! Hãy đợi admin duyệt!')
        fetchCompany();
        setIsEdit(false);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }
  async function updateCompany() {
    if (company._id === -1) {
      const url = serverURL + "company";
      const data = { ...company, _id: account._id, id_account: account._id };
     // console.log("request", data);
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
       // console.log("updateCompany", result);
        if (response.status !== 201) {
          message.error(result.message);
        } else {
          
          updateManuCompany();
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra!");
      }
    } else {
      const url = serverURL + "company/" + company._id;
      const data = {
        com_name: company.com_name,
        address: company.address,
        year: company.year,
        com_phone: company.com_phone,
        com_email: company.com_email,
        website: company.website,
        scale: company.scale,
        introduction: company.introduction,
        manufacture: company.manufacture,
        update_id: account._id,
        status: false,
      };
      try {
        const response = await fetch(url, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
       // console.log("result update", result);
        if (response.status !== 200) {
          message.error(result.message);
        } else {
          updateManuCompany();
          //setIsEdit(false);
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra!");
      }
    }
    fetchCompany();
  }
  async function handleSave(e) {
    ref.current.submit();
    let count = 0;
   // console.log("account", account);
   // console.log("company", company);
    count = checkComNameFunc(company.com_name) ? count : count + 1;
    count = checkMailFunc(company.com_email) ? count : count + 1;
    count = checkPhoneFunc(company.com_phone) ? count : count + 1;
    count = checkYearFunc(company.year) ? count : count + 1;
    count = checkWebsiteFunc(company.website) ? count : count + 1;
    count = checkAddressFunc(company.address) ? count : count + 1;
    count = checkScaleFunc(company.scale) ? count : count + 1;
    count = checkManuFunc(company.manufacture) ? count : count + 1;
   // console.log("count", count);
    if (count === 0) {
      updateCompany();
    }else{
      openNotificationWithIcon('error', 'Sai thông tin', 'Bạn nhập thông tin chưa chính xác!')
    }
    return;
  }

  function resetStatus() {
    setValidateComName(defaultTrueStatus);
    setValidatePhone(defaultTrueStatus);
    setValidateEmail(defaultTrueStatus);
    setValidateScale(defaultTrueStatus);
    setValidateAddress(defaultTrueStatus);
    setValidateYear(defaultTrueStatus);
    setValidateWebsite(defaultTrueStatus);
    setValidateManu(defaultTrueStatus);
  }
  async function handleCancel(e) {
    fetchAccount();
    fetchCompany();
    resetStatus();
    setIsEdit(false);
    return;
  }

  const renderButtonGroup = () => {
    if (!isEdit) {
      return (
        <Button type="submit" className="button edit-btn" onClick={handleEdit}>
          {company._id === -1 ? "Cập nhật" : "Sửa"}
        </Button>
      );
    } else {
      return (
        <>
          <Button
            type="submit"
            className="button save-btn"
            onClick={handleSave}
          >
            Lưu
          </Button>
          <Button
            type="reset"
            className="button cancel-btn"
            onClick={handleCancel}
          >
            Hủy
          </Button>
        </>
      );
    }
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
        <Tag icon={<MinusCircleOutlined />} color="default">
          Chưa duyệt
        </Tag>
      );
    }
  };
  function handleChangeComName(e) {
    setCompany((preUser) => {
      return { ...preUser, com_name: e.target.value };
    });
  }
  function handleChangeEmail(e) {
   // console.log(e.target.value);
    setCompany((preUser) => {
      return { ...preUser, com_email: e.target.value };
    });
  }
  function handleChangePhone(e) {
    setCompany((preUser) => {
      return { ...preUser, com_phone: e.target.value };
    });
  }
  function handleChangeWebsite(e) {
    setCompany((precompany) => {
      return { ...precompany, website: e.target.value };
    });
  }
  function handleChangeAddress(e) {
    setCompany((precompany) => {
      return { ...precompany, address: e.target.value };
    });
  }
  function handleChangeScale(value) {
    setCompany((preStudent) => {
      return { ...preStudent, scale: value };
    });
  }
  function handleChangeYear(value) {
    setCompany((preStudent) => {
      return { ...preStudent, year: value };
    });
  }
  function handleChangeManufacture(value) {
   // console.log(value);
    setCompany((preStudent) => {
      return { ...preStudent, manufacture: value };
    });
  }
  function handleChangeIntroduction(e) {
    setCompany((preCompany) => {
      return { ...preCompany, introduction: e.target.value };
    });
  }

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
            onKeyUp={handleKeyUp}
            className="form"
            name="basic"
            layout="vertical"
            autoComplete="off"
          >
            <div className="two-colums">
              <Form.Item
                label="Tên công ty:"
                name="com_name"
                validateStatus={validateComName.status}
                help={validateComName.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <Input
                    disabled={!isEdit}
                    className="input-login max-width"
                    placeholder="Nhập tên công ty"
                    autoFocus={true}
                    defaultValue={company.com_name}
                    value={company.com_name}
                    onChange={handleChangeComName}
                  />
                ) : (
                  <p className="text-display">{company.com_name}</p>
                )}
              </Form.Item>
              <Form.Item
                label="Email:"
                name="email"
                validateStatus={validateEmail.status}
                help={validateEmail.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <Input
                    className="input-login max-width"
                    placeholder="Nhập Email công ty"
                    type="email"
                    disabled={!isEdit}
                    autoFocus={true}
                    defaultValue={company.com_email}
                    prefix={<MailOutlined className="input-icon" />}
                    value={company.com_email}
                    onChange={handleChangeEmail}
                  />
                ) : (
                  <p className="text-display">{company.com_email}</p>
                )}
              </Form.Item>

              <Form.Item
                label="Số điện thoại:"
                name="phone"
                validateStatus={validatePhone.status}
                help={validatePhone.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <Input
                    className="input-login max-width"
                    placeholder="Nhập Số điện thoại"
                    autoFocus={true}
                    disabled={!isEdit}
                    defaultValue={company.com_phone}
                    prefix={
                      <>
                        <PhoneOutlined className="input-icon" />
                      </>
                    }
                    value={company.com_phone}
                    onChange={handleChangePhone}
                  />
                ) : (
                  <p className="text-display">{company.com_phone}</p>
                )}
              </Form.Item>

              <Form.Item
                label="Website:"
                name="website"
                validateStatus={validateWebsite.status}
                help={validateWebsite.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <Input
                    className="input-login max-width"
                    placeholder="Nhập địa chỉ website"
                    autoFocus={true}
                    disabled={!isEdit}
                    value={company.website}
                    defaultValue={company.website}
                    onChange={handleChangeWebsite}
                  />
                ) : (
                  <p className="text-display">{company.website}</p>
                )}
              </Form.Item>

              <Form.Item
                label="Địa chỉ:"
                name="address"
                validateStatus={validateAddress.status}
                help={validateAddress.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <Input
                    className="input-login max-width"
                    placeholder="Nhập địa chỉ công ty"
                    autoFocus={true}
                    disabled={!isEdit}
                    value={company.address}
                    defaultValue={company.address}
                    onChange={handleChangeAddress}
                  />
                ) : (
                  <p className="text-display">{company.address}</p>
                )}
              </Form.Item>

              <Form.Item
                label="Số lao động:"
                name="scale"
                validateStatus={validateScale.status}
                help={validateScale.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <InputNumber
                    className="input-login max-width"
                    style={{ width: "100%" }}
                    placeholder="Nhập số lao động"
                    step={1}
                    autoFocus={true}
                    disabled={!isEdit}
                    value={company.scale}
                    defaultValue={company.scale}
                    onChange={handleChangeScale}
                  />
                ) : (
                  <p className="text-display">{company.scale}</p>
                )}
              </Form.Item>

              <Form.Item
                label="Năm thành lập:"
                name="year"
                validateStatus={validateYear.status}
                help={validateYear.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <InputNumber
                    className="input-login max-width"
                    style={{ width: "100%" }}
                    placeholder="Nhập năm thành lập"
                    step={1}
                    autoFocus={true}
                    disabled={!isEdit}
                    value={company.year}
                    defaultValue={company.year}
                    onChange={handleChangeYear}
                  />
                ) : (
                  <p className="text-display">{company.year}</p>
                )}
              </Form.Item>
              <Form.Item
                label="Ngành sản xuất:"
                name="manufacture"
                validateStatus={validateManu.status}
                help={validateManu.errorMsg}
                className="label"
              >
                {isEdit ? (
                  <Select
                    mode="multiple"
                    label="Ngành sản xuất"
                    style={{
                      width: "100%",
                    }}
                    placeholder="Hãy chọn ít nhất một ngành sản xuất"
                    defaultValue={company.manufacture.map((item) => {
                      return item._id;
                    })}
                    value={company.manufacture}
                    onChange={handleChangeManufacture}
                    optionLabelProp="label"
                  >
                    {manufactures.map((manufacture) => {
                      return (
                        <Option
                          value={manufacture._id}
                          label={manufacture.name_manu}
                        >
                          <div className="demo-option-label-item">
                            {manufacture.name_manu}
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                ) : (
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
                )}
              </Form.Item>
            </div>
            <Form.Item
              label="Thông tin giới thiệu:"
              name="introduction"
              className="label"
            >
              {isEdit ? (
                <TextArea
                  rows={5}
                  value={company.introduction}
                  defaultValue={company.introduction}
                  onChange={handleChangeIntroduction}
                />
              ) : (
                <>
                <TextArea
                        rows={5}
                        disabled
                        value={company.introduction}
                        defaultValue={company.introduction}
                      />
                      {console.log(company.introduction)}
                      </>
              )}
            </Form.Item>
            <Form.Item name="status" label="Trạng thái">
              <div className="status">{renderStatus()}</div>
            </Form.Item>
            <Form.Item>
              <div>
                <BulbOutlined className="warnings" color="yellow" size={40} />
                <span>
                  Hãy cập nhật thông tin đầy đủ để có thể sử dụng các chức năng
                  của hệ thống!
                </span>
              </div>
            </Form.Item>
            <Form.Item>
              <div className="group-button">{renderButtonGroup()}</div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title="Xác nhận"
        open={isOpenModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      >
        <p>Bạn hãy cập nhật thông tin để sử dụng các chức năng website!</p>
      </Modal>
    </div>
  );
};
