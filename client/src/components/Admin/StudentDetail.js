import { CheckCircleOutlined, MinusCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, message, Modal, Spin, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {decodeToken , isExpired} from 'react-jwt';

import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
import { createNoti, DateToShortString, openNotificationWithIcon } from "../../common/service";
import TextArea from "antd/lib/input/TextArea";
import { serverURL } from "../../configs/server.config";
import { domain } from "../../data/default-image";
import { checkReason } from "../../common/validation";
import { messageConfirmError } from "../../common/error";

let students = {
    _id:-1,
    cccd: "",
    address: "",
    university: "",
    faculty: "",
    course: "",
    gpa: '',
    status: false,
    avatar: '',
    card_student: '',
    major: ''
}

export const StudentDetailAdmin = ()=>{
    const {user,changeUser, token} = useContext(UserContext);
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);
    const [student, setStudent] = useState(students);
    const [reason, setReason] = useState('');

    const {id} = useParams();

    async function fetchStudent(){
        try {
            const url = serverURL + 'student/admin/'+ id;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            if(response.status!==200){
                message.error("Lỗi hệ thống!");
            }else{
                if(result.data==='empty'){
                    message.warning('Không tồn tại sinh viên mã đã tìm!');
                    navigate('/home');
                }else{
                   // console.log("result",result.data)
                    setStudent(result.data);
                }
            }
        }
        catch (err) {
           // console.log(err);
        }
    }

    async function confirmStudent(){
        try {
            const url = serverURL + 'student/confirm/'+ id;
            const data = {
                confirm_id: user._id
            }
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
            );
            const result = await response.json();
            if(response.status!==200){
                message.error("Lỗi hệ thống!");
            }else{
                if(result.data===false){
                    message.warning('Cập nhật không thành công, hãy kiểm tra lại!');
                }else{
                    const title = "Duyệt thông tin sinh viên";
                    const type = "infor";
                    const content = `Admin ${user.fullname} đã duyệt thông tin của bạn! Bạn có thể sử dụng các tính năng của trang web!Chúc bạn thành công!`;
                    createNoti(user._id, [student._id], title, type, content);
                    message.success('Cập nhật thành công!');
                    fetchStudent();
                }
            }
        }
        catch (err) {
           // console.log(err);
        }
    }
    //fetch user
    const fetchUser = async()=>{
       // console.log('fetch user account')
        const tokenx = token? token: window.localStorage.getItem('accessToken');
       // console.log('tokenx', tokenx);
        const id = decodeToken(tokenx).sub;
       // console.log("id",id);
        const url = serverURL + 'account/'+id;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
                if(response.status!==200){
                    message.error("Lỗi hệ thống load user!");
                }else{
                 // console.log("user fetch to set role", result)
                  if(!result||result.role!=='admin'){
                      message.warn('Bạn ko có quyền xem trang này');
                      navigate('/')
                  }
                    changeUser({...result})

                }
            }
            catch (err) {
               // console.log(err);
            }
    }

    useEffect(()=>{fetchUser()}, []);
    useEffect(
        ()=>{
            fetchStudent();
        },[]
    )

    const [validateReason, setValidateReason] = useState({
        status: 'success',
        errorMsg: null
    });
    function checkReasonFunc(Reason) {
        const reason = Reason.trim();
        console.log("reason",reason)
        if (!checkReason(reason)) {
            setValidateReason({
                status: 'error',
                errorMsg: messageConfirmError.reason
            })
            return false;
        } else {
            setValidateReason({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }
    const ref = useRef();
    const refButtonSubmit = useRef();

    async function handleAccept(e){
        confirmStudent();
    }
    async function handleReject(e){
        setOpen(true);
        return;
    }
    async function handleSubmitDeny(){
        if(checkReasonFunc(reason)){
            const title = "Từ chối duyệt thông tin sinh viên";
          const type = "infor";
          const content = `Admin ${user.fullname} đã từ chối duyệt thông tin của bạn!Lí do: ${reason}`;
          createNoti(user._id, [student._id], title, type, content);
            openNotificationWithIcon('success', 'Thành công','Đã gửi thông báo tới sinh viên!')
            setOpen(false);
        }else{
            openNotificationWithIcon('error', 'Thất bại','Hãy nhập lấy do từ chối!')
        }
        // set notification (later)
        
    }
    async function handleCancelDeny(){
        setOpen(false);
    }
    async function handleChangeReason(e){
        setReason(e.target.value);
        return;
    }
    function handleKeyUp(e) {
        if (e.keyCode === 13) {
           // console.log('enter');
            refButtonSubmit.current.focus();
            refButtonSubmit.current.click();
        }
    }

    const renderButtonGroup = ()=>{
        return (
            <>
                <Button type='submit' className='button save-btn' onClick={handleAccept}>Duyệt</Button>
                <Button className='button reject-btn' onClick={handleReject}>Từ chối</Button>
            </>
        )
    }

    const renderStatus = ()=>{
        if(student.status){
            return (
            <Tag icon={<CheckCircleOutlined />} 
                color="success">
                Đã duyệt
            </Tag>)
        }else{
            return (
                <Tag icon={<MinusCircleOutlined />} color="default">
                    Chưa duyệt
                </Tag>
            )
        }
    }
    if(student._id!==-1&&user){
    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image'></div>
            <div className='introduce-bottom'>
            <div className='avatar-container'>
                {
                student.account.avatar?
                <Avatar className="avatar" size={120} src={domain+student.account.avatar} />
                :
                <Avatar className="avatar" size={120} icon={<UserOutlined />} />
                }
            </div>
                <div className='introduce-fullname'>{student.fullname}</div>
            </div>
        </div>
        <div className='detail-swapper'>
            <p className='title-account'>Thông tin sinh viên</p>
            <div className='underline'></div>
            <div className='body'>
            <Form
                    ref={ref}
                    onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                    autoComplete="off"
                >
                    <div className='two-colums'>
                        <Form.Item
                            label="Họ và tên"
                            name="fullname"
                            initialValue={student.fullname}
                            className='label'
                        >
                                <p className="text-display">{student.fullname}</p>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={student.email}
                            className='label'
                        >
                                <p className="text-display">{student.email}</p>
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            initialValue={student.phone}
                            className='label'
                        >
                                <p className="text-display">{student.phone}</p>
                        </Form.Item>
                        <Form.Item
                            label="Trường"
                            name="university"
                            initialValue={student.university}
                            className='label'
                        >
                                <p className="text-display">{student.university}</p>
                        </Form.Item>
                        <Form.Item
                            label="Khoa"
                            name="faculty"
                            initialValue={student.faculty}
                            className='label'
                        >
                                <p className="text-display">{student.university}</p>
                        </Form.Item>
                        <Form.Item
                            label="Chuyên ngành"
                            name="major"
                            className='label'
                            initialValue={student.major}
                        >
                                <p className="text-display">{student.major}</p>
                        </Form.Item>
                        <Form.Item
                            label="Khóa học"
                            name="course"
                            initialValue={student.course}
                            className='label'
                        >
                                <p className="text-display">{student.course}</p>
                        </Form.Item>
                        <Form.Item
                            label="CCCD"
                            name="cccd"
                            initialValue={student.cccd}
                            className='label'
                        >
                                <p className="text-display">{student.cccd}</p>
                        </Form.Item>
                        <Form.Item
                            label="Quê quán"
                            name="address"
                            initialValue={student.address}
                            className='label'
                        >
                                <p className="text-display">{student.address}</p>
                        </Form.Item>
                        <Form.Item
                            label="Mã sinh viên"
                            name="card_student"
                            initialValue={student.card_student}
                            className='label'
                        >
                                <p className="text-display">{student.card_student}</p>
                        </Form.Item>
                        <Form.Item
                            label="Ngày sinh"
                            name="birthday"
                            className='label'
                        >
                                <p className="text-display">{DateToShortString(student.birthday)}</p>
                        </Form.Item>
                        <Form.Item
                            label="GPA"
                            name="gpa"
                            initialValue={student.gpa}
                            className='label'
                        >
                                <p className="text-display">{student.gpa}</p>
                        </Form.Item>
                        <Form.Item name='status' label="Trạng thái"
                                >
                                    <div className='status'>{
                                        renderStatus()
                                    }</div>
                        </Form.Item> 
                        
                    </div>
                    <Form.Item>
                            <div className='group-button'>
                                {
                                    student.status?
                                    '':
                                    renderButtonGroup()
                                }
                            </div>
                        </Form.Item>
                </Form>
                </div>
            </div>
            <Modal title='Xác nhận từ chối' open={isOpen} footer={null}>
                <label>Lý do từ chối</label>
                <Form>
                    <Form.Item 
                        validateStatus={validateReason.status}
                        help={validateReason.errorMsg}
                        rules={[{ required: true, message: 'Hãy nhập lí do!' }]}
                    >
                        <TextArea 
                            className='input-login max-width'
                            placeholder="Nhập lí do"
                            autoFocus={true}
                            rows={6}
                            defaultValue={reason}
                            value={reason}
                            onChange={handleChangeReason}
                            required
                            />
                    </Form.Item>
                            <br/>
                    <Form.Item>
                            <div className='group-button'>
                                <Button type='submit' className='button save-btn' onClick={handleSubmitDeny}>Từ chối</Button>
                                <Button type='reset' className='button cancel-btn' onClick={handleCancelDeny}>Hủy</Button>
                            </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )}else{
        return <div className="spin-container">
        <Spin />
      </div>;
    }
}