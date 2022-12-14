import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import {
  checkString,
  checkNumber,
  checkDate,
  checkArray,
  checkSpecial,
} from "../../common/validation";
import { messageRecruitError } from "../../common/error";
import { genderList, levelList, wayWorkingList } from "../../data/list";
import { createNoti, getUserAdmin, openNotificationWithIcon, postFields } from "../../common/service";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;

let initialRecruit = {
  _id: -1,
  title: "",
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
  end_date: "",
  id_company: "",
  fields: [],
};

let initialCompany = {};

export const AddRecruit = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const [isOpenModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [account, setAccount] = useState(user);
  const [company, setCompany] = useState(initialCompany);
  const [recruit, setRecruit] = useState(initialRecruit);
  const [fields, setFields] = useState([]);
  const defaultTrueStatus = {
    status: "success",
    errorMsg: null,
  };

  //fetch manucomany and Company
  async function fetchManuCompany() {
    if (user) {
      try {
        const _id = user._id;
        const url = serverURL + "manu-company/company/" + _id;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.status !== 200) {
         // console.log("L???i h??? th???ng!");
          message.error("L???i h??? th???ng!");
        } else {
         console.log("result", result);
          if (result.data === "empty") {
            //   setOpenModal(true);
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
    if (user) {
      try {
        const _id = user._id;
        const url = serverURL + "company/" + _id;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.status !== 200) {
         // console.log("L???i h??? th???ng!");
          message.error("L???i h??? th???ng!");
        } else {
         console.log("result", result);
          if (result.data === "empty") {
            setOpenModal(true);
            setCompany({ ...initialCompany });
          } else {
            if(result.data.status === false){
              openNotificationWithIcon('warning', 'C???nh b??o', 'Th??ng tin c???a b???n ch??a ???????c duy???t nh??!')
              navigate("/home");
              return;
            }
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
          const manuList = postFields();
          setFields(manuList);
        }
      setFields(result.data);
      }
    } catch (err) {
     // console.log(err);
      message.error("???? c?? l???i x???y ra!");
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
        message.error("L???i h??? th???ng load user!");
      } else {
       // console.log("user fetch to set role", result);
        if (!result || result.role !== "company") {
          message.warn("B???n ko c?? quy???n xem trang n??y");
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
    fetchCompany();
  }, [user]);
  useEffect(() => {
    fetchField();
  }, []);

  //initial Validate
  const [validateTitle, setValidateTitle] = useState(defaultTrueStatus);
  const [validateWayWorking, setValidateWayWorking] =
    useState(defaultTrueStatus);
  const [validateSalary, setValidateSalary] = useState(defaultTrueStatus);
  const [validateQuantity, setValidateQuantity] = useState(defaultTrueStatus);
  const [validateLevel, setValidateLevel] = useState(defaultTrueStatus);
  const [validateAddressWorking, setValidateAddressWorking] =
    useState(defaultTrueStatus);
  const [validateExperience, setValidateExperience] =
    useState(defaultTrueStatus);
  const [validateEndDate, setValidateEndDate] = useState(defaultTrueStatus);
  const [validateRequirement, setValidateRequirement] =
    useState(defaultTrueStatus);
  const [validateWelfare, setValidateWelfare] = useState(defaultTrueStatus);
  const [validateFields, setValidateFields] = useState(defaultTrueStatus);
  const [validateDescription, setValidateDescription] = useState(defaultTrueStatus)
  const ref = useRef();
  // const refButtonSubmit = useRef();

  //validate
  function checkTitleFunc(title) {
    if (!checkSpecial(title, 50)) {
      setValidateTitle({
        status: "error",
        errorMsg: messageRecruitError.title,
      });
      return false;
    } else {
      setValidateTitle(defaultTrueStatus);
      return true;
    }
  }
  function checkWayWorkingFunc(WayWorking) {
    if (!checkSpecial(WayWorking, 1000)) {
      setValidateWayWorking({
        status: "error",
        errorMsg: messageRecruitError.way_working,
      });
      return false;
    } else {
      setValidateWayWorking(defaultTrueStatus);
      return true;
    }
  }
  function checkSalaryFunc(salary) {
    if (!checkNumber(salary)) {
      setValidateSalary({
        status: "error",
        errorMsg: messageRecruitError.salary,
      });
      return false;
    } else {
      setValidateSalary(defaultTrueStatus);
      return true;
    }
  }
  function checkQuantityFunc(Quantity) {
    if (!checkNumber(Quantity)) {
      setValidateQuantity({
        status: "error",
        errorMsg: messageRecruitError.quantity,
      });
      return false;
    } else {
      setValidateQuantity(defaultTrueStatus);
      return true;
    }
  }
  function checkLevelFunc(level) {
    if (!checkString(level)) {
      setValidateLevel({
        status: "error",
        errorMsg: messageRecruitError.level,
      });
      return false;
    } else {
      setValidateLevel(defaultTrueStatus);
      return true;
    }
  }
  function checkAddressWorkingFunc(address_working) {
    if (!checkSpecial(address_working, 1000)) {
      setValidateAddressWorking({
        status: "error",
        errorMsg: messageRecruitError.address_working,
      });
      return false;
    } else {
      setValidateAddressWorking(defaultTrueStatus);
      return true;
    }
  }
  function checkExperienceFunc(experience) {
    if (!checkNumber(experience)) {
      setValidateExperience({
        status: "error",
        errorMsg: messageRecruitError.experience,
      });
      return false;
    } else {
      setValidateExperience(defaultTrueStatus);
      return true;
    }
  }

  function checkDescriptionFunc(Description) {
    if (!checkSpecial(Description, 1000)) {
      setValidateDescription({
        status: "error",
        errorMsg: messageRecruitError.description,
      });
      return false;
    } else {
      setValidateDescription(defaultTrueStatus);
      return true;
    }
  }

  function checkRequirementFunc(requirement) {
    if (!checkSpecial(requirement, 1000)) {
      setValidateRequirement({
        status: "error",
        errorMsg: messageRecruitError.requirement,
      });
      return false;
    } else {
      setValidateRequirement(defaultTrueStatus);
      return true;
    }
  }
  function checkWelfareFunc(welfare) {
    if (!checkSpecial(welfare, 1000)) {
      setValidateWelfare({
        status: "error",
        errorMsg: messageRecruitError.welfare,
      });
      return false;
    } else {
      setValidateWelfare(defaultTrueStatus);
      return true;
    }
  }
  function checkEndDateFunc(End_date) {
    if (!checkDate(End_date)) {
      setValidateEndDate({
        status: "error",
        errorMsg: messageRecruitError.end_date,
      });
      return false;
    } else {
      setValidateEndDate(defaultTrueStatus);
      return true;
    }
  }
  function checkFieldFunc(fields) {
   // console.log("fields", fields);
    if (!checkArray(fields)) {
      setValidateFields({
        status: "error",
        errorMsg: messageRecruitError.field,
      });
      return false;
    } else {
      setValidateFields(defaultTrueStatus);
      return true;
    }
  }
  //handle action
  async function createRecruit() {
    const url = serverURL + "recruit";
    const data = { ...recruit, id_company: company._id };
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
      } else {
        const idRecruit = result._id;
       // console.log("idRecruit",idRecruit)
        openNotificationWithIcon('success', 'Th??nh c??ng', 'B???n ???? th??m b??i ????ng tuy???n d???ng th??nh c??ng! H??y ?????i admin duy???t!')
        const link = "admin/recruit/" + idRecruit+','+company._id;
        const title = "Y??u c???u duy???t th??ng tin b??i ????ng tuy???n d???ng";
        const type = "infor";
        const content = `Doanh nghi???p ${company.com_name} y??u c???u duy???t th??ng tin b??i ????ng tuy???n d???ng.`;
        const listAdmin = await getUserAdmin();
       // console.log("listAdmin", listAdmin);
        if (!listAdmin.length) {
          message.info("Ch??a c?? admin, h??y t???o t??i kho???n admin");
        } else {
          createNoti(user._id, listAdmin, title, type, content, link);
        }
        navigate("/company/recruit-list");
      }
    } catch (err) {
     // console.log(err);
      message.error("???? c?? l???i x???y ra!");
    }
  }
  async function handleSave(e) {
    ref.current.submit();
    let count = 0;
   // console.log("company", company);
    count = checkTitleFunc(recruit.title.trim()) ? count : count + 1;
   // console.log("1",count)
    count = checkWayWorkingFunc(recruit.way_working.trim()) ? count : count + 1;
   // console.log("2",count)
    count = checkSalaryFunc(recruit.salary) ? count : count + 1;
   // console.log("3",count)
    count = checkQuantityFunc(recruit.quantity) ? count : count + 1;
   // console.log("4",count)
    count = checkLevelFunc(recruit.level) ? count : count + 1;
   // console.log("5",count)
    count = checkAddressWorkingFunc(recruit.address_working.trim())
      ? count
      : count + 1;
     // console.log("6",count)
    count = checkExperienceFunc(recruit.experience) ? count : count + 1;
   // console.log("7",count)
    count = checkRequirementFunc(recruit.requirement.trim()) ? count : count + 1;
    count = checkDescriptionFunc(recruit.description.trim())?count:count+1;
   // console.log("8",count)
    count = checkWelfareFunc(recruit.welfare.trim()) ? count : count + 1;
   // console.log("9",count)
    count = checkEndDateFunc(recruit.end_date) ? count : count + 1;
   // console.log("10",count)
    count = checkFieldFunc(recruit.fields) ? count : count + 1;
   // console.log("count", count);
   // console.log(recruit);
    if (count === 0) {
      createRecruit();
    }else{
      openNotificationWithIcon('error', 'Sai th??ng tin', 'B???n nh???p th??ng tin ch??a ch??nh x??c!')
    }
    return;
  }

  const renderButtonGroup = () => {
    return (
      <Button type="submit" className="button edit-btn" onClick={handleSave}>
        Th??m
      </Button>
    );
  };
  function handleChangeTitle(e) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, title: e.target.value };
    });
  }
  function handleChangeWayWorking(value) {
   // console.log(value);
    setRecruit((preRecruit) => {
      return { ...preRecruit, way_working: value };
    });
  }
  function handleChangeSalary(value) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, salary: value };
    });
  }
  function handleChangeQuatity(value) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, quantity: value };
    });
  }
  function handleChangeLevel(value) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, level: value };
    });
  }
  function handleChangeAddressWorking(e) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, address_working: e.target.value };
    });
  }
  function handleChangeExperience(value) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, experience: value };
    });
  }
  function handleChangeDescription(e) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, description: e.target.value };
    });
  }
  function handleChangeRequirement(e) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, requirement: e.target.value };
    });
  }
  function handleChangeWelfare(e) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, welfare: e.target.value };
    });
  }
  function handleChangeEndDate(date, dateString) {
    setRecruit((preRecruit) => {
      return { ...preRecruit, end_date: dateString };
    });
  }
  function handleChangeFields(value) {
   // console.log("value", value);
    setRecruit((preRecruit) => {
      return { ...preRecruit, fields: value };
    });
  }
  function handleChangeGender(value) {
   // console.log("value", value);
    setRecruit((preRecruit) => {
      return { ...preRecruit, gender: value };
    });
  }
  const handleOk = ()=>{
    setOpenModal(false)
    navigate('/../../company-profile');
  }

  const handleCancel = ()=>{
    setOpenModal(false)
    navigate('/../../company-profile');
  }


  if(company){
  //render UI
  return (
    <div className="swapper-container">
      <div className="introduce-frame">
        <div className="background-image center">
          <p className="title-account center ">Th??m b??i ????ng tuy???n d???ng</p>
        </div>
      </div>
      <div className="detail-swapper">
        <div className="underline"></div>
        <div className="body">
          <Form
            ref={ref}
            // onKeyUp={handleKeyUp}
            className="form"
            name="basic"
            layout="vertical"
            autoComplete="off"
          >
            <div className="title-recruit">
              <Form.Item
                label="Ti??u ????? b??i ????ng:"
                name="title"
                initialValue={recruit.title}
                validateStatus={validateTitle.status}
                help={validateTitle.errorMsg}
                className="label"
                tooltip={{ title: 'Ti??u ????? kh??ng qu?? 50 k?? t???, kh??ng ch???a k?? t??? ?????c bi???t', icon: <InfoCircleOutlined /> }}
                required
              >
                <Input
                  className=" max-width"
                  placeholder="Nh???p ti??u ????? b??i ????ng tuy???n d???ng"
                  autoFocus={true}
                  value={recruit.title}
                  onChange={handleChangeTitle}
                />
              </Form.Item>
            </div>
            <Card title="Chi ti???t b??i ????ng tuy???n d???ng">
              <div className="two-colums">
                <Form.Item
                  label="L????ng (VND/th??ng):"
                  name="salary"
                  initialValue={recruit.salary}
                  validateStatus={validateSalary.status}
                  help={validateSalary.errorMsg}
                  className="label"
                  tooltip={{ title: 'L????ng t??nh theo th??ng ????n v??? VND', icon: <InfoCircleOutlined /> }}
                  required
                >
                  <InputNumber
                    className=" max-width"
                    style={{ width: "100%" }}
                    placeholder="Nh???p l????ng"
                    step={1}
                    autoFocus={true}
                    value={recruit.salary}
                    defaultValue={recruit.salary}
                    onChange={handleChangeSalary}
                  />
                </Form.Item>

                <Form.Item
                  label="S??? l?????ng tuy???n:"
                  name="quantity"
                  initialValue={recruit.quantity}
                  validateStatus={validateQuantity.status}
                  help={validateQuantity.errorMsg}
                  className="label"
                  required
                >
                  <InputNumber
                    className=" max-width"
                    style={{ width: "100%" }}
                    placeholder="Nh???p s??? l?????ng tuy???n d???ng"
                    step={1}
                    autoFocus={true}
                    value={recruit.quantity}
                    defaultValue={recruit.quantity}
                    onChange={handleChangeQuatity}
                  />
                </Form.Item>

                <Form.Item
                  label="?????a ch??? l??m vi???c:"
                  name="address_working"
                  validateStatus={validateAddressWorking.status}
                  help={validateAddressWorking.errorMsg}
                  className="label"
                  tooltip={{ title: '?????a ch??? l??m vi???c kh??ng n??n vi???t t???t', icon: <InfoCircleOutlined /> }}
                  required
                >
                  <Input
                    className=" max-width"
                    placeholder="Nh???p ?????a ch??? website"
                    autoFocus={true}
                    value={recruit.address_working}
                    defaultValue={recruit.address_working}
                    onChange={handleChangeAddressWorking}
                  />
                </Form.Item>

                <Form.Item
                  label="Kinh nghi???m (s??? th??ng):"
                  name="experience"
                  initialValue={recruit.experience}
                  validateStatus={validateExperience.status}
                  help={validateExperience.errorMsg}
                  className="label"
                  tooltip={{ title: 'N???u kh??ng y??u c???u kinh nghi???m h??y ??i???n 0', icon: <InfoCircleOutlined /> }}
                  required
                >
                  <InputNumber
                    className=" max-width"
                    style={{ width: "100%" }}
                    placeholder="Nh???p s??? th??ng kinh nghi???m"
                    step={1}
                    autoFocus={true}
                    value={recruit.experience}
                    defaultValue={recruit.experience}
                    onChange={handleChangeExperience}
                  />
                </Form.Item>

                <Form.Item
                  label="Ph????ng th???c l??m vi???c:"
                  name="way_working"
                  validateStatus={validateWayWorking.status}
                  help={validateWayWorking.errorMsg}
                  className="label"
                  required
                >
                  <Select
                    label="Ph????ng th???c l??m vi???c"
                    style={{
                      width: "100%",
                    }}
                    defaultValue={recruit.way_working}
                    onChange={handleChangeWayWorking}
                  >
                    {wayWorkingList.map((way_working) => {
                      return (
                        <Option value={way_working} label={way_working}>
                          <div className="demo-option-label-item">
                            {way_working}
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Ch???c v???:"
                  name="level"
                  validateStatus={validateLevel.status}
                  help={validateLevel.errorMsg}
                  className="label"
                  required
                >
                  <Select
                    label="Ch???c v???"
                    style={{
                      width: "100%",
                    }}
                    defaultValue={recruit.level}
                    onChange={handleChangeLevel}
                  >
                    {levelList.map((level) => {
                      return (
                        <Option value={level} label={level}>
                          <div className="demo-option-label-item">{level}</div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item label="Gi???i t??nh:" name="gender" className="label">
                  <Select
                    label="Gi???i t??nh"
                    style={{
                      width: "100%",
                    }}
                    onChange={handleChangeGender}
                  >
                    {genderList.map((gender) => {
                      return (
                        <Option value={gender.id} label={gender.label}>
                          <div className="demo-option-label-item">
                            {gender.label}
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="L??nh v???c:"
                  name="fields"
                  validateStatus={validateFields.status}
                  help={validateFields.errorMsg}
                  className="label"
                  tooltip={{ title: 'C?? th??? ch???n nhi???u l??nh v???c tuy???n d???ng', icon: <InfoCircleOutlined /> }}
                  required
                >
                  <Select
                    mode="multiple"
                    label="L??nh v???c"
                    style={{
                      width: "100%",
                    }}
                    placeholder="H??y ch???n ??t nh???t m???t l??nh v???c"
                    defaultValue={recruit.fields}
                    onChange={handleChangeFields}
                    optionLabelProp="label"
                  >
                    {fields.map((field) => {
                      return (
                        <Option value={field._id} label={field.nameField}>
                          <div className="demo-option-label-item">
                            {field.nameField}
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              <Form.Item
                label="Th??ng tin m?? t??? c??ng vi???c:"
                name="description"
                initialValue={recruit.description}
                validateStatus={validateDescription.status}
                help={validateDescription.errorMsg}
                className="label"
                tooltip={{ title: 'Th??ng tin m?? t??? ng???n g???n kh??ng qu?? 1000 k?? t???', icon: <InfoCircleOutlined /> }}
                required
              >
                <TextArea
                  rows={5}
                  value={recruit.description}
                  defaultValue={recruit.description}
                  onChange={handleChangeDescription}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
              <Form.Item
                label="Th??ng tin y??u c???u ???ng tuy???n:"
                name="requirement"
                initialValue={recruit.requirement}
                validateStatus={validateRequirement.status}
                help={validateRequirement.errorMsg}
                className="label"
                tooltip={{ title: 'Th??ng tin y??u c???u ???ng tuy???n ng???n g???n kh??ng qu?? 1000 k?? t???', icon: <InfoCircleOutlined /> }}
                required
              >
                <TextArea
                  rows={5}
                  value={recruit.requirement}
                  defaultValue={recruit.requirement}
                  onChange={handleChangeRequirement}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
              <Form.Item
                label="Th??ng tin quy???n l???i:"
                name="welfare"
                initialValue={recruit.welfare}
                validateStatus={validateWelfare.status}
                help={validateWelfare.errorMsg}
                className="label"
                tooltip={{ title: 'Th??ng tin quy???n l???i ng???n g???n kh??ng qu?? 1000 k?? t???', icon: <InfoCircleOutlined /> }}
                required
              >
                <TextArea
                  rows={5}
                  value={recruit.welfare}
                  defaultValue={recruit.welfare}
                  onChange={handleChangeWelfare}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
              <div className="two-colums">
                <Form.Item
                  label="Ng??y k???t th??c:"
                  name="end_date"
                  className="label"
                  validateStatus={validateEndDate.status}
                  help={validateEndDate.errorMsg}
                  required
                >
                  <DatePicker
                    className="birthday-input"
                    value={recruit.end_date}
                    onChange={handleChangeEndDate}
                  />
                </Form.Item>
              </div>
            </Card>
            <Form.Item>
              <div className="group-button">{renderButtonGroup()}</div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title="X??c nh???n"
        open={isOpenModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>B???n h??y c???p nh???t th??ng tin ????? s??? d???ng c??c ch???c n??ng website!</p>
      </Modal>
    </div>
  );}
};
