import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css'

export const Home = () => {
    const navigate = useNavigate();
    return <div className="home-container">
        {/* Chào mừng bạn tới với trang web của chúng tôi  */}
        <div className='title-home'>
            Chào mừng bạn tới với website kết nối doanh nghiệp với sinh viên
        </div>
        <div className='section-home-container'>
            <div className='section-image right-block'>
            {/* <img className='image-home' src="https://i.ibb.co/VwWbL5Y/Profiling-2.gif" alt="Profiling-2" border="0"/> */}
                <img className='image-home' src="https://i.ibb.co/DWpNgKW/Profiling-pana.png" alt="Profiling-pana" border="0"></img>
                </div>
            <div className='section-content left'>
                <div className='title-content'>Giới thiệu</div>
                <div className='underline-home'></div>
                <div className='paragraph'>
                    <p>Website được tạo ra với đề tài: 'Xây dựng hệ thống Kết nối doanh nghiệp với sinh viên'
                    </p>
                    <p>Website có các chức năng:</p>
                    <p>Quản lý tài khoản, Quản lý sinh viên, Quản lý doanh nghiệp, Quản lý tuyển dụng, Quản lý đánh giá, Quản lý thống kê, Quản lý tin tức</p>
                    <Button className='btn-home' onClick={()=>{navigate('/about')}}>Về chúng tôi</Button>
                    </div>
            </div>
        </div>
        <div className='section-home-container'>
            
            <div className='section-content right'>
                <div className='title-content right'>Sứ mệnh</div>
                <div className='right-block'><div className='underline-home'></div></div>
                <div className='paragraph'>
                    <p>Thực tập là giai đoạn giúp cho SV không bỡ ngỡ trước thực tế và cơ hội làm quen, trải nghiệm các kỹ năng mềm trong môi trường làm việc tập thể, chính vì vậy mà việc đưa SV đến các công ty là điều hết sức cần thiết. Chúng sẽ tạo cơ hội cho những “chú gà công nghiệp” tiếp cận với các công việc thực tế một cách tốt nhất, tích lũy được kinh nghiệm và có thể biết được công việc nào thực sự thích hợp với bản thân mình cũng như hiểu rõ được điểm mạnh và điểm yếu của bản thân.
</p>
                </div>
            </div>
            <div className='section-image'>
                <img className='image-home' src="https://i.ibb.co/RBqSzfy/Interview-bro.png" alt="Interview-bro" border="0"></img>
            </div>
        </div>
        <div className='section-home-container'>
            <div className='section-image right-block'>
                <img className='image-home' src="https://i.ibb.co/brzhfVL/Resume-amico.png" alt="Resume-amico" border="0"></img>
            </div>
            <div className='section-content left'>
                <div className='title-content'>Cung cấp</div>
                <div className='underline-home'></div>
                <div className='paragraph'>
                    <p>Website cung cấp thông tin sinh viên, CV của các sinh viên</p>
                    <p>Website cung cấp thông tin các doanh nghiệp cho sinh viên</p>
                    <p>Website cung cấp thông tin các bài đăng tuyển dụng</p>
                    <p>Website giúp các sinh viên và doanh nghiệp có thể đánh giá, đưa ra hướng phát triển tốt hơn cho sinh viên và doanh nghiệp</p>
                    </div>
            </div>
        </div>
    </div>;
}