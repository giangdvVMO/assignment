import { AlertOutlined, BankOutlined, BookOutlined, ContactsOutlined, ContainerOutlined, CopyOutlined, HomeOutlined, SnippetsOutlined, StarOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const MenuRole = {
    user: [{
        label: <Link to='home'>Trang chủ</Link>,
        icon: <HomeOutlined />,
        key: 'home'
    },
    {
        label: <Link to='about'>Về chúng tôi</Link>,
        icon: <AlertOutlined />,
        key: 'about'
    }],
    admin: [
        {
            label: <Link to='home'>Trang chủ</Link>,
            icon: <HomeOutlined />,
            key: 'home'
        },
        {
            label: <Link to='account-management'>Quản lý người dùng</Link>,
            icon: <UsergroupAddOutlined />,
            key: 'usermanagerment'
        },
        {
            label: <Link to='student-management'>Quản lý sinh viên</Link>,
            icon: <ContactsOutlined />,
            key: 'studentmanagerment'
        },
        {
            label: <Link to='cv-management'>Quản lý cv</Link>,
            icon: <AlertOutlined />,
            key: 'cvmanagerment'
        },
        {
            label: <Link to='company-management'>Quản lý doanh nghiệp</Link>,
            icon: <BankOutlined />,
            key: 'companymanagerment'
        },
        {
            label: <Link to='admin/recruit-list'>Quản lý bài đăng tuyển dụng</Link>,
            icon: <CopyOutlined />,
            key: 'hiremanagerment'
        },
        {
            label: <Link to='admin/rate-list'>Quản lý đánh giá</Link>,
            icon: <CopyOutlined />,
            key: 'ratemanagerment'
        },
        {
            label: <Link to='admin/statistic'>Thống kê</Link>,
            icon: <StarOutlined />,
            key: 'statistic-admin'
        },
        {
            label: <Link to='news-management'>Tin tức</Link>,
            icon: <BookOutlined />,
            key: 'submenu-news',
            children: [
                { 
                    label: <Link to='news'>Danh sách tin tức</Link>,
                    key: 'submenu-item-2-news' 
                },
                { 
                    label: <Link to='news/add'>Thêm tin tức</Link>,
                    key: 'submenu-item-1-news' 
                },
                { 
                    label: <Link to='news-management'>Quản lý tin tức</Link>,
                    key: 'submenu-item-3-news' 
                },
                
            ],
        },
        {
            label: <Link to='about'>Về chúng tôi</Link>,
            icon: <AlertOutlined />,
            key: 'about'
        }
    ],
    company: [
        {
            label: <Link to='home'>Trang chủ</Link>,
            icon: <HomeOutlined />,
            key: 'home'
        },
        {
            label: <Link to='company/student-list'>Danh sách sinh viên</Link>,
            icon: <SnippetsOutlined />,
            key: 'studentlist'
        },
        {
            label: <Link to='company/cv-list'>Danh sách CV</Link>,
            icon: <AlertOutlined />,
            key: 'cvlist'
        },
        {
            label: 'Quản lý bài đăng tuyển dụng',
            icon: <ContainerOutlined />,
            key: 'submenu',
            children: [
                { 
                    label: <Link to='recruit/add'>Thêm bài đăng tuyển dụng</Link>,
                    key: 'submenu-item-1' 
                },
                { 
                    label: <Link to='company/recruit-list'>Danh sách bài đăng tuyển dụng</Link>,
                    key: 'submenu-item-2' 
                },
            ],
        },
        {
            label: <Link to='company/rate-list'>Quản lý đánh giá</Link>,
            icon: <CopyOutlined />,
            key: 'ratemanagerment-company'
        },
        {
            label: <Link to='company/statistic'>Thống kê</Link>,
            icon: <StarOutlined />,
            key: 'statistic-company'
        },
        {
            label: <Link to='news'>Tin tức</Link>,
            icon: <BookOutlined />,
            key: 'submenu-news',
            children: [
                { 
                    label: <Link to='news'>Danh sách tin tức</Link>,
                    key: 'submenu-item-2-news' 
                },
                { 
                    label: <Link to='news/add'>Thêm tin tức</Link>,
                    key: 'submenu-item-1-news' 
                },
                { 
                    label: <Link to='my-news'>Quản lý tin tức của bạn</Link>,
                    key: 'submenu-item-3-news' 
                },
                
            ],
        },
        {
            label: <Link to='about'>Về chúng tôi</Link>,
            icon: <AlertOutlined />,
            key: 'about'
        }
    ],
    student: [
        {
            label: <Link to='home'>Trang chủ</Link>,
            icon: <HomeOutlined />,
            key: 'home'
        },
        {
            label: <Link to='my-cv'>CV của tôi</Link>,
            icon: <SnippetsOutlined />,
            key: 'cvstudent'
        },
        {
            label: <Link to='student/company-list'>Danh sách doanh nghiệp</Link>,
            icon: <BankOutlined />,
            key: 'companylist'
        },
        {
            label: <Link to='student/recruit-list'>Bài đăng tuyển dụng</Link>,
            icon: <ContainerOutlined />,
            key: 'recruitlist'
        },
        {
            label: <Link to='student/rate-list'>Quản lý đánh giá</Link>,
            icon: <CopyOutlined />,
            key: 'ratemanagerment-student'
        },
        {
            label: <Link to='student/statistic'>Thống kê</Link>,
            icon: <StarOutlined />,
            key: 'statistic'
        },
        {
            label: <Link to='news'>Tin tức</Link>,
            icon: <BookOutlined />,
            key: 'submenu-news',
            children: [
                { 
                    label: <Link to='news'>Danh sách tin tức</Link>,
                    key: 'submenu-item-2-news' 
                },
                { 
                    label: <Link to='news/add'>Thêm tin tức</Link>,
                    key: 'submenu-item-1-news' 
                },
                { 
                    label: <Link to='my-news'>Quản lý tin tức của bạn</Link>,
                    key: 'submenu-item-3-news' 
                },
                
            ],
        },
        {
            label: <Link to='about'>Về chúng tôi</Link>,
            icon: <AlertOutlined />,
            key: 'about'
        }
    ]
}