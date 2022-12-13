import "./App.css";
import Nav from "./components/Common/Navigation";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "./components/User/UserProvider";
import React, { useContext, useEffect, useState } from "react";
import { decodeToken, isExpired } from "react-jwt";
import io, { Socket } from "socket.io-client";
import { openNotificationWithIcon } from "./common/service";
import { Footer } from "./components/Common/Footer";
import { Avatar, Button, Layout, Menu } from "antd";
import { MenuRole } from "./data/menu-role";
import { Notification } from "./components/Common/Notification";
import { UserOutlined } from "@ant-design/icons";
import { domain } from "./data/default-image";
export let socket;

const { Header, Content, Sider } = Layout;

socket = io("http://localhost:5000");
function App() {
  const { user, changeUser, token, changeToken, change, setChange } =
    useContext(UserContext);
 // console.log("accessTokenApp", token);
  const navigate = useNavigate();

  const checkToken = async () => {
    if (isExpired(token)) {
      navigate("/sign-in");
    } else {
      const current = await decodeToken(token);
      socket.emit("resetSocket", { id: current.sub });
    }
  };

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
     // console.log("connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("receiveNoti", () => {
      openNotificationWithIcon('info','Thông báo', 'Bạn có thông báo mới')

      setChange((value) => !value);
    });
  }, []);
  useEffect(() => {
    checkToken();
  }, []);
  const items = MenuRole['admin'];
  return (
    user&&user.role==='admin'?(
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <div className="logo-container">
            {
              user.avatar?
                <Avatar size={60} src={domain+user.avatar} className='logo-image'/>
              :
                <Avatar size={60} icon={<UserOutlined />} className='logo-image'/>
            }
            <div className="name-logo">{user.fullname}</div>
          </div>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          <div className="header-admin">
            <div className="log-out" onClick={()=>{window.localStorage.setItem('accessToken', ''); navigate('/sign-in')}}>Đăng xuất</div>
            <Link to={'/myaccount'}>Thông tin cá nhân</Link>
            <Notification />
          </div>
          
          </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div className="content-app">
            <Outlet />
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
        </Footer>
    </Layout>
    </Layout>
    ):
      (<div>
        {/* <div className="App"> */}
          <Nav />
        {/* </div> */}
        <div className="content-app">
      <Outlet />
      </div>
      <div className="footer">
      <Footer />
      </div>
      </div>
      )
  );
}

export default App;
