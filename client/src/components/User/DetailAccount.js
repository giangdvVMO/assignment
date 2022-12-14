import { CheckCircleOutlined, EditOutlined, InfoCircleOutlined, KeyOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, DatePicker, Form, Input, message, Modal, Tag, Tooltip } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as moment from 'moment';
import {decodeToken , isExpired} from 'react-jwt';

import { messageSignUpError } from '../../common/error';
import { DateToShortString, openNotificationWithIcon } from '../../common/service';
import { checkBirthday, checkFullName, checkMail, checkPassword, checkPhone, checkRole, checkUsername } from '../../common/validation';
import { serverURL } from '../../configs/server.config';
import '../../styles/form.css'
import '../../styles/my-account.css'
import { ChangePassword } from './ChangePassword';
import { UserContext } from './UserProvider';
import { avatarImage, domain } from '../../data/default-image';

export const DetailAccount = () => {
    const { user, changeUser, token } = useContext(UserContext);
    const [isEdit, setIsEdit] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalSelectImage, setIsOpenModalSelectImage] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [image, setImage] = useState('');
    const fetchUser = async()=>{
        const tokenx = token?token:window.localStorage.getItem('accessToken');
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
                    message.error("L???i h??? th???ng load user!");
                }else{
                    setAccount({...result})
                }
            }
            catch (err) {
               // console.log(err);
            }
    }
    useEffect(()=>{fetchUser()},[]);
    
    const [account, setAccount] = useState(user&&user.role?user:{});
    const defaultTrueStatus = {
        status: 'success',
        errorMsg: null
    }
    const [validateEmail, setValidateEmail] = useState(defaultTrueStatus);
    const [validatePhone, setValidatePhone] = useState(defaultTrueStatus);
    const [validateUsername, setValidateUsername] = useState(defaultTrueStatus);
    const [validatePassword, setValidatePassword] = useState(defaultTrueStatus);
    const [validateRole, setValidateRole] = useState(defaultTrueStatus);
    const [validateFullname, setValidateFullname] = useState(defaultTrueStatus);
    const [validateBirthday, setValidateBirthday] = useState(defaultTrueStatus);

    const ref = useRef();
    const refUserName = useRef();
    const refButtonSubmit = useRef();
    const navigate = useNavigate();

    function handleChangeUserName(e) {
        setAccount((preUser) => { return { ...preUser, username: e.target.value } });
    }

    function handleChangePassword(e) {
        setAccount((preUser) => { return { ...preUser, password: e.target.value } });
    }

    function handleChangeFullName(e) {
        setAccount((preUser) => { return { ...preUser, fullname: e.target.value } });
    }

    function handleChangeBirthday(date, dateString) {
        setAccount((preUser) => { return { ...preUser, birthday: dateString } });
    }

    function handleChangeEmail(e) {
       // console.log(e.target.value);
        setAccount((preUser) => { return { ...preUser, email: e.target.value } });
    }

    function handleChangePhone(e) {
        setAccount((preUser) => { return { ...preUser, phone: e.target.value } });
    }

    const handleAddGallery = async ()=>{
        if(!image){
            openNotificationWithIcon(
                "error",
                "Th???t b???i",
                "B???n ch??a ch???n file ???nh!"
                );
        }else{
            const url = serverURL + "gallery"
            let formData = new FormData();
            formData.append('id_account', user._id)
            if(image){formData.append('image',image)};
            // const data = { ...CV, update_id:  };
           // console.log("request", formData);
            try {
                const response = await fetch(url, {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
               // console.log(result);
                if (response.status !== 201) {
                    // message.error(result.message);
                } else {
                    openNotificationWithIcon(
                    "success",
                    "Th??ng b??o",
                    "B???n ???? th??m ???nh th??nh c??ng!"
                    );
                    //// console.log('??',result.data);
                    setAvatar(result.data.link);
                    setIsOpenModalSelectImage(false);
                }
            } catch (err) {
               // console.log(err);
                // message.error("???? c?? l???i x???y ra!");
                }
            }
    }

    const handleClickFile = (info) => {
           // console.log("info", info.target.files[0]);
            setImage(info.target.files[0]);
           // console.log(image);
          };

    const handleChangeAvatar = ()=>{
        handleAddGallery();
    }

    function handleKeyUp(e) {
        if (e.keyCode === 13) {
           // console.log('enter');
            refButtonSubmit.current.focus();
            refButtonSubmit.current.click();
        }
    }

    function checkMailFunc(email) {
        if (!checkMail(email)) {
            setValidateEmail({
                status: 'error',
                errorMsg: messageSignUpError.email
            })
            return false;
        } else {
            setValidateEmail(defaultTrueStatus)
            return true;
        }
    }

    function checkPhoneFunc(phone) {
        if (!checkPhone(phone)) {
            setValidatePhone({
                status: 'error',
                errorMsg: messageSignUpError.phone
            })
            return false;
        } else {
            setValidatePhone(defaultTrueStatus)
            return true;
        }
    }

    function checkUserNameFunc(username) {
        if (!checkUsername(username)) {
            setValidateUsername({
                status: 'error',
                errorMsg: messageSignUpError.username
            })
            return false;
        } else {
            setValidateUsername(defaultTrueStatus)
            return true;
        }
    }

    function checkPasswordFunc(password) {
        if (!checkPassword(password)) {
            setValidatePassword({
                status: 'error',
                errorMsg: messageSignUpError.password
            })
            return false;
        } else {
            setValidatePassword(defaultTrueStatus)
            return true;
        }
    }

    function checkRoleFunc(role) {
        if (!checkRole(role)) {
            setValidateRole({
                status: 'error',
                errorMsg: messageSignUpError.role
            })
            return false;
        } else {
            setValidateRole(defaultTrueStatus)
            return true;
        }
    }

    function checkFullNameFunc(fullname) {
        if (!checkFullName(fullname)) {
            setValidateFullname({
                status: 'error',
                errorMsg: messageSignUpError.fullname
            })
            return false;
        } else {
            setValidateFullname(defaultTrueStatus)
            return true;
        }
    }

    function checkBirthdayFunc(birthday) {
        if (!checkBirthday(birthday)) {
            setValidateBirthday({
                status: 'error',
                errorMsg: messageSignUpError.birthday
            })
            return false;
        } else {
            setValidateBirthday(defaultTrueStatus)
            return true;
        }
    }

    function resetError(){
        setValidateEmail(defaultTrueStatus);
        setValidatePhone(defaultTrueStatus);
        setValidateUsername(defaultTrueStatus);
        setValidatePassword(defaultTrueStatus);
        setValidateRole(defaultTrueStatus);
        setValidateFullname(defaultTrueStatus);
        setValidateBirthday(defaultTrueStatus);
    }

    async function handleEdit(e) {
        setIsEdit(true);
        return;
    }

    async function handleCancel(e) {
        setAvatar('');
        setImage('');
        resetError();
        setAccount({...user});
        setIsEdit(false);
        return;
    }

    async function handleChange(e) {
        setIsOpenModal(true);
        return;
    }

    const handleCancelImage = ()=>{
        setIsOpenModalSelectImage(false);
    }

    async function handleSave(e) {
        ref.current.submit();
        let count = 0;
        count = checkMailFunc(account.email) ? count : count + 1;
        count = checkPhoneFunc(account.phone) ? count : count + 1;
        count = checkFullNameFunc(account.fullname) ? count : count + 1;
        count = checkPasswordFunc(account.password) ? count : count + 1;
        count = checkRoleFunc(account.role) ? count : count + 1;
        count = checkUserNameFunc(account.username) ? count : count + 1;
        count = checkBirthdayFunc(account.birthday) ? count : count + 1;
        
       // console.log(count);
        if (count === 0) {
            if(avatar){
                account.avatar = avatar;
            }
            const url = serverURL + 'account/'+user._id;
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    body: JSON.stringify(account),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
               // console.log(result);
                if(response.status!==200){
                    // message.error(result.message);
                    if(response.status===400){
                        openNotificationWithIcon('error', 'Th??ng b??o', result.message)
                    }else{
                        message.error(result.message);
                    }
                    setAccount({...user});
                }else{
                    openNotificationWithIcon('success', 'Th??ng b??o', 'B???n ???? s???a th??nh c??ng!')
                    changeUser({...account})
                    setImage('');
                    setAvatar('');
                    setIsEdit(false);
                }
            }
            catch (err) {
               // console.log(err);
                setAccount({...user});
                message.error("???? c?? l???i x???y ra!");
            }
        }
        return;
    }
    const renderButtonGroup = () => {
        if (!isEdit) {
            return (
                <Button type='submit' className='button edit-btn' onClick={handleEdit}>S???a</Button>
            )
        } else {
            return (
                <>
                    <Button type='submit' className='button save-btn' onClick={handleSave}>L??u</Button>
                    <Button type='reset' className='button cancel-btn' onClick={handleCancel}>H???y</Button>
                </>
            )
        }
    }

    const renderStatus = () => {
        if (account.status) {
            return (
                <Tag icon={<CheckCircleOutlined />} 
                    color="success">
                    active
                </Tag>)
        } else {
            (
                <Tag icon={<MinusCircleOutlined />} color="default">
                    inactive
                </Tag>
            )
        }
    }

    const renderChangePasswordBtn = () => {
        if (!isEdit) {
            return (
                <Button className='button change-btn' onClick={handleChange}>?????i</Button>
            )
        }
    }

    const handleOpenChangeAvatar = ()=>{
        setIsOpenModalSelectImage(true)
    }


    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image'></div>
            <div className='introduce-bottom'>
                <div className='avatar-container'>
                    {
                        isEdit?
                        <Avatar className='avatar' size={120} src={avatar?domain+avatar:account.avatar?domain+account.avatar:avatarImage} />
                        :
                        <Avatar className='avatar' size={120} src={account.avatar?domain+account.avatar:avatarImage} />
                    }
                </div>
                {
                    isEdit?<div className='edit-avatar' onClick={handleOpenChangeAvatar}>
                    <EditOutlined />
                </div>:''
                }
                <div className='introduce-fullname'>{account.fullname}</div>
            </div>
        </div>
        <div className='detail-swapper'>
            <p className='title-account'>Th??ng tin t??i kho???n</p>
            <div className='underline'></div>
            <div className='body'>
                <Form
                    ref={ref}
                    onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <div className='two-colums'>
                        <Form.Item
                            initialValue={account.username}
                            label="T??n ????ng nh???p"
                            name="username"
                            className='label'
                            validateStatus={validateUsername.status}
                            help={validateUsername.errorMsg}
                        >
                            {
                                isEdit?
                                <Input
                                    ref={refUserName}
                                    disabled={true}
                                    className='input-login max-width'
                                    placeholder="Nh???p t??n ????ng nh???p"
                                    autoFocus={true}
                                    prefix={<UserOutlined className='input-icon' />}
                                    suffix={
                                        <Tooltip title="T??n ????ng nh???p l?? duy nh???t">
                                            <InfoCircleOutlined className='input-icon opacity-less'
                                            />
                                        </Tooltip>
                                    }
                                    value={account.username}
                                    onChange={handleChangeUserName}
                                />
                                :
                                <p className="text-display">{account.username}</p>
                            }
                        </Form.Item>
                        {
                            isEdit?null:
                            <Form.Item
                                label="M???t kh???u"
                                name="password"
                                className='label'
                                validateStatus={validatePassword.status}
                                help={validatePassword.errorMsg}
                            >
                                <div className='group'>
                                    <p className="text-display">********</p>
                                    {renderChangePasswordBtn()}
                                </div>
                            </Form.Item>
                        }
                        
                        <Form.Item
                            label="H??? v?? t??n"
                            name="fullname"
                            className='label'
                            initialValue={account.fullname}
                            validateStatus={validateFullname.status}
                            help={validateFullname.errorMsg}
                        >
                            {
                                isEdit?
                                <Input
                                    disabled={!isEdit}
                                    className='input-login max-width'
                                    placeholder="Nh???p h??? v?? t??n"
                                    autoFocus={true}
                                    value={account.fullname}
                                    onChange={handleChangeFullName}
                                />
                                :
                                <p className="text-display">{account.fullname}</p>
                            }
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            className='label'
                            initialValue={account.email}
                            validateStatus={validateEmail.status}
                            help={validateEmail.errorMsg}
                        >
                            {
                                isEdit?
                                <Input
                                    className='input-login max-width'
                                    placeholder="Nh???p Email"
                                    type='email'
                                    disabled={!isEdit}
                                    autoFocus={true}
                                    prefix={<MailOutlined className='input-icon' />}
                                    value={account.email}
                                    onChange={handleChangeEmail}
                                />
                                :
                                <p className="text-display">{account.email}</p>
                            }
                        </Form.Item>

                        <Form.Item
                            label="S??? ??i???n tho???i"
                            name="phone"
                            className='label'
                            initialValue={account.phone}
                            validateStatus={validatePhone.status}
                            help={validatePhone.errorMsg}
                        >
                            {
                                isEdit?
                                <Input
                                    className='input-login max-width'
                                    placeholder="Nh???p S??? ??i???n tho???i"
                                    autoFocus={true}
                                    disabled={!isEdit}
                                    prefix={<><PhoneOutlined className='input-icon' /></>}
                                    value={account.phone}
                                    onChange={handleChangePhone}
                                />
                                :
                                <p className="text-display">{account.phone}</p>
                            }
                            
                        </Form.Item>
                        <Form.Item
                            label="Ng??y sinh"
                            name="birthday"
                            className='label'
                            validateStatus={validateBirthday.status}
                            help={validateBirthday.errorMsg}
                        >
                            {
                                isEdit?
                                <DatePicker className='birthday-input'
                                    autoFocus={true}
                                    disabled={!isEdit}
                                    defaultValue= {moment(moment(account.birthday),'DD/MM/YYYY')}
                                    value={account.birthday}
                                    onChange={handleChangeBirthday} />
                                :
                                <p className="text-display">{DateToShortString(account.birthday)}</p>
                            }
                            
                        </Form.Item>
                        <Form.Item name='role' label="?????i t?????ng"
                        className='label'
                            validateStatus={validateRole.status}
                            help={validateRole.errorMsg}
                        >
                            <div className='role'>
                                <Tag color="orange">{account.role}</Tag>
                            </div>
                        </Form.Item>
                        <Form.Item name='status' label="Tr???ng th??i"
                            validateStatus={validateRole.status}
                            className='label'
                            help={validateRole.errorMsg}
                        >
                            <div className='status'>{
                                renderStatus()
                            }</div>
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <div className='group-button'>
                            {
                                renderButtonGroup()
                            }
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
        <Modal title='?????i m???t kh???u' open={isOpenModal} closable={false} footer={null}>
            <ChangePassword setIsOpenModal={setIsOpenModal} />
        </Modal>
        <Modal title='Ch???n ???nh' open={isOpenModalSelectImage} onOk={handleChangeAvatar} onCancel={handleCancelImage}>
            <input id='file-upload'  type='file' onChange={handleClickFile} />
        </Modal>
    </div>
    )
}