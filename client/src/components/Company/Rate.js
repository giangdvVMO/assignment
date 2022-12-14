import { Button, Form, Input, message, Rate } from 'antd';
import React, { useRef, useState } from 'react';
import { checkContent, checkTitle } from '../../common/validation';
import { serverURL } from '../../configs/server.config';
import '../../styles/form.css';
import { createNoti, getUserAdmin, openNotificationWithIcon } from '../../common/service';
import { messageRate } from '../../common/error';
import TextArea from 'antd/lib/input/TextArea';

export const RateModal = ({id_student, id_company, type_rate, setOpenRate}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [score, setScore] = useState(0);

    const ref = useRef();
    const refButtonSubmit = useRef();

    const [validateTitle, setValidateTitle] = useState({
        status: 'success',
        errorMsg: null
    });
    const [validateContent, setValidateContent] = useState({
        status: 'success',
        errorMsg: null
    });
    const [validateScore, setValidateScore] = useState({
        status: 'success',
        errorMsg: null
    });
    

    function checkTitleFunc(Title) {
        if (!checkTitle(Title)) {
            setValidateTitle({
                status: 'error',
                errorMsg: messageRate.title
            })
            return false;
        } else {
            setValidateTitle({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    function checkContentFunc(Content) {
        if (!checkContent(Content)) {
            setValidateContent({
                status: 'error',
                errorMsg: messageRate.content
            })
            return false;
        } else {
            setValidateContent({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    function checkScoreFunc(score) {
        if (score===0) {
            setValidateScore({
                status: 'error',
                errorMsg: messageRate.score
            })
            return false;
        } else {
            setValidateScore({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    function handleChangeTitle(e) {
        setTitle( e.target.value);
    }

    function handleChangeContent(e) {
        setContent(e.target.value);
    }
    function handleChangeScore(value) {
       // console.log(value)
        setScore(value);
    }

    async function handleSubmit(e) {
        let count = 0;
        count = checkTitleFunc(title) ? count : count + 1;
        count = checkContentFunc(content) ? count : count + 1;
        count = checkScoreFunc(score)? count : count + 1;
       // console.log(count);
        if (count === 0) {
            const url = serverURL + 'rate';
            const data = {
                title, content, id_company,id_student, type_rate, score
            };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
                if(response.status!==201){
                    // if(response.status===400){
                    //     openNotificationWithIcon('error', 'Th??ng b??o', result.message)
                    // }
                    message.error("Kh??ng th??nh c??ng!");
                }else{
                    const link = "admin/rate-list";
                    const title = "Y??u c???u duy???t th??ng tin ????nh gi??";
                    const type = "infor";
                    const content = `${type_rate==='student'?'Doanh nghi???p':'Sinh vi??n'} y??u c???u duy???t th??ng tin ????nh gi??.`;
                    const listAdmin = await getUserAdmin();
                   // console.log("listAdmin", listAdmin);
                    if (!listAdmin.length) {
                        openNotificationWithIcon('warning','C???nh b??o',"Ch??a c?? admin, h??y y??u c???u t???o t??i kho???n admin");
                    } else {
                        createNoti(id_company, listAdmin, title, type, content, link);
                        openNotificationWithIcon('success', 'Th??ng b??o', `B???n ???? g???i ????nh gi?? ${type_rate==='student'?'sinh vi??n':'doanh nghi???p'}, h??y ch??? admin duy???t!`)
                    }
                }
                setOpenRate(false);
            }
            catch (err) {
               // console.log(err);
            }
        }else{
            openNotificationWithIcon('error','L???i',"Th??ng tin ch??a ????ng");
        }
        return;
    }

    const [form] = Form.useForm();
    // function handleReset(){
    //     setUser((preUser)=>{return {...preUser, username: '', password: ''}})
    //     form.resetFields();
    //     setValidateUsername({
    //         status: 'success',
    //         errorMsg: null
    //     });
    //     setValidatePassword({
    //         status: 'success',
    //         errorMsg: null
    //     })
    // }
    return (
            <div>
                <Form
                    form={form}
                    ref={ref}
                    // onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                    initialValues={{ remember: true }}
                    autoComplete="off"

                >
                    <Form.Item
                        label="Ti??u ?????:"
                        name="title"
                        validateStatus={validateTitle.status}
                        help={validateTitle.errorMsg}
                        rules={[{ required: true, message: 'H??y nh???p t??n ti??u ?????!' }]}
                    >
                        <Input
                            autoFocus={true}
                            value={title}
                            onChange={handleChangeTitle}
                        />
                    </Form.Item>
                    <Form.Item
                        label="N???i dung ????nh gi??:"
                        name="content"
                        validateStatus={validateContent.status}
                        help={validateContent.errorMsg}
                        rules={[{ required: true, message: 'H??y nh???p n???i dung th??!' }]}
                    >
                        <TextArea rows={5} value={content} 
                                defaultValue={content} 
                                onChange= {handleChangeContent}
                            />
                    </Form.Item>
                    <Form.Item
                        label="S??? ??i???m:"
                        name="score"
                        validateStatus={validateScore.status}
                        help={validateScore.errorMsg}
                        rules={[{ required: true, message: 'H??y ????nh gi?? ??t nh???t 1*!' }]}
                    >
                        <Rate onChange={handleChangeScore} value={score} count={10} />
                    </Form.Item>
                    <Form.Item>
                        <Button type='submit' ref={refButtonSubmit} name='button-submit' className='button submit' onSubmit={handleSubmit} onClick={handleSubmit} >Submit</Button>
                    </Form.Item>
                </Form>
            </div>
    );
}
