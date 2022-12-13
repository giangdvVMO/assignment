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
                    //     openNotificationWithIcon('error', 'Thông báo', result.message)
                    // }
                    message.error("Không thành công!");
                }else{
                    const link = "admin/rate-list";
                    const title = "Yêu cầu duyệt thông tin đánh giá";
                    const type = "infor";
                    const content = `${type_rate==='student'?'Doanh nghiệp':'Sinh viên'} yêu cầu duyệt thông tin đánh giá.`;
                    const listAdmin = await getUserAdmin();
                   // console.log("listAdmin", listAdmin);
                    if (!listAdmin.length) {
                        openNotificationWithIcon('warning','Cảnh báo',"Chưa có admin, hãy yêu cầu tạo tài khoản admin");
                    } else {
                        createNoti(id_company, listAdmin, title, type, content, link);
                        openNotificationWithIcon('success', 'Thông báo', `Bạn đã gửi đánh giá ${type_rate==='student'?'sinh viên':'doanh nghiệp'}, hãy chờ admin duyệt!`)
                    }
                }
                setOpenRate(false);
            }
            catch (err) {
               // console.log(err);
            }
        }else{
            openNotificationWithIcon('error','Lỗi',"Thông tin chưa đúng");
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
                        label="Tiêu đề:"
                        name="title"
                        validateStatus={validateTitle.status}
                        help={validateTitle.errorMsg}
                        rules={[{ required: true, message: 'Hãy nhập tên tiêu đề!' }]}
                    >
                        <Input
                            autoFocus={true}
                            value={title}
                            onChange={handleChangeTitle}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung đánh giá:"
                        name="content"
                        validateStatus={validateContent.status}
                        help={validateContent.errorMsg}
                        rules={[{ required: true, message: 'Hãy nhập nội dung thư!' }]}
                    >
                        <TextArea rows={5} value={content} 
                                defaultValue={content} 
                                onChange= {handleChangeContent}
                            />
                    </Form.Item>
                    <Form.Item
                        label="Số điểm:"
                        name="score"
                        validateStatus={validateScore.status}
                        help={validateScore.errorMsg}
                        rules={[{ required: true, message: 'Hãy đánh giá ít nhất 1*!' }]}
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
