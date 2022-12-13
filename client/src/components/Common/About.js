import { Avatar } from 'antd'
import '../../styles/about.css'

export const About = () => {
    // return ('About website');
    return(
        <div className='about'>
        <div className='about-container'>
            <div className='section'>
                <div className='title-about'>Giảng viên hướng dẫn</div>
                <div className='card-about-container'>
                <div className='card-about'>
                    <Avatar className='image-about' src='https://i.ibb.co/DYhKNfW/312351002-5971690399521936-8062445469697273210-n.jpg'/>
                    <div className='fullname-about'>Nguyễn Thị Tâm</div>
                    <div className='position-about'>Giảng viên</div>
                </div>
            </div>
            </div>
            <div className='section'>
                <div className='title-about'>Sinh viên thực hiện</div>
                <div className='card-about-container'>
                <div className='card-about'>
                <Avatar className='image-about' src='https://i.ibb.co/QfHgrNn/Image-20221118-162809.jpg'/>
                        {/* <Avatar className='image-about' src='https://i.ibb.co/W6PSySS/Image-20221118-162717.jpg'/> */}
                        <div className='fullname-about'>Đỗ Minh Hằng</div>
                        <div className='position-about'>Tester, QA</div>
                    </div>
                    <div className='card-about'>
                        <Avatar className='image-about' src='https://i.ibb.co/G2Y5MZF/313207417-2098556140346430-6102765766206724987-n.jpg'/>
                        <div className='fullname-about'>Đỗ Văn Giang</div>
                        <div className='position-about'>Developer, BA</div>
                    </div>
                    
                    <div className='card-about'>
                        <Avatar className='image-about' src='https://i.ibb.co/fHbyBXc/huong.jpg'/>
                        <div className='fullname-about'>Dương Thị Thanh Hường</div>
                        <div className='position-about'>Tester, QA</div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}