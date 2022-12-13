import { Button, Image, Modal } from "antd"
import { useContext, useEffect, useState } from "react";
import { openNotificationWithIcon } from "../../common/service";
import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import '../../styles/gallery.css'

export const Gallery = ({user})=>{
    const { changeUser, token } = useContext(UserContext);
    const [image, setImage] = useState('');
    const [gallery, setGallery] =useState([]);
    const [isOpenAddImage, setOpenAddImage] = useState(false);
    const navigate = useNavigate();

    const handleChange = (info) => {
       // console.log("info", info.target.files[0]);
        setImage(info.target.files[0]);
       // console.log(image);
      };

    const fetchGallery = async()=>{
        if(user){
            const url = serverURL + "gallery/" + user._id;
            try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (response.status !== 200) {
                // message.error("Lỗi hệ thống load user!");
            } else {
               // console.log("fetch gallery", result);
                setGallery([ ...result.data ]);
                // changeUser({ ...result });
            }
            } catch (err) {
           // console.log(err);
            }
        }
    }

    const handleAddGallery = async ()=>{
        if(!image){
            openNotificationWithIcon(
                "error",
                "Thất bại",
                "Bạn chưa chọn file ảnh!"
                );
        }
        const url = serverURL + "gallery"
        let formData = new FormData();
        formData.append('id_account', user._id)
        if(image){formData.append('image',image)};
        // const data = { ...CV, update_id:  };
       // console.log("request", formData);
        try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
       // console.log(result);
        if (response.status !== 201) {
            // message.error(result.message);
        } else {
            openNotificationWithIcon(
            "success",
            "Thông báo",
            "Bạn đã thêm ảnh vào gallery thành công!"
            );
            fetchGallery();
            setOpenAddImage(false);
            setImage('');
            // fetchCV();
            // setIsEdit(false);
            // fetchCompany();
        }
        } catch (err) {
       // console.log(err);
        // message.error("Đã có lỗi xảy ra!");
        }
    }

    //fetch user
  const fetchUser = async () => {
    //// console.log("fetch user account");
    if(!user){
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
            // message.error("Lỗi hệ thống load user!");
        } else {
           // console.log("user fetch to set role", result);
            if (!result) {
            // message.warn("Bạn ko có quyền xem trang này");
            // navigate("/");
            }
            changeUser({ ...result });
        }
        } catch (err) {
       // console.log(err);
        }
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [user]);

  const handleAddImage = ()=>{
    setOpenAddImage(true);
  }

    return (
        <>
            <p className="gallery-title">Gallery</p>
            <div className="button-gallery-container"><Button type="primary" onClick={handleAddImage}>Thêm ảnh mới</Button></div>
            <div className="gallery-container">
                {
                    gallery.map(images=>{
                        return(
                            <div className="image-url-container">
                                <Image className="image-url" src={'http://localhost:5000/'+images.link} />
                                <div className="link-gallery">{'Link: http://localhost:5000/'+images.link}</div>
                            </div>
                        )
                    })
                }
            </div>
            <Modal title='Thêm ảnh mới' open={isOpenAddImage} footer={null} closable destroyOnClose={()=>{setOpenAddImage(false)}}>
                <input type='file' onChange={handleChange}></input><br/>
                <Button type="primary" onClick={handleAddGallery}>Thêm</Button>
            </Modal>
        </>
    )
}