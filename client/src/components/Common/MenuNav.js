import { Menu } from 'antd';
import { useContext, useState } from 'react';

import { MenuRole } from '../../data/menu-role';
import '../../styles/menu.css'
import { UserContext } from '../User/UserProvider';

export const MenuNav = () => {
    const { user } = useContext(UserContext);
   // console.log(user);
    const [current, setCurrent] = useState('home');
    const items = MenuRole[user ? user.role : 'user'];
    const onClick = (e) => {
       // console.log(e);
        setCurrent(e.key);
    }
    return <Menu onClick={onClick} className='menu' selectedKeys={[current]} mode="horizontal" items={items} />;
}