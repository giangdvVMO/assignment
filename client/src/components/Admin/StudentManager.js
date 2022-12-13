import { Button, Image, Input, message, Select, Table, Tag } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken , isExpired} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { CheckCircleOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { majorList, universityList } from '../../data/list';
import { serverURL } from '../../configs/server.config';

const { Option } = Select;

export const StudentManager = () => {
    const { user, changeUser , token, changeToken} = useContext(UserContext)
    const navigate = useNavigate();
   // console.log('StudentManager', user)
    const [university, setUniversity] = useState(-1);
    const [major, setMajor] = useState(-1);
    const [status, setStatus] = useState(-1);
    const [search, setSearch] = useState('');
    const [listUser, setListUser] = useState([]);
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

    const fetchListStudentx = ()=>{
        
        async function fetchListStudents(){
            let query = '?1=1';
                    query = status!==-1? query+'&status='+status:query;
                    query = major!==-1? query+'&major='+major:query;
                    query = university!==-1? query+'&university='+university:query;
                    query = search!==''? query+'&search='+search:query;
                    const url = serverURL + 'student'+ query;
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
                           // console.log("fetch result",result)
                            setListUser([...result.data]);
                        }
                    }
                    catch (err) {
                       // console.log(err);
                    }
            }
            fetchListStudents()
        }
    useEffect(()=>{fetchUser()}, []);
    useEffect(fetchListStudentx,[university, major, status, search])
    
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
            title: 'Họ và tên',
            dataIndex: 'fullname',
            width: 120,
            key: 'fullname',
            fixed: 'left'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            width: 120,
            key: 'birthday',
        },
        {
            title: 'Quê quán',
            dataIndex: 'address',
            width: 120,
            key: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 120,
            key: 'phone',
        },
        {
            title: 'CCCD',
            dataIndex: 'cccd',
            width: 130,
            key: 'cccd',
        },
        {
            title: 'Trường',
            dataIndex: 'university',
            width: 120,
            key: 'university',
        },
        {
            title: 'Khoa',
            dataIndex: 'faculty',
            width: 120,
            key: 'faculty',
        },
        {
            title: 'Chuyên ngành',
            dataIndex: 'major',
            width: 120,
            key: 'major',
        },
        {
            title: 'Khóa học',
            dataIndex: 'course',
            width: 120,
            key: 'course',
        },
        {
            title: 'GPA',
            dataIndex: 'gpa',
            width: 120,
            key: 'gpa',
            sorter: (a,b)=>{
                return a.gpa - b.gpa
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                     record.status?
                        <Tag icon={<CheckCircleOutlined />} 
                            color="success">
                            duyệt
                        </Tag>
                        :
                        <Tag icon={<MinusCircleOutlined />} color="default">
                            chưa duyệt
                        </Tag>
            ),
            width: 120,
            fixed: 'right',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Link to={`../admin/student/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];

    const handleChangeUniversity = (e)=>{
        setUniversity(e.value);
    }

    const handleChangeMajor = (e)=>{
        setMajor(e.value);
    }

    const handleChangeSelect = (e)=>{
        setStatus(e.value);
    }

    const handleChangeSearch = (e)=>{
        setSearch(e.target.value);
    }

    return (
        <>
            <div className='banner-content'>
                <div className="text-banner">Quản lý sinh viên</div>
                <Image className="image-background-banner" src="https://i.ibb.co/gr1SLQp/Coding-workshop-amico.png" preview={false}/>
            </div>
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Trường:</label>
                    <Select
                        value={university}
                        defaultValue='Tất cả'
                        labelInValue='Trường'
                        className='filter-content'
                        onChange={handleChangeUniversity}
                    >
                        <Option value={-1}>Tất cả</Option>
                        {
                            universityList.map((university)=>{
                                return (<Option key={university} value={university}>{university}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='filter'>
                    <label className='label-filter'>Chuyên ngành:</label>
                    <Select
                        value={major}
                        defaultValue='Tất cả'
                        labelInValue='Chuyên ngành'
                        className='filter-content'
                        onChange={handleChangeMajor}
                    >
                        <Option value={-1}>Tất cả</Option>
                        {
                            majorList.map((major)=>{
                                return (<Option key={major} value={major}>{major}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='filter'>
                    <label className='label-filter'>Trạng thái:</label>
                    <Select
                        value={status}
                        defaultValue='Tất cả'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>Tất cả</Option>
                        <Option value={1}>duyệt</Option>
                        <Option value={0}>chưa duyệt</Option>
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
                dataSource={listUser} 
                columns={columns} 
                scroll={{
                    x: 800,
                    y: 800,
                }}
                pagination={{pageSize:5}}
            />
        </>
    )
}
