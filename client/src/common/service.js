import { message, notification } from "antd";
import {socket} from '../App';
import { serverURL } from "../configs/server.config";
import { fieldList, manufacturesList } from "../data/list";
export const DateToShortString = (dateString)=>{
   // console.log(dateString);
    const date = new Date(dateString);
    return date.getDate() +'/'+(date.getMonth()+1)+'/'+date.getFullYear();
}

export const DateToShortStringDate = (dateString)=>{
    const date = new Date(dateString);
    return date.getDate() +'/'+(date.getMonth()+1)+'/'+date.getFullYear();
}

export const formatDescription = (description)=>{
  if(description.length>230){
    return description.slice(0,220)+'...';
  }
  return description;
}

export const createNoti = async(id_send, id_receive, title, type, content, link)=>{
        try {
            const url = serverURL + 'noti';
            const data = {
                "title": title,
                "type": type,
                "content": content,
                "send_id": id_send,
                "receive_id":  id_receive,
                "link": link
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
            );
            const result = await response.json();
            if(response.status!==201){
                message.error("Lỗi hệ thống noti!");
            }else{
                if(!result){
                    message.warning('Cập nhật không thành công, hãy kiểm tra lại!');
                }else{
                    socket.emit('sendNoti',{receive: id_receive[0]});
                }
            }
        }
        catch (err) {
           // console.log(err);
        }
    }

export const getUserAdmin = async()=>{
    try {
        const url = serverURL + 'account?role=admin';
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
            if(result.data.length){
                return result.data.map((item)=>{
                    return item._id;
                });
            }
            return [];
        }
    }
    catch (err) {
       // console.log(err);
    }
}

export const formatDate = (datex)=>{
    const date = Date.parse(datex);
    
    console.log("date", date);
    const currentDate = Date.now();
    console.log("currentDate", currentDate);
    const seconds = Math.floor((currentDate - date + 7*60*60*1000)/1000);
    if(seconds<60){
      return `${seconds} giây trước`
    }
    const minutes = Math.floor(seconds/60);
    if(minutes<60){
      return `${minutes} phút trước`
    } 
    const hours = Math.floor(minutes/60);
    if(hours<24){
      return `${hours} giờ trước`
    } 
    const days = Math.floor(hours/24);
    if(days<30){
      return `${days} ngày trước`
    } 
    const months = Math.floor(days/30);
    if(months<12){
      return `${months} tháng trước`
    }
    return `${Math.floor(months/12)} năm trước`
}

export const changeExperience = (experience)=>{
    if(experience===0){
        return 'Không yêu cầu kinh nghiệm'
    }
    if(experience<12){
        return 'Dưới 1 năm kinh nghiệm'
    }
    // if(experience<12*2){
    //     return 'Dưới 2 năm kinh nghiệm'
    // }
    return 'Trên 1 năm kinh nghiệm'
}
export const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  export const postManufactures = async()=> {
    const url = serverURL + "manufacture/list";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ array: manufacturesList }),
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 201) {
        message.error(result.message);
      } else {
        return manufacturesList;
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }

  export const postFields = async()=> {
    const url = serverURL + "field/list";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field_array: fieldList }),
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 201) {
        message.error(result.message);
      } else {
        return fieldList;
      }
    } catch (err) {
     // console.log(err);
      message.error("Đã có lỗi xảy ra!");
    }
  }