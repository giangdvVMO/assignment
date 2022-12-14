import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { checkContent, checkTitle } from '../../common/validation';
import { serverURL } from '../../configs/server.config';
import '../../styles/form.css';
import { createNoti, openNotificationWithIcon } from '../../common/service';
import { messageEmail } from '../../common/error';
import TextArea from 'antd/lib/input/TextArea';

export const Email = ({id_student, id_company, setOpenEmail, setStatus}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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

    function checkTitleFunc(Title) {
        if (!checkTitle(Title)) {
            setValidateTitle({
                status: 'error',
                errorMsg: messageEmail.title
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
                errorMsg: messageEmail.content
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

    function handleChangeTitle(e) {
        setTitle( e.target.value);
    }

    function handleChangeContent(e) {
        setContent(e.target.value);
    }

    function handleCancel(){
        setOpenEmail(false);
    }
    async function handleSubmit(e) {
        // ref.current.submit();
        let count = 0;
        count = checkTitleFunc(title) ? count : count + 1;
        count = checkContentFunc(content) ? count : count + 1;
       // console.log(count);
        if (count === 0) {
            const url = serverURL + 'letter';
            const data = {
                title, content, id_account:id_company,students:[id_student]
            };
           // console.log('send data', data)
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
                    console.log(result);
                    message.error("Kh??ng th??nh c??ng!");
                }else{
                    openNotificationWithIcon('success', 'Th??ng b??o', 'B???n ???? g???i th?? t???i sinh vi??n')
                    //send noti
                    const link = "student/company/" + id_company;
                    const title = "Th?? m???i ???ng tuy???n";
                    const type = "apply";
                    const content = `Doanh nghi???p v???a g???i th?? tuy???n d???ng cho b???n.`;
                    createNoti(id_company, [id_student], title, type, content, link);
                    //send mail
                    
                    setStatus(3);
            }

                setOpenEmail(false);
            }
            catch (err) {
               // console.log(err);
            }
        }
        return;
    }

    const [form] = Form.useForm();
    return (
            <div>
                <Form
                    form={form}
                    ref={ref}
                    className='form'
                    name="basic"
                    layout='vertical'
                    initialValues={{ remember: true }}
                    autoComplete="off"

                >
                    <Form.Item
                        label="Ti??u ?????"
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
                        label="Content"
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
                    <Form.Item>
                        <Button type='submit' ref={refButtonSubmit} name='button-submit' className='button submit' onSubmit={handleSubmit} onClick={handleSubmit}>G???i</Button>
                        <Button type='reset' onClick={handleCancel} className='button reset'>H???y</Button>
                    </Form.Item>
                </Form>
            </div>
    );
}
