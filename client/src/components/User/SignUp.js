import {
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  KeyOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Tooltip,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/form.css";
import { serverURL } from "../../configs/server.config";
import {
  checkBirthday,
  checkFullName,
  checkMail,
  checkPassword,
  checkPhone,
  checkRole,
  checkUsername,
} from "../../common/validation";
import { messageSignUpError } from "../../common/error";
import { openNotificationWithIcon } from "../../common/service";

const SignUp = () => {
  const [account, setAccount] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    birthday: "",
    phone: "",
    role: "",
  });

  const [repassword, setRepassword] = useState("");

  const defaultTrueStatus = {
    status: "success",
    errorMsg: null,
  };
  const [validateEmail, setValidateEmail] = useState(defaultTrueStatus);
  const [validatePhone, setValidatePhone] = useState(defaultTrueStatus);
  const [validateUsername, setValidateUsername] = useState(defaultTrueStatus);
  const [validatePassword, setValidatePassword] = useState(defaultTrueStatus);
  const [validateRole, setValidateRole] = useState(defaultTrueStatus);
  const [validateFullname, setValidateFullname] = useState(defaultTrueStatus);
  const [validateBirthday, setValidateBirthday] = useState(defaultTrueStatus);
  const [validateRePassword, setValidaterePassword] =
    useState(defaultTrueStatus);

  const ref = useRef();
  const refUserName = useRef();
  const refButtonSubmit = useRef();
  const navigate = useNavigate();

  //Autocomplete list type:
  const options = [
    { value: "company", label: "Doanh nghiệp" },
    { value: "student", label: "Sinh viên" },
  ];

  function handleChangeUserName(e) {
    setAccount((preUser) => {
      return { ...preUser, username: e.target.value.trim() };
    });
  }

  function handleChangePassword(e) {
    setAccount((preUser) => {
      return { ...preUser, password: e.target.value };
    });
  }

  function handleChangeFullName(e) {
    setAccount((preUser) => {
      return { ...preUser, fullname: e.target.value.trim() };
    });
  }

  function handleChangeBirthday(date, dateString) {
    setAccount((preUser) => {
      return { ...preUser, birthday: dateString };
    });
  }

  function handleChangeEmail(e) {
    setAccount((preUser) => {
      return { ...preUser, email: e.target.value.trim() };
    });
  }

  function handleChangePhone(e) {
    setAccount((preUser) => {
      return { ...preUser, phone: e.target.value.trim() };
    });
  }

  function handleChangeSelect(value) {
    setAccount((preUser) => {
      return { ...preUser, role: value };
    });
  }

  function handleChangeRePassword(e) {
    setRepassword(e.target.value);
  }

  function handleKeyUp(e) {
    if (e.keyCode === 13) {
     // console.log("enter");
      refButtonSubmit.current.focus();
      refButtonSubmit.current.click();
    }
  }

  function checkMailFunc(email) {
    if (!checkMail(email)) {
      setValidateEmail({
        status: "error",
        errorMsg: messageSignUpError.email,
      });
      return false;
    } else {
      setValidateEmail({
        status: "success",
        errorMsg: null,
      });
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
      setValidatePhone({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  function checkUserNameFunc(username) {
    if (!checkUsername(username)) {
      setValidateUsername({
        status: "error",
        errorMsg: messageSignUpError.username,
      });
      return false;
    } else {
      setValidateUsername({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  function checkPasswordFunc(password) {
    if (!checkPassword(password)) {
      setValidatePassword({
        status: "error",
        errorMsg: messageSignUpError.password,
      });
      return false;
    } else {
      setValidatePassword({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  function checkRePasswordFunc(repassword, password) {
    if (repassword !== password) {
      setValidaterePassword({
        status: "error",
        errorMsg: messageSignUpError.confirmpassword,
      });
      return false;
    } else {
      setValidaterePassword({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  function checkRoleFunc(role) {
    if (!checkRole(role)) {
      setValidateRole({
        status: "error",
        errorMsg: messageSignUpError.role,
      });
      return false;
    } else {
      setValidateRole({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  function checkFullNameFunc(fullname) {
    if (!checkFullName(fullname)) {
      setValidateFullname({
        status: "error",
        errorMsg: messageSignUpError.fullname,
      });
      return false;
    } else {
      setValidateFullname({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  function checkBirthdayFunc(birthday) {
    if (!checkBirthday(birthday)) {
      setValidateBirthday({
        status: "error",
        errorMsg: messageSignUpError.birthday,
      });
      return false;
    } else {
      setValidateBirthday({
        status: "success",
        errorMsg: null,
      });
      return true;
    }
  }

  async function handleSubmit(e) {
    ref.current.submit();
    let count = 0;
    count = checkMailFunc(account.email) ? count : count + 1;
    count = checkPhoneFunc(account.phone) ? count : count + 1;
    count = checkFullNameFunc(account.fullname) ? count : count + 1;
    count = checkPasswordFunc(account.password) ? count : count + 1;
    count = checkRoleFunc(account.role) ? count : count + 1;
    count = checkUserNameFunc(account.username) ? count : count + 1;
    count = checkBirthdayFunc(account.birthday) ? count : count + 1;
    count = checkRePasswordFunc(repassword, account.password)
      ? count
      : count + 1;

    if (count === 0) {
      const url = serverURL + "auth/register";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(account),
        });
        const result = await response.json();
        //const response = await axios.post(url, JSON.stringify(account),{})
        if (response.status !== 201) {
          if(response.status===400){
            if(result.message==='username'){
              openNotificationWithIcon('error','Thông tin nhập chưa đúng',messageSignUpError.existUsername)
              setValidateUsername({
                status: "error",
                errorMsg: messageSignUpError.existUsername,
              });
            }
            if(result.message==='email'){
              openNotificationWithIcon('error','Thông tin nhập chưa đúng',messageSignUpError.existEmail)
              setValidateEmail({
                status: "error",
                errorMsg: messageSignUpError.existEmail,
              });
            }
          }else
            message.error("Đăng ký không thành công!");
        } else {
          message.success("Bạn đã đăng ký thành công");
          navigate("/sign-in");
        }
      } catch (err) {
       // console.log(err);
      }
    }else{
      openNotificationWithIcon('error','Sai thông tin', 'Bạn chưa điền đúng thông tin!')
    }
    return;
  }
  const [form] = Form.useForm();

  function handleReset() {
    setAccount((preUser) => {
      return {
        ...preUser,
        username: "",
        password: "",
        fullname: "",
        email: "",
        birthday: "",
        phone: "",
        role: "",
      };
    });
    form.resetFields();
    setRepassword("");
  }

  return (
    <div className="register-container">
      <div className="left-register"></div>
      <div className="flex-container register">
        <Form
          form={form}
          ref={ref}
          onKeyUp={handleKeyUp}
          className="form"
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Typography type="secondary" className="title m-x-30px">
            ĐĂNG KÝ
          </Typography>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            validateStatus={validateUsername.status}
            help={validateUsername.errorMsg}
            rules={[{ required: true, message: "Hãy nhập Tên đăng nhập!" }]}
            tooltip={{
              title: "Tên đăng nhập là duy nhất",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input
              ref={refUserName}
              className="input-login"
              placeholder="Nhập tên đăng nhập"
              autoFocus={true}
              prefix={<UserOutlined className="input-icon" />}
              suffix={
                <Tooltip title="Tên đăng nhập là duy nhất">
                  <InfoCircleOutlined className="input-icon opacity-less" />
                </Tooltip>
              }
              value={account.username}
              onChange={handleChangeUserName}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            validateStatus={validatePassword.status}
            help={validatePassword.errorMsg}
            rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
            tooltip={{
              title: "mật khẩu bao gồm 8 kí tự trở lên, có cả chữ và số! ",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input.Password
              className="input-login"
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              prefix={<KeyOutlined className="input-icon" />}
              value={account.password}
              onChange={handleChangePassword}
            />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu"
            name="re-password"
            validateStatus={validateRePassword.status}
            help={validateRePassword.errorMsg}
            rules={[{ required: true, message: "Hãy nhập lại mật khẩu!" }]}
            tooltip={{
              title: "mật khẩu bao gồm 8 kí tự trở lên, có cả chữ và số! ",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input.Password
              className="input-login"
              placeholder="Nhập lại mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              prefix={<KeyOutlined className="input-icon" />}
              value={repassword}
              onChange={handleChangeRePassword}
            />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="fullname"
            validateStatus={validateFullname.status}
            help={validateFullname.errorMsg}
            rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
          >
            <Input
              className="input-login"
              placeholder="Nhập họ và tên"
              autoFocus={true}
              value={account.fullname}
              onChange={handleChangeFullName}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            validateStatus={validateEmail.status}
            help={validateEmail.errorMsg}
            rules={[{ required: true, message: "Hãy nhập Email!" }]}
            tooltip={{
              title: "Email là duy nhất",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input
              className="input-login"
              placeholder="Nhập Email"
              type="email"
              autoFocus={true}
              prefix={<MailOutlined className="input-icon" />}
              value={account.email}
              onChange={handleChangeEmail}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            validateStatus={validatePhone.status}
            help={validatePhone.errorMsg}
            rules={[{ required: true, message: "Hãy nhập Số điện thoại!" }]}
          >
            <Input
              className="input-login"
              placeholder="Nhập Số điện thoại"
              autoFocus={true}
              prefix={
                <>
                  <PhoneOutlined className="input-icon" />
                </>
              }
              value={account.phone}
              onChange={handleChangePhone}
            />
          </Form.Item>
          <div className="two-colums">
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              validateStatus={validateBirthday.status}
              help={validateBirthday.errorMsg}
              rules={[{ required: true, message: "Hãy nhập Ngày sinh!" }]}
            >
              <DatePicker
                className="birthday-input"
                autoFocus={true}
                value={account.birthday}
                onChange={handleChangeBirthday}
              />
            </Form.Item>
            <Form.Item
              name="role"
              label="Đối tượng"
              rules={[{ required: true }]}
              validateStatus={validateRole.status}
              help={validateRole.errorMsg}
              tooltip={{
                title: "Chỉ được chọn 1",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Select
                className="select"
                placeholder="Bạn là ai?"
                allowClear
                onChange={handleChangeSelect}
                options={options}
                popupClassName="dropdown"
              ></Select>
            </Form.Item>
          </div>
          <Form.Item name="register">
            Bạn đã có tài khoản? <Link to="/sign-in">Đăng nhập</Link>
          </Form.Item>
          <Form.Item name="submitframe">
            <Button
              type="submit"
              ref={refButtonSubmit}
              name="button-submit"
              className="button submit"
              onSubmit={handleSubmit}
              onClick={handleSubmit}
              onKeyUp={handleKeyUp}
            >
              Đăng ký
            </Button>
            <Button onClick={handleReset} className="button reset">
              Làm mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
