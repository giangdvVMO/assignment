import { Button, Image, Input, message, Pagination, Select, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { serverURL } from '../../configs/server.config';
import { CheckCircleOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { DateToShortStringDate } from '../../common/service';

const { Option } = Select;

export const AccountManager = () => {
    const { user } = useContext(UserContext);
    //// console.log('AccountManager', user);
    const [status, setStatus] = useState(-1);
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(1);
    const [totalPage, setTotal] = useState(0);
    const [role, setRole] = useState('Tất cả')
    const [listUser, setListUser] = useState([]);
    const navigate = useNavigate();
    if(!user||user.role!=='admin'){
        navigate('/');
    }
    const getAccountList = ()=>{
            async function fetchData(){
                let query = '?current='+current;
                query = status!==-1? query+'&status='+status:query;
                query = search!==-1? query+'&search='+search:query;
                query = role!=='Tất cả'? query+ '&role='+role: query;
                const url = serverURL + 'account'+ query;
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
                       // console.log('userList',result.data)
                        setListUser(result.data);
                    }
                }
                catch (err) {
                   // console.log(err);
                }
            }
           // console.log('fetch data');
        fetchData();
        };
    useEffect( getAccountList,[current, search, status, role]);

    const customSort = (x,y)=>{
        const first = x.toLowerCase();
        const second = y.toLowerCase();
        return first.localeCompare(second);
    }

    const sortFullName = (a,b)=>{
        const splitA = a.fullname.split(' ');
        const splitB = b.fullname.split(' ');
        const sortLastName = customSort(splitA[splitA.length-1],splitB[splitB.length-1]);
       // console.log("sortLastName",sortLastName)
        if(sortLastName===0){
            return customSort(a.fullname,b.fullname);
        }
        return sortLastName;
    }

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
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullname',
            key: 'fullname',
            width: 200,
            sorter: (a,b)=>{
                return sortFullName(a,b);
            }
        },
        {
            title: 'Ngày sinh',
            key: 'birthday',
            width: 120,
            render: (_,record) =>{ 
                return record.birthday? <>{DateToShortStringDate(record.birthday)}</>:''
            },
            sorter: (a,b)=>{
                return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
            key: 'email',
        },
        {
            title: 'Vị trí',
            dataIndex: 'role',
            width: 100,
            key: 'role',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 120,
            key: 'phone',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 100,
            render: (_, record) => (
                     record.status?
                        <Tag icon={<CheckCircleOutlined />} 
                            color="success">
                            active
                        </Tag>
                        :
                        <Tag icon={<MinusCircleOutlined />} color="default">
                            inactive
                        </Tag>
            ),
            fixed: 'right',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Link to={`../account/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];

    const handleChangeSelect = (e)=>{
        setStatus(e.value);
    }

    const handleChangerole = (e)=>{
        setRole(e.value);
    }

    const handleChangeSearch = (e)=>{
       // console.log(e.target.value);
        setSearch(e.target.value);
    }

    const handleChangePage = (value)=>{
        setCurrent(value);
    }

    return (
        <>
            <div className='banner-content'>
                <div className="text-banner">Quản lý danh sách tài khoản</div>
                <Image className="image-background-banner" src="https://i.ibb.co/vD4JfCf/Mobile-login-amico.png" preview={false}/>
            </div>
            
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Trạng thái:</label>
                    <Select
                        value={status}
                        defaultValue='Tất cả'
                        labelInValue={true}
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>Tất cả</Option>
                        <Option value={1}>active</Option>
                        <Option value={0}>inactive</Option>
                    </Select>
                </div>
                <div className='filter'>
                    <label className='label-filter'>Vị trí:</label>
                    <Select
                        value={role}
                        defaultValue='Tất cả'
                        labelInValue={true}
                        className='filter-content'
                        onChange={handleChangerole}
                    >
                        <Option value={"Tất cả"}>Tất cả</Option>
                        <Option value={"student"}>Sinh viên</Option>
                        <Option value={"company"}>Doanh nghiệp</Option>
                        <Option value={"admin"}>Quản trị viên</Option>
                    </Select>
                </div>
                <div className='filter'>
                    <label className='transparent'>Tìm kiếm</label>
                    <div className='search'>
                        <Input className='input' placeholder='Nhập thông tin cần tìm' value={search} onChange={handleChangeSearch}>
                        </Input>
                        <Button type="primary" icon={<SearchOutlined />}>
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div>
            <Table 
                dataSource={listUser} 
                columns={columns} 
                scroll={{
                    x: 800,
                    y: 800,
                }}
                pagination={{
                    pageSize: 5,
                  } }
            />
        </>
    )
}
