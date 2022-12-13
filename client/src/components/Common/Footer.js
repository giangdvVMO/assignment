import { FacebookFilled, MailTwoTone, PhoneTwoTone } from '@ant-design/icons'
import { Tooltip } from 'antd'
import '../../styles/footer.css'
export const Footer = ()=>{
    return (
<footer className='footer-container'>
    {/* <div className='image-footer'>
        <img src="https://i.ibb.co/jkHkSV1/Profiling.gif" alt="Profiling" border="0"/>
    </div> */}
    <div className='contact'>
        <div className='title-footer'>Tổng quan</div>
        <div className='underline-footer'></div>
        <div className='content-footer'>
        Website nhằm kết nối doanh nghiệp với sinh viên.
        Thực hiện sứ mệnh giảm cạnh tranh với các ứng viên đã có kinh nghiệm.
        </div>
    </div>
    <div className='contact'>
        <div className='title-footer'>Liên hệ</div>
        <div className='underline-footer'></div>
        <div className='contact-content'>
                    <span className='icon-footer'><a href='https://www.facebook.com/profile.php?id=100005761937708'><FacebookFilled color=''/></a></span>
                    <span className='icon-footer'><Tooltip title="0866023129"><PhoneTwoTone twoToneColor='#03cafc'/></Tooltip></span>
                    <span className='icon-footer'><Tooltip title="1dovangiang@gmail.com"><MailTwoTone twoToneColor='#eb054a'/></Tooltip></span>
        </div>
    </div>
</footer>
    )
}