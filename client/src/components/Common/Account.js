import { Avatar, Dropdown, Image, Menu, message, Typography } from "antd";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {decodeToken , isExpired} from 'react-jwt';

import { UserContext } from "../User/UserProvider";
import '../../styles/account.css';
import { domain } from "../../data/default-image";

const Account = () => {
    const { user, changeUser, token, changeToken } = useContext(UserContext)

    let items = [
        {
            key: 1,
            label: (
                <Link to='/myaccount'>Thông tin tài khoản</Link>
            ),
        },
        {
            key: 3,
            label: (
                <Link to='/sign-in' onClick={()=>{window.localStorage.setItem('accessToken', '')}}>Đăng xuất</Link>
            ),
        },
    ];
    // eslint-disable-next-line default-case
    switch (user.role) {
        case 'student': items = items.concat([{
            key: 2,
            label: (
                <Link to='/student-profile'>Thông tin sinh viên</Link>
            ),
        }]);
        break;
        case 'company': items = items.concat([{
            key: 2,
            label: (
                <Link to='/company-profile'>Thông tin doanh nghiệp</Link>
            ),
        }]);
        break;
    }
    const detailAccount = (
        <Menu className="menu-account"
            items={items}
        />
    )

    function compareFn(a, b) {
        if (a.key<b.key) {
          return -1;
        }
        if (a.key>b.key) {
          return 1;
        }
        // a must be equal to b
        return 0;
      }

    items = items.sort(compareFn);
    return (
        <>
            <Dropdown
                className="account-container"
                overlay={detailAccount}
                placement="bottom"
                arrow={{
                    pointAtCenter: true,
                }}
            >
                <div className="account-avatar-container">
                    <Typography className="account-name">{user.fullname === 'x' ? "Account" : user.fullname}</Typography>
                    {
                        user.avatar ?
                            <Avatar
                                src={
                                    <Image
                                        src={domain+user.avatar}
                                        style={{
                                            width: 32,
                                        }}
                                    />
                                }
                            /> :
                            <Avatar
                                className="account-avatar"
                            >
                                U
                            </Avatar>
                    }
                </div>
            </Dropdown>
        </>
    )
}

export default Account;