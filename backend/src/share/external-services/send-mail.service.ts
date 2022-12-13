import { SEND_EMAIL_CONFIG } from 'src/configs/constant.config';
import * as nodemailer from 'nodemailer';

export const sendEmail = async (
  title: string,
  send_email: string,
  company: any,
  receiver: any,
  content: string,
) => {
  try {
    console.log('receiver', receiver);
    const transport = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      auth: {
        user: SEND_EMAIL_CONFIG.adminMail,
        pass: SEND_EMAIL_CONFIG.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // mailOption là những thông tin gửi từ phía client lên thông qua API
    const mailOptions = {
      from: SEND_EMAIL_CONFIG.adminMail,
      to: receiver.email,
      subject: title, // Tiêu đề email
      html: `<div style="width:1000px;margin:0 auto; text-align:center"><strong>
        Bạn nhận được thư mời phỏng vấn từ công ty: ${company.com_name}
        <br/>
        <div>${content}</div>
      </strong></div>
      <i>Bạn có thể phản hồi tới email: ${send_email}</i>`,
    };
    // Gọi hành động gửi email
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    // throw new BadRequestException(error);
  }
};
