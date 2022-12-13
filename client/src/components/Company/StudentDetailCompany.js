import { BankOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  message,
  Modal,
  Rate,
  Skeleton,
  Tag,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decodeToken } from "react-jwt";

import { UserContext } from "../User/UserProvider";
import "../../styles/form.css";
import "../../styles/my-account.css";
import {
  createNoti,
  openNotificationWithIcon,
} from "../../common/service";
import { serverURL } from "../../configs/server.config";
import { Email } from "./Email";
import { RateModal } from "./Rate";
import { RateCommentList } from "../Common/RateCommentList";
import { avatarImage, domain } from "../../data/default-image";

let initstudent = {
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
  account: {
    avatar: ''
  }
};

export const StudentDetailCompany = () => {
  const { user, changeUser, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [account, setAccount] = useState(user);
  const [student, setStudent] = useState(initstudent);
  const [CV, setCV] = useState(null);
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [rateList, setRateList] = useState([]);
  const [isOpenRate, setOpenRate] = useState(false);
  const [isOpenEmail, setOpenEmail] = useState(false);
  const [overall, setOverall] = useState(0);
  const [status, setStatus] = useState(0);

  const { id } = useParams();

  async function fetchStudent() {
    try {
      const url = serverURL + "student/admin/" + id;
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
          message.warning("Không tồn tại sinh viên mã đã tìm!");
          navigate("/home");
        } else {
         // console.log("result", result.data);
          setStudent(result.data);
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
        if (!result || result.role !== "company") {
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

  //FETCH CV
  async function fetchCV() {
    if (student && student._id !== -1) {
      const url = serverURL + "cv/" + student._id;
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
          if (!result.data.status) {
            openNotificationWithIcon(
              "warning",
              "Thông báo",
              "CV của sinh viên đã private vì đã được tuyển dụng hoặc vì một số lý do khác!"
            );
            setCV();
          } else {
            setCV({ ...result.data });
          }
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra!");
      }
    }
  }

  async function fetchApply() {
    if (account && student._id!=-1) {
      const url =
        serverURL +
        `apply/con?id_student=${student._id}&id_company=${account._id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.status !== 200) {
          message.error(result.message);
        } else {
          setStatus(result);
          switch(result){
            case 1: {
              openNotificationWithIcon(
                "info",
                "Thông báo",
                "Bạn đã gửi thư mời tuyển dụng cho sinh viên này!"
              );
              break;
            }

            case 2: {
              openNotificationWithIcon(
                "info",
                "Thông báo",
                "Sinh viên đã ứng tuyển công ty bạn, hãy gửi thư phỏng vấn nếu phù hợp!"
              );
              break;
            }

            case 3: {
              break;
            }

            case 4: {
              openNotificationWithIcon(
                "info",
                "Thông báo",
                "Sinh viên đã ứng tuyển tiếp ở công ty bạn, hãy gửi thư phỏng vấn nếu phù hợp!"
              );
              break;
            }

            default: {
              break;
            }
          }
          
        }
      } catch (err) {
       // console.log(err);
        message.error("Đã có lỗi xảy ra!");
      }
    }
  }

  //fetch rateList
  async function fetchListRate() {
    if(user&&student._id!==-1){
    let query = `?type_rate=student&id_student=${student._id}&status=1`;
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
       // console.log('result', result.data)
        if(result.data.length!==0){
          let sum =0;
          result.data.forEach(element => {
            sum = sum + element.score
          });
          setOverall(sum/result.data.length);
        }
        setRateList([...result.data]);
      }
    } catch (err) {
     // console.log(err);
    }
  }
}

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchStudent();
  }, []);
  useEffect(() => {
    fetchCV();
  }, [student]);
  // useEffect(() => {
  //   fetchConditionRate();
  // }, [student, account]);
  // useEffect(() => {
  //   fetchLetter();
  // }, [student, account]);
  useEffect(() => {
    fetchApply();
  }, [student, account]);
  useEffect(() => {
    fetchListRate();
  }, [student, account]);
  
  const renderButtonGroup = () => {
    if (CV){
      if(status===0||status===2){
      return (
        <div className="apply-container">
          <Button
            type="primary"
            className="apply-btn"
            disabled={disabled}
            onClick={handleApply}
          >
            Gửi thư mời phỏng vấn
          </Button>
        </div>
      );}
      if(status===4){
        return (
          <div className="apply-container">
            <Button
              type="primary"
              className="apply-btn"
              disabled={disabled}
              onClick={handleApply}
            >
              Gửi thư mời phỏng vấn
            </Button>
            <Button
            type="primary"
            className="apply-btn"
            onClick={handleRate}
          >
            Thêm đánh giá
          </Button>
          </div>
        );
      }
      return (
        <div className="apply-container">
          <Button
            type="primary"
            className="apply-btn"
            onClick={handleRate}
          >
            Thêm đánh giá
          </Button>
        </div>
      );
    }
    return "";
  };

  const handleRate = () => {
    setOpenRate(true);
  };

  const handleApply = () => {
    setOpenConfirm(true);
  };
  const handleCancelConfirm = () => {
    setOpenConfirm(false);
  };

  const handleChangeStatus = async()=>{
    const url = serverURL + 'cv/' + CV._id;
    const data = {
        status: false, update_id: account._id
    };
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }
        );
        const result = await response.json();
       // console.log(result);
        if(response.status!==200){
            message.error("Không thành công!");
        }else{
            openNotificationWithIcon('success', 'Thông báo', 'Bạn đã đóng CV của sinh viên về trạng thái private!')
        //send noti
        const link = "student/company/" + student._id;
        const title = "Thay đổi trạng thái CV";
        const type = "infor";
        const content = `Doanh nghiệp vừa đóng trạng thái CV của bạn.`;
        createNoti(account._id, [student._id], title, type, content, link);
        //
        fetchCV();
      }
    }
    catch (err) {
       // console.log(err);
    }
  }

  const handleOkConfirm = () => {
    //gửi mail và noti
    setOpenConfirm(false);
    setOpenEmail(true);
  };
  if (account&&student._id!==-1) {
    return (
      <div>
        <div className="CV-container">
            <div className="left-CV-container">
                <Avatar shape='square' className='cv-detail-avatar' src={student.account.avatar?domain+student.account.avatar:avatarImage}/>
                <div className="cv-fullname">{student.account.fullname}</div>
                <div className="rate-cv-container">
                  <Rate value={overall} count={10} disabled/>
                  {rateList.length?<></>: <p>Chưa có đánh giá nào</p>}
                  {renderButtonGroup()}
                </div>
                <br/>
                
                <div className="title-in-cv">Thông tin cá nhân</div>
                <div className="detail-section-cv-container">
                    <div className="part-section-cv">
                        <span className="left-content-cv">CCCD:</span><span>{student.cccd}</span>
                    </div>
                </div>
                <br/>
                <div className="title-in-cv">Liên hệ</div>
                <div className="detail-section-cv-container">
                    <div className="part-section-cv">
                        <span className="left-content-cv"><BankOutlined /></span><span>{student.address}</span>
                    </div>
                    <div className="part-section-cv">
                        <span className="left-content-cv"><PhoneOutlined /></span><span>{student.account.phone}</span>
                        </div>
                    <div className="part-section-cv">
                        <span className="left-content-cv"><MailOutlined /></span><span>{student.account.email}</span>
                    </div>
                </div>
                <br/>
                <div className="title-in-cv">Học vấn</div>
                <div className="detail-section-cv-container">
                    <div className="part-section-cv">
                        <span className="left-content-cv">Trường:</span><span>{student.university}</span>
                    </div>
                    <div className="part-section-cv">
                        <span className="left-content-cv">Khoa:</span><span>{student.faculty}</span>
                        </div>
                    <div className="part-section-cv">
                        <span className="left-content-cv">Chuyên ngành:</span><span>{student.major}</span>
                    </div>
                    <div className="part-section-cv">
                        <span className="left-content-cv">Khóa học:</span><span>{student.course}</span>
                    </div>
                    <div className="part-section-cv">
                        <span className="left-content-cv">GPA:</span><span>{student.gpa}</span>
                    </div>
                </div>
            </div>
            <div className="right-CV-container">
              {CV&&CV.status?
              <>
                <div className="cv-fullname">Thông tin CV</div>
                <div className="underline"></div>
                    <div className="wrap-cv-display">
                        <div className="wrap-label-cv border-underline" ><span className="label-left-cv">Tổng quan</span></div>
                        <div className="text-cv">
                          <pre>
                            {CV.summary}
                          </pre>
                        </div>
                        <p className="text-cv">{CV.experience?CV.experience+ 'tháng kinh nghiệm': ''}</p>
                        <>
                            <div className="wrap-label-cv border-underline"><span className="label-left-cv">Chuyên môn</span></div>
                            <div className="text-cv">
                            <pre>
                              {CV.speciality}
                            </pre>
                            </div>
                        </>
                            <div className="wrap-label-cv border-underline"><span className="label-left-cv">Chứng chỉ</span></div>
                                <div className="text-cv">
                                <pre>
                                  {CV.certificate}
                                </pre>
                                </div>
                            <div>
                            <div className="wrap-label-cv"><span className="label-left-cv">Lĩnh vực</span></div>
                            {CV.fields.length ? (
                              CV.fields.map((field) => {
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
                          <div className="wrap-label-cv"><span className="label-left-cv">Tệp đính kèm</span></div>
                          {CV.file_cv ? (
                          <a target='_blank' href={domain+CV.file_cv} rel="noreferrer" >Link CV</a>
                        ) : (
                          <p>Chưa có file CV đính kèm</p>
                        )}
                        {status===3?
                          <div className="notice">
                                Bạn đã tuyển sinh viên này, bạn có thể đổi trạng thái CV thành private!
                                <Button type="primary" style={{marginLeft: '10px'}} onClick={async()=>{await handleChangeStatus()}}>Đổi trạng thái</Button>
                          </div>:''
                        }
                </div>
                
                </>:
                <div className="notice">Chưa có CV hoặc CV ở trạng thái private</div>
                }
                <br/>
                <div>
                    <div className="cv-fullname">Đánh giá về sinh viên</div>
                    <div className="underline"></div>
                    {rateList.length?<RateCommentList list={rateList}/>:<div className="rate-detail-container">Chưa có đánh giá nào</div>}
                </div>
            </div>
        </div>
        <Modal
          closable={true}
          title="Xác nhận"
          open={isOpenConfirm}
          okText='Xác nhận'
          cancelText='Hủy'
          onOk={handleOkConfirm}
          onCancel={handleCancelConfirm}
        >
          <p>Bạn có chắc chắn muốn gửi thư mời phỏng vấn sinh viên này!</p>
        </Modal>
        {/* soạn thư */}
        <Modal
          title="Thông tin thư mời phỏng vấn"
          open={isOpenEmail}
          footer={null}
          destroyOnClose={()=>{setOpenEmail(false)}}
        >
          <Email id_student={student._id} id_company={account._id} setOpenEmail={setOpenEmail} setStatus={setStatus}/>
        </Modal>

      {/* đánh giá */}
        <Modal
          title="Thông tin đánh giá"
          open={isOpenRate}
          footer={null}
          destroyOnClose={()=>{setOpenRate(false)}}
        >
          <RateModal id_student={student._id} id_company={account._id} type_rate={'student'} setOpenRate={setOpenRate}/>
        </Modal>
      </div>
    );
  } else {
    return <Skeleton active />
  }
};
