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
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Skeleton,
  Tag,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import { majorList, universityList } from "../../data/list";
import {
  checkAddress,
  checkBirthday,
  checkCardStudent,
  checkCCCD,
  checkCourse,
  checkFaculty,
  checkFullName,
  checkGPA,
  checkMail,
  checkMajor,
  checkPhone,
  checkUniversity,
} from "../../common/validation";
import { messageSignUpError, messageStudentError } from "../../common/error";
import {
  createNoti,
  DateToShortString,
  getUserAdmin,
  openNotificationWithIcon,
} from "../../common/service";
import * as moment from "moment";
import { domain } from "../../data/default-image";
const { Option } = Select;

let initialStudent = {
  _id: -1,
  cccd: "",
  address: "",
  university: "",
  faculty: "",
  course: "",
  gpa: "",
  status: false,
  avatar: "",
  card_student: "",
  major: "",
};

export const StudentProfile = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [account, setAccount] = useState(user);
  const [student, setStudent] = useState(initialStudent);
  const defaultTrueStatus = {
    status: "success",
    errorMsg: null,
  };

  async function fetchStudent() {
    if (account) {
      try {
        const _id = account._id;
        const url = serverURL + "student/" + _id;
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
            setStudent({ ...initialStudent });
          } else {
           // console.log("fetch student", result.data);
            setStudent({ ...result.data });
          }
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
        if (!result || result.role !== "student") {
          message.warn("Bạn ko có quyền xem trang này");
          navigate("/");
        }
        setAccount({ ...result });
        // changeUser({...result})
      }
    } catch (err) {
     // console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchStudent();
  }, [account]);

  const [validateFullname, setValidateFullname] = useState(defaultTrueStatus);
  const [validatePhone, setValidatePhone] = useState(defaultTrueStatus);
  const [validateEmail, setValidateEmail] = useState(defaultTrueStatus);
  const [validateCCCD, setValidateCCCD] = useState(defaultTrueStatus);
  const [validateAddress, setValidateAddress] = useState(defaultTrueStatus);
  const [validateCardStudent, setValidateCardStudent] =
    useState(defaultTrueStatus);
  const [validateUniversity, setValidateUniversity] =
    useState(defaultTrueStatus);
  const [validateFaculty, setValidateFaculty] = useState(defaultTrueStatus);
  const [validateMajor, setValidateMajor] = useState(defaultTrueStatus);
  const [validateCourse, setValidateCourse] = useState(defaultTrueStatus);
  const [validateGPA, setValidateGPA] = useState(defaultTrueStatus);
  const [validateBirthday, setValidateBirthday] = useState(defaultTrueStatus);

  const resetStatus = () => {
    setValidateFullname(defaultTrueStatus);
    setValidatePhone(defaultTrueStatus);
    setValidateEmail(defaultTrueStatus);
    setValidateCCCD(defaultTrueStatus);
    setValidateAddress(defaultTrueStatus);
    setValidateCardStudent(defaultTrueStatus);
    setValidateUniversity(defaultTrueStatus);
    setValidateFaculty(defaultTrueStatus);
    setValidateMajor(defaultTrueStatus);
    setValidateCourse(defaultTrueStatus);
    setValidateGPA(defaultTrueStatus);
    setValidateBirthday(defaultTrueStatus);
  };
  const ref = useRef();
  const refButtonSubmit = useRef();

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

  function checkFullNameFunc(fullname) {
    if (!checkFullName(fullname)) {
      setValidateFullname({
        status: "error",
        errorMsg: messageSignUpError.fullname,
      });
      return false;
    } else {
      setValidateFullname(defaultTrueStatus);
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
      setValidateBirthday(defaultTrueStatus);
      return true;
    }
  }

  function checkUniversityFunc(university) {
    if (!checkUniversity(university)) {
      setValidateUniversity({
        status: "error",
        errorMsg: messageStudentError.university,
      });
      return false;
    } else {
      setValidateUniversity(defaultTrueStatus);
      return true;
    }
  }

  function checkFacultyFunc(faculty) {
    checkFaculty(faculty);
    if (!checkFaculty(faculty)) {
      setValidateFaculty({
        status: "error",
        errorMsg: messageStudentError.faculty,
      });
      return false;
    } else {
      setValidateFaculty(defaultTrueStatus);
      return true;
    }
  }

  function checkCourseFunc(Course) {
    if (!checkCourse(Course)) {
      setValidateCourse({
        status: "error",
        errorMsg: messageStudentError.course,
      });
      return false;
    } else {
      setValidateCourse(defaultTrueStatus);
      return true;
    }
  }

  function checkCCCDFunc(CCCD) {
    if (!checkCCCD(CCCD)) {
      setValidateCCCD({
        status: "error",
        errorMsg: messageStudentError.CCCD,
      });
      return false;
    } else {
      setValidateCCCD(defaultTrueStatus);
      return true;
    }
  }

  function checkAddressFunc(Address) {
    if (!checkAddress(Address)) {
      setValidateAddress({
        status: "error",
        errorMsg: messageStudentError.Address,
      });
      return false;
    } else {
      setValidateAddress(defaultTrueStatus);
      return true;
    }
  }
  function checkCardStudentFunc(CardStudent) {
    if (!checkCardStudent(CardStudent)) {
      setValidateCardStudent({
        status: "error",
        errorMsg: messageStudentError.CardStudent,
      });
      return false;
    } else {
      setValidateCardStudent(defaultTrueStatus);
      return true;
    }
  }
  function checkMajorFunc(Major) {
    if (!checkMajor(Major)) {
      setValidateMajor({
        status: "error",
        errorMsg: messageStudentError.Major,
      });
      return false;
    } else {
      setValidateMajor(defaultTrueStatus);
      return true;
    }
  }
  function checkGPAFunc(GPA) {
    if (!checkGPA(GPA)) {
      setValidateGPA({
        status: "error",
        errorMsg: messageStudentError.GPA,
      });
      return false;
    } else {
      setValidateGPA(defaultTrueStatus);
      return true;
    }
  }

  function checkChangeAccount() {
    if (
      account.fullname !== user.fullname ||
      account.email !== user.email ||
      account.phone !== user.phone ||
      account.birthday !== user.birthday
    ) {
      return true;
    }
    return false;
  }

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
  async function updateAccount() {
    const url = serverURL + "account/" + account._id;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(account),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 200) {
        message.error(result.message);
      } else {
        message.success("Bạn đã sửa thành công!");
        setIsEdit(false);
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
    fetchAccount();
  }

  async function updateStudent() {
    if (student._id === -1) {
      const url = serverURL + "student";
      const data = { ...student, _id: account._id, id_account: account._id };
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
       console.log(result);
        if (response.status !== 201) {
          message.error(result.message);
          return;
        } else {
          const link = "admin/student/" + student._id;
          const title = "Yêu cầu duyệt thông tin sinh viên";
          const type = "infor";
          const content = `Sinh viên ${account.fullname} yêu cầu duyệt thông tin sinh viên.`;
          const listAdmin = await getUserAdmin();
          if (!listAdmin.length) {
            message.info("Chưa có admin, hãy tạo tài khoản admin");
          } else {
            createNoti(account._id, listAdmin, title, type, content, link);
          }
          openNotificationWithIcon('success', 'Thông báo', 'Bạn đã cập nhật thành công! Hãy đợi admin duyệt!')
          setIsEdit(false);
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra!");
        return;
      }
    } else {
      const url = serverURL + "student/" + student._id;
      const data = {
        address: student.address,
        cccd: student.cccd,
        university: student.university,
        faculty: student.faculty,
        major: student.major,
        course: student.course,
        gpa: student.gpa,
        card_student: student.card_student,
        update_id: account._id,
        status: false,
      };
     // console.log("update", data);
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
          return;
        } else {
          const link = "admin/student/" + student._id;
          const title = "Yêu cầu duyệt thông tin sinh viên";
          const type = "infor";
          const content = `Sinh viên ${account.fullname} yêu cầu duyệt thông tin sinh viên.`;
          const listAdmin = await getUserAdmin();
         // console.log("listAdmin", listAdmin);
          if (!listAdmin.length) {
            message.info("Chưa có admin, hãy tạo tài khoản admin");
          } else {
            createNoti(account._id, listAdmin, title, type, content, link);
          }
          openNotificationWithIcon('success', 'Thông báo', 'Bạn đã sửa thành công! Hãy đợi admin duyệt!')
          setIsEdit(false);
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra!");
        return;
      }
    }
    fetchStudent();
  }
  async function handleSave(e) {
    ref.current.submit();
    let count = 0;
   // console.log("account", account);
   // console.log("student", student);
    count = checkFullNameFunc(account.fullname) ? count : count + 1;
    count = checkMailFunc(account.email) ? count : count + 1;
    count = checkPhoneFunc(account.phone) ? count : count + 1;
    count = checkUniversityFunc(student.university) ? count : count + 1;
    count = checkFacultyFunc(student.faculty) ? count : count + 1;
    count = checkCourseFunc(student.course) ? count : count + 1;
    count = checkCCCDFunc(student.cccd) ? count : count + 1;
    count = checkAddressFunc(student.address) ? count : count + 1;
    count = checkCardStudentFunc(student.card_student) ? count : count + 1;
    count = checkBirthdayFunc(account.birthday) ? count : count + 1;
    count = checkMajorFunc(student.major) ? count : count + 1;
    count = checkGPAFunc(student.gpa) ? count : count + 1;
   // console.log("count", count);
    if (count === 0) {
      if (checkChangeAccount()) {
        updateAccount();
      }
      updateStudent();
    }else{
      openNotificationWithIcon('error', 'Sai thông tin', 'Bạn nhập thông tin chưa chính xác!')
    }
    return;
  }

  async function handleCancel(e) {
    resetStatus();
    fetchAccount();
    fetchStudent();
    setIsEdit(false);
    return;
  }

  const renderButtonGroup = () => {
    if (!isEdit) {
      return (
        <Button type="submit" className="button edit-btn" onClick={handleEdit}>
          {student._id === -1 ? "Cập nhật" : "Sửa"}
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
    if (student.status) {
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

  function handleChangeFullName(e) {
    setAccount((preUser) => {
      return { ...preUser, fullname: e.target.value };
    });
  }

  function handleChangeEmail(e) {
   // console.log(e.target.value);
    setAccount((preUser) => {
      return { ...preUser, email: e.target.value };
    });
  }

  function handleChangePhone(e) {
    setAccount((preUser) => {
      return { ...preUser, phone: e.target.value };
    });
  }

  function handleChangeFaculty(e) {
    setStudent((preStudent) => {
      return { ...preStudent, faculty: e.target.value };
    });
  }

  function handleChangeCourse(e) {
    setStudent((preStudent) => {
      return { ...preStudent, course: e.target.value };
    });
  }

  function handleChangeCCCD(e) {
    setStudent((preStudent) => {
      return { ...preStudent, cccd: e.target.value };
    });
  }

  function handleChangeAddress(e) {
    setStudent((preStudent) => {
      return { ...preStudent, address: e.target.value };
    });
  }

  function handleChangeCardStudent(e) {
    setStudent((preStudent) => {
      return { ...preStudent, card_student: e.target.value };
    });
  }
  function handleChangeBirthday(date, dateString) {
    setAccount((preStudent) => {
      return { ...preStudent, birthday: dateString };
    });
  }
  function handleChangeGPA(value) {
    setStudent((preStudent) => {
      return { ...preStudent, gpa: value };
    });
  }
  function handleChangeMajor(value) {
    setStudent((preStudent) => {
      return { ...preStudent, major: value };
    });
  }
  function handleChangeUniversity(value) {
   // console.log(value);
    setStudent((preStudent) => {
      return { ...preStudent, university: value };
    });
  }
  if (account) {
    return (
      <div className="swapper-container">
        <div className="introduce-frame">
          <div className="background-image"></div>
          <div className="introduce-bottom">
          <div className='avatar-container'>
            {
              account.avatar?
              <Avatar className="avatar" size={120} src={domain+account.avatar} />
              :
              <Avatar className="avatar" size={120} icon={<UserOutlined />} />
            }
          </div>
            <div className="introduce-fullname">{account.fullname}</div>
          </div>
        </div>
        <div className="detail-swapper">
          <p className="title-account">Thông tin sinh viên</p>
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
                  label="Họ và tên"
                  name="fullname"
                  initialValue={account.fullname}
                  validateStatus={validateFullname.status}
                  help={validateFullname.errorMsg}
                  className="label"
                >
                  {/* {isEdit ? (
                    <Input
                      disabled={!isEdit}
                      className="input-login max-width"
                      placeholder="Nhập họ và tên"
                      autoFocus={true}
                      value={account.fullname}
                      onChange={handleChangeFullName}
                    />
                  ) : ( */}
                    <p className="text-display">{account.fullname}</p>
                  {/* )} */}
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  initialValue={account.email}
                  validateStatus={validateEmail.status}
                  help={validateEmail.errorMsg}
                  className="label"
                >
                  {/* {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập Email"
                      type="email"
                      disabled={!isEdit}
                      autoFocus={true}
                      prefix={<MailOutlined className="input-icon" />}
                      value={account.email}
                      onChange={handleChangeEmail}
                    />
                  ) : ( */}
                    <p className="text-display">{account.email}</p>
                  {/* )} */}
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  initialValue={account.phone}
                  validateStatus={validatePhone.status}
                  help={validatePhone.errorMsg}
                  className="label"
                >
                  {/* {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập Số điện thoại"
                      autoFocus={true}
                      disabled={!isEdit}
                      prefix={
                        <>
                          <PhoneOutlined className="input-icon" />
                        </>
                      }
                      value={account.phone}
                      onChange={handleChangePhone}
                    />
                  ) : ( */}
                    <p className="text-display">{account.phone}</p>
                  {/* )} */}
                </Form.Item>
                <Form.Item
                  label="Trường"
                  name="university"
                  className="label"
                  validateStatus={validateUniversity.status}
                  help={validateUniversity.errorMsg}
                >
                  {isEdit ? (
                    <Select
                      showSearch
                      value={student.university}
                      defaultValue={student.university}
                      optionFilterProp="children"
                      onChange={handleChangeUniversity}
                      style={{ width: "100%" }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {universityList.map((item) => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <p className="text-display">{student.university}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Khoa"
                  name="faculty"
                  validateStatus={validateFaculty.status}
                  help={validateFaculty.errorMsg}
                  className="label"
                >
                  {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập khoa"
                      autoFocus={true}
                      disabled={!isEdit}
                      value={student.faculty}
                      defaultValue={student.faculty}
                      onChange={handleChangeFaculty}
                    />
                  ) : (
                    <p className="text-display">{student.faculty}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Chuyên ngành"
                  name="major"
                  className="label"
                  validateStatus={validateMajor.status}
                  help={validateMajor.errorMsg}
                >
                  {isEdit ? (
                    <Select
                      showSearch
                      value={student.major}
                      optionFilterProp="children"
                      onChange={handleChangeMajor}
                      style={{ width: "100%" }}
                      defaultValue={student.major}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {majorList.map((item) => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <p className="text-display">{student.major}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Khóa học"
                  name="course"
                  validateStatus={validateCourse.status}
                  help={validateCourse.errorMsg}
                  className="label"
                >
                  {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập khóa học"
                      autoFocus={true}
                      disabled={!isEdit}
                      value={student.course}
                      defaultValue={student.course}
                      onChange={handleChangeCourse}
                    />
                  ) : (
                    <p className="text-display">{student.course}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="CCCD"
                  name="cccd"
                  validateStatus={validateCCCD.status}
                  help={validateCCCD.errorMsg}
                  className="label"
                >
                  {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập CCCD"
                      autoFocus={true}
                      disabled={!isEdit}
                      value={student.cccd}
                      defaultValue={student.cccd}
                      onChange={handleChangeCCCD}
                    />
                  ) : (
                    <p className="text-display">{student.cccd}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  validateStatus={validateAddress.status}
                  help={validateAddress.errorMsg}
                  className="label"
                >
                  {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập địa chỉ"
                      autoFocus={true}
                      disabled={!isEdit}
                      value={student.address}
                      defaultValue={student.address}
                      onChange={handleChangeAddress}
                    />
                  ) : (
                    <p className="text-display">{student.address}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Mã sinh viên"
                  name="card_student"
                  validateStatus={validateCardStudent.status}
                  help={validateCardStudent.errorMsg}
                  className="label"
                >
                  {isEdit ? (
                    <Input
                      className="input-login max-width"
                      placeholder="Nhập mã sinh viên"
                      autoFocus={true}
                      disabled={!isEdit}
                      value={student.card_student}
                      defaultValue={student.card_student}
                      onChange={handleChangeCardStudent}
                    />
                  ) : (
                    <p className="text-display">{student.card_student}</p>
                  )}
                </Form.Item>
                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  validateStatus={validateBirthday.status}
                  help={validateBirthday.errorMsg}
                  className="label"
                >
                  {/* {isEdit ? (
                    <DatePicker
                      className="birthday-input"
                      autoFocus={true}
                      defaultValue={moment(
                        moment(account.birthday),
                        "DD/MM/YYYY"
                      )}
                      value={account.birthday}
                      onChange={handleChangeBirthday}
                    />
                  ) : ( */}
                    <p className="text-display">
                      {DateToShortString(account.birthday)}
                    </p>
                  {/* )} */}
                </Form.Item>
                <Form.Item
                  label="GPA"
                  name="gpa"
                  validateStatus={validateGPA.status}
                  help={validateGPA.errorMsg}
                  className="label"
                >
                  {isEdit ? (
                    <InputNumber
                      className="input-login max-width"
                      style={{ width: "100%" }}
                      placeholder="Nhập GPA"
                      min={0}
                      max={4}
                      step={0.01}
                      autoFocus={true}
                      disabled={!isEdit}
                      value={student.gpa}
                      defaultValue={student.gpa}
                      onChange={handleChangeGPA}
                    />
                  ) : (
                    <p className="text-display">{student.gpa}</p>
                  )}
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                  <div className="status">{renderStatus()}</div>
                </Form.Item>
                <Form.Item>
                  <div>
                    <BulbOutlined
                      className="warnings"
                      color="yellow"
                      size={40}
                    />
                    <span>
                      Hãy cập nhật thông tin đầy đủ để có thể sử dụng các chức
                      năng của hệ thống!
                    </span>
                  </div>
                </Form.Item>
              </div>
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
  } else {
    return <Skeleton active />;
  }
};
