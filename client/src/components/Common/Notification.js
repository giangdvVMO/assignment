import React, { useContext, useEffect, useState } from "react";

import {
  BellTwoTone,
  IdcardTwoTone,
  MailTwoTone,
  ReconciliationTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  message,
  Avatar,
  List,
  Dropdown,
  Menu,
  Modal,
  notification,
  Button,
} from "antd";
import "../../styles/notification.css";
import { serverURL } from "../../configs/server.config";
import VirtualList from "rc-virtual-list";
import { UserContext } from "../User/UserProvider";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../common/service";
const ContainerHeight = 200;
const initialNoti = [
  {
    _id: 1,
    title: "title1",
    type: "infor",
    status: false,
    content: "content2",
    create_date: new Date(),
    link: "",
  },
  {
    _id: 2,
    title: "title2",
    type: "apply",
    status: false,
    content: "content2",
    create_date: new Date(),
    link: "",
  },
];

export const Notification = () => {
  const { change, setChange } = useContext(UserContext);
  const [noti, setNoti] = useState(initialNoti);
  const [isOpen, setOpen] = useState(false);
  const [curNoti, setCurNoti] = useState(initialNoti[0]);

  const handleClickNoti = (item) => {
    setOpen(true);
    setCurNoti(item);
  };

  const onOk = () => {
    setOpen(false)
  };

  const onCancel = () => {
    setOpen(false);
  };

  const setLabel = () => {
   // console.log("load", noti.length);
    if (noti.length) {
      return (
        <List className="list-noti">
          <VirtualList data={noti} height={ContainerHeight} itemHeight={47}>
            {(item) => (
              <List.Item
                key={item._id || "empty"}
                onClick={() => {
                  handleClickNoti(item);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      count={
                        item.type === "infor" ? (
                          <IdcardTwoTone />
                        ) : item.type === "mail" ? (
                          <MailTwoTone />
                        ) : (
                          <ReconciliationTwoTone />
                        )
                      }
                    >
                      <Avatar shape="circle" icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={item.title || "hi"}
                  description={formatDate(item.create_date)}
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      );
    } else {
      return "Kh??ng c?? th??ng b??o n??o!";
    }
  };
  const items = [
    {
      label: setLabel(),
      key: "item-1",
    },
  ];

  const [count, setCount] = useState(0);
  const { user, token, changeUser } = useContext(UserContext);
  const [account, setAccount] = useState(user);
  const navigate = useNavigate();

  const fetchNoti = async () => {
    if (account) {
      const url = serverURL + "noti/" + account._id;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
       // console.log(result);
        if (response.status !== 200) {
          message.error(result.message);
        } else {
         // console.log("fetchNoti", result.data);
          if (result.data.length) {
            setNoti([...result.data]);
            setCount(result.data.length);
          } else {
            setNoti([]);
            setCount(0);
          }
        }
      } catch (err) {
       // console.log(err);
        message.error("???? c?? l???i x???y ra!");
      }
    }
  };
  //fetch user
  const fetchUser = async () => {
   // console.log("fetch user account");
    const tokenx = token ? token : window.localStorage.getItem("accessToken");
   // console.log("tokenx", tokenx);
    const id = decodeToken(tokenx).sub;
   // console.log("id", id);
    const url = serverURL + "account/" + id;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status !== 200) {
        message.error("L???i h??? th???ng load user!");
      } else {
       // console.log("user fetch to set role", result);
        if (!result) {
          notification["warning"]({
            message: "Notification Title",
            description: "B???n ko c?? quy???n xem trang n??y",
          });
          navigate("/");
        }
        changeUser({ ...result });
        setAccount({ ...result });
      }
    } catch (err) {
     // console.log(err);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchNoti();
  }, [account, change]);

  const Notifications = <Menu className="menu-account" items={items} />;
  return (
    <>
      <Dropdown
        overlay={Notifications}
        placement="bottom"
        arrow={{
          pointAtCenter: true,
        }}
      >
        <div className="notification">
          <Badge count={count} overflowCount={99}>
            <BellTwoTone className="icon-bell" />
          </Badge>
        </div>
      </Dropdown>
      <Modal
        open={isOpen}
        onOk={onOk}
        onCancel={onCancel}
        title={curNoti.title}
      >
        {curNoti.content}
        {curNoti.link ? (
          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
              navigate(curNoti.link);
            }}
          >
            Link truy c???p
          </Button>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};
