import { Avatar, Comment, Rate, Tooltip } from "antd"
import { DateToShortStringDate, formatDate } from "../../common/service"
import { avatarImage, domain } from "../../data/default-image"

export const RateCommentList  =  ({list})=>{
    return (
        list.map(rate=>{
           // console.log('rate', rate)
            return (
                <Comment
                    author={rate.type_rate==='company'?rate.account.fullname:rate.account_company.fullname}
                    avatar={<Avatar className="avatar-rate" size={50} src={rate.type_rate==='company'?rate.account.avatar?domain+rate.account.avatar: avatarImage:rate.account_company.avatar?domain+rate.account_company.avatar: avatarImage} alt="avatar" />}
                    content={<>
                        <div>
                       {rate.content}
                        </div>
                        <Rate disabled defaultValue={rate.score} count={10}/>
                    </>
                        
                    }
                    datetime={
                        <Tooltip title={DateToShortStringDate(rate.create_date)}>
                        <span>{formatDate(rate.create_date)}</span>
                        </Tooltip>
                    }
                    />
            )
        })
    )
}