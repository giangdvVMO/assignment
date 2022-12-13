import { IdcardTwoTone, MoneyCollectTwoTone } from "@ant-design/icons";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import {
  changeExperience,
  DateToShortStringDate,
  formatDescription,
  openNotificationWithIcon,
} from "../../common/service";
import { serverURL } from "../../configs/server.config";
import { companyImage } from "../../data/default-image";
import "../../styles/card.css";

export const CardList = ({ listRecruit, id_student }) => {
  const handleViewRecruit = async (id_recruit, id_student) => {
    const url = serverURL + "recruit-view";
    const data = { id_recruit, id_student };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
     // console.log(result);
     // console.log("status", response.status);
      if (response.status !== 201) {
        openNotificationWithIcon(
          "error",
          "Lỗi",
          "Lỗi thêm bản ghi xem bài đăng!"
        );
      }
    } catch (err) {
     // console.log(err)
    }
  };
  return listRecruit.map((item) => {
    const classCss = item._id % 2 === 0 ? "card red" : "card green";
    const twoToneColor = item._id % 2 === 0 ? "#dE685E" : "#325C46";
    return (
      <>
        <div class={classCss}>
          <div class="additional">
            <div class="user-card">
              <div class="level center-card">
                {changeExperience(item.experience)}
              </div>
              <Avatar
                className="avatar-cv"
                src={companyImage}
              />
              {item.fields.map((field, index) => {
                if (index < 2) {
                  return (
                    <div class="points center-card">{field.nameField}</div>
                  );
                }
                if (index === 2) {
                  return (
                    <div class="points center-card">
                      {`+${item.fields.length - 2} lĩnh vực`}
                    </div>
                  );
                }
                return "";
              })}
            </div>
            <div class="more-info">
              <h2>{item.title}</h2>
              
              <div class="coords">
                <span>Hạn tuyển dụng</span>
                <span>{DateToShortStringDate(item.end_date)}</span>
              </div>
              <div class="stats">
                <div>
                  <div class="titlecard">Số lượng</div>
                  <IdcardTwoTone size={10} twoToneColor={twoToneColor} />
                  <div class="value">{item.quantity}</div>
                </div>
                <div>
                  <div class="titlecard">Lương</div>
                  <MoneyCollectTwoTone size={10} twoToneColor={twoToneColor} />
                  <div class="value tiny">
                    {item.salary ? item.salary : "Thỏa thuận"}
                  </div>
                </div>
              </div>
              <div class="bottom-button">
                <Link
                  to={`../recruit/${item._id}`}
                  onClick={() => {
                    handleViewRecruit(item._id, id_student);
                  }}
                >
                  <div class="level">Xem chi tiết</div>
                </Link>
              </div>
            </div>
          </div>
          <div class="general">
            <h2>{item.title}</h2>
            <p>{formatDescription(item.description)}</p>
            <p class="hover">Hover để xem thêm</p>
          </div>
        </div>
      </>
    );
  });
};
