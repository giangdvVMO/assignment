import { Button, Image, Input, message, Select, Spin, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { SearchOutlined } from '@ant-design/icons';
import { scaleList } from '../../data/list';
import { serverURL } from '../../configs/server.config';
import { openNotificationWithIcon, postManufactures } from '../../common/service';

const { Option } = Select;
const {TextArea} = Input;
export const CompanyList = () => {
    const { user, changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();
    if(!user||user.role!=='student'){
        message.warn('Bạn ko có quyền xem trang này');
        navigate('/home')
    }
    const [scaleBound, setScaleBound] = useState(-1);
    const [manufactures, setManufactures] = useState([{_id:'', name_manu: ''}]);
    const [manufacture, setManufacture] = useState(-1);
    const [search, setSearch] = useState('');
    const [listUser, setListUser] = useState([]);
    //fetch Manufacture
    async function fetchManufacture(){
        const url = serverURL + 'manufacture';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            //// console.log(result);
            if(response.status!==200){
                message.error(result.message);
            }else{
                if (result.data === "empty") {
                    const manuList = postManufactures();
                    setManufactures(manuList);
                  }
                  setManufactures(result.data);
            }
        }
        catch (err) {
            //// console.log(err);
            message.error("Đã có lỗi xảy ra!");
        }
    }
    async function fetchListCompany(){
        let query = '?status=1';
                query= manufacture!==-1? query+'&manufacture='+manufacture:query;
                query = scaleBound!==-1? query+'&scaleBound='+scaleBound:query;
                query = search!==''? query+'&search='+search:query;
                const url = serverURL + 'company'+ query;
                //// console.log(query);
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
                        //// console.log("result",result)
                        setListUser(result.data);
                    }
                }
                catch (err) {
                    //// console.log(err);
                    message.error("Đã có lỗi xảy ra!");
                }
    }
    //fetch user
    const fetchUser = async()=>{
        //// console.log('fetch user account')
        const tokenx = token? token: window.localStorage.getItem('accessToken');
        //// console.log('tokenx', tokenx);
        const id = decodeToken(tokenx).sub;
        //// console.log("id",id);
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
                //  // console.log("user fetch to set role", result)
                  if(!result||result.role!=='student'){
                      message.warn('Bạn ko có quyền xem trang này');
                      navigate('/')
                  }
                    changeUser({...result})
                }
            }
            catch (err) {
                //// console.log(err);
                message.error("Đã có lỗi xảy ra!");
            }
    }

    async function fetchStudent() {
        if (user) {
          try {
            const _id = user._id;
            const url = serverURL + "student/" + _id;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const result = await response.json();
            if (response.status !== 200) {
             // console.log("Lỗi hệ thống!");
              message.error("Lỗi hệ thống!");
            } else {
            if (result.data === "empty") {
                openNotificationWithIcon('warning', 'Cảnh báo', 'Bạn phải cập nhật thông tin sinh viên!')
                navigate("/student-profile");
              } else {
                    if(result.data.status === false){
                        // console.log('re')
                        openNotificationWithIcon('warning', 'Cảnh báo', 'Thông tin của bạn chưa được duyệt nhé!')
                        navigate("/home");
                        return;
                    }
                }
            }
          } catch (err) {
            message.error('Đã có lỗi xảy ra');
          }
        }
      }

    useEffect(()=>{fetchUser()}, []);
    useEffect(()=>{fetchStudent()},[]);
    useEffect(()=>{fetchManufacture();},[])
    useEffect(()=>{fetchListCompany();},[scaleBound, manufacture, search])
    
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
            title: 'Tên công ty',
            dataIndex: 'com_name',
            key: 'com_name',
            width: 150,
            render:(_, record)=>{
                return <p style={{fontWeight: 800}}>{record.com_name}</p>
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            width: 150,
            key: 'address',
        },
        {
            title: 'Năm thành lập',
            dataIndex: 'year',
            width: 100,
            key: 'year',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'com_phone',
            width: 120,
            key: 'com_phone',
        },
        {
            title: 'Email',
            dataIndex: 'com_email',
            width: 120,
            key: 'com_email',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            width: 150,
            key: 'website',
        },
        {
            title: 'Số lao động',
            dataIndex: 'scale',
            width: 100,
            key: 'scale',
        },
        {
            title: "Giới thiệu",
            dataIndex: "introduction",
            key: "introduction",
            width: 150,
            render: (_,record) =>{ 
              return <TextArea value={record.introduction} bordered={false}/>
            }
        },
        {
            title: 'Ngành sản xuất',
            key: 'manufactures',
            width: 200,
            render: (_,record) =>{ return (<>{
                record.manufactures.map((manu) => {return(
                    <Tag className="tag" color="cyan">{manu.name_manu}</Tag>)
                })
            }</>)
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Link to={`../company/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];

    const handleChangeScale= (e)=>{
        setScaleBound(e.value);
    }
    const handleChangeSelect = (e)=>{
        setManufacture(e.value);
    }
    const handleChangeSearch = (e)=>{
        setSearch(e.target.value);
    }
    if(user&&manufactures){
    return (
        <>
            <div className='banner-content'>
                <div className="text-banner">Danh sách doanh nghiệp</div>
                <Image className="image-background-banner" src="https://i.ibb.co/Y0DjjB8/Flood-amico.png" preview={false}/>
            </div>
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Số lao động:</label>
                    <Select
                        value={scaleBound}
                        defaultValue='Tất cả'
                        labelInValue='Số lao động'
                        className='filter-content'
                        onChange={handleChangeScale}
                    >
                        <Option value={-1}>Tất cả</Option>
                        {
                            scaleList.map((scale)=>{
                                return (<Option key={scale} value={scale}>{scale}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='filter'>
                    <label className='label-filter'>Ngành sản xuất:</label>
                    <Select
                        value={manufacture}
                        defaultValue='Tất cả'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>Tất cả</Option>
                        {
                            manufactures.map((manufacture)=>{
                                return (
                                    <Option value={manufacture._id} label={manufacture.name_manu}>
                                        <div className="demo-option-label-item">
                                            {manufacture.name_manu}
                                        </div>
                                    </Option>
                                )
                            })
                        }
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
            />
        </>
    )}else{
        return <div className="spin-container">
        <Spin />
      </div>;
    }
}
