import { Button, Image, Input, message, Select, Spin, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { CheckCircleOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { serverURL } from '../../configs/server.config';
import { postFields } from '../../common/service';

const { Option } = Select;
const {TextArea} = Input;
export const CVManagerAdmin = () => {
    const { user,changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [fields, setFields] = useState([]);
    const [field, setField] = useState([]);
    const [status, setStatus] = useState(-1);
    const [search, setSearch] = useState('');
    const [listCV, setListCV] = useState([]);

    //fetch Fields
    async function fetchField(){
        const url = serverURL + 'field';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
           // console.log(result);
            if(response.status!==200){
                message.error(result.message);
            }else{
                if (result.data === "empty") {
                    const manuList = postFields();
                    setFields(manuList);
                  }
                setFields(result.data);
            }
        }
        catch (err) {
           // console.log(err);
            message.error("Đã có lỗi xảy ra!");
        }
}

    async function fetchListCV(){
        // if(!user||user.role!=='admin'){
        //     message.warn('Bạn ko có quyền xem trang này');
        //     navigate('/home')
        // }
        let query = '?1=1';
                query = status!==-1? query+'&status='+status:query;
                query = field.length? query+'&field='+field:query;
                query = search!==''? query+'&search='+search:query;
                const url = serverURL + 'cv'+ query;
               // console.log(query);
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
                        message.error("Lỗi hệ thống!");
                    }else{
                       // console.log("result",result)
                        setListCV(result.data);
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
    useEffect(()=>{fetchUser()},[]);
    useEffect(()=>{fetchField()},[]);
    useEffect(()=>{fetchListCV()},[field, status, search])
    const columns = [
        {
            title: 'STT',
            key: '_id',
            width: 80,
            fixed: 'left',
            render: (_, record, index)=>{
                return <div>{index+1}</div>
            }
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: 150,
            key: 'title',
            fixed: 'left'
        },
        {
            title: 'Lĩnh vực',
            key: 'fields',
            width: 150,
            render: (_,record) =>{ return (<>{
                record.fields.map((manu) => {return(
                    <Tag className="tag" color="cyan">{manu.nameField}</Tag>)
                })
            }</>)
            }
        },
        {
            title: 'Mô tả',
            key: 'summary',
            width: 200,
            render: (_,record) =>
                <TextArea value={record.summary}  bordered={false}/>
        },
        {
            title: 'Kinh nghiệm',
            dataIndex: 'experience',
            key: 'certificate',
            width: 100,
            sorter: (a,b)=>{
                return a.experience - b.experience
            }
        },
        {
            title: 'Chuyên môn',
            key: 'speciality',
            width: 200,
            render: (_,record) =><TextArea value={record.speciality}  bordered={false}/>
        },
        {
            title: 'Chứng chỉ',
            key: 'certificate',
            width: 200,
            render: (_,record) =><TextArea value={record.certificate}  bordered={false}/>
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 100,
            render: (_, record) => (
                     record.status?
                        <Tag icon={<CheckCircleOutlined />} 
                            color="success">
                            public
                        </Tag>
                        :
                        <Tag icon={<MinusCircleOutlined />} color="warning">
                            private
                        </Tag>
            ),
            fixed: 'right',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Link to={`../admin/student/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];
    const handleChangeField = (e)=>{
       // console.log(e);
        const value = e.map(item=>{
            return item.value
        })
        setField([...value]);
    }

    const handleChangeSelect = (e)=>{
        setStatus(e.value);
    }
    const handleChangeSearch = (e)=>{
        setSearch(e.target.value);
    }
    if(fields){
    return (
        <>
            <div className='banner-content'>
                <div className="text-banner">Quản lý CV</div>
                <Image className="image-background-banner" src="https://i.ibb.co/L5rDFrv/Resume-amico-1.png" preview={false}/>
            </div>
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Lĩnh vực CV:</label>
                    <Select
                    mode='multiple'
                        value={field}
                        labelInValue='Lĩnh vực bài đăng'
                        className='filter-content'
                        onChange={handleChangeField}
                    >
                        {
                            fields.map((field)=>{
                                return (<Option key={field._id} value={field._id}>{field.nameField}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='filter'>
                    <label className='label-filter'>Trạng thái:</label>
                    <Select
                        value={status}
                        defaultValue='-1'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                        optionLabelProp='label'
                    >
                        <Option value={-1} label='Tất cả'>Tất cả</Option>
                        <Option value={1} label='public'>public</Option>
                        <Option value={0} label='private'>private</Option>
                    </Select>
                </div>
                <div className='filter'>
                    <label className='transparent'>Tìm kiếm</label>
                    <div className='search'>
                        <Input className='input search-input' placeholder='Nhập thông tin cần tìm' value={search} onChange={handleChangeSearch}>
                        </Input>
                        <Button type="primary" icon={<SearchOutlined />}>
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div>
            <Table 
                dataSource={listCV} 
                columns={columns} 
                scroll={{
                    x: 1000,
                    y: 800,
                }}
                pagination={{pageSize:5}}
            />
        </>
    )}else{
        return <div className="spin-container">
        <Spin />
      </div>;
    }
}
