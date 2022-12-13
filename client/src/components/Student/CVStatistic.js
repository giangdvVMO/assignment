import { Table } from "antd"
import { Link } from "react-router-dom";
import { ChartCV } from "./ChartCV"

export const CvStatistic = ({CV})=>{
    const columns = [
        {
          title: "Tên công ty",
          key: "com_name",
          render: (_, record) => (
            <p>{record.company.com_name}</p>
          ),
        },
        {
          title: "Địa chỉ",
          key: "address",
          render: (_, record) => (
            <p>{record.company.address}</p>
          ),
        },
        {
          title: "Số lượt xem",
          dataIndex: "views",
          key: "views",
        },
        {
          title: "Hành động",
          key: "action",
          render: (_, record) => (
            <Link to={`../company/${record.company._id}`}>Xem chi tiết</Link>
          ),
          fixed: "right",
        },
      ];
    return (
        <div className='statistic_container-cv'>
            <div className='view-count_container'>
                <div>SỐ LƯỢT XEM</div>
              </div>
            <div className='view-count_container'>
                <div className='statistic-number'>
                  <div>
                    {CV.count}
                  </div>
                </div>
            </div>
            <div className='container-image'>
            <div className='chart'>
              <ChartCV CV={CV}/>
            </div>
            <div className='table-statistic'>
              <Table
              pagination={false}
                dataSource={CV.views}
                columns={columns}
                scroll={{
                  x: 400,
                  y: 400,
                }}
              />
            </div>
            </div>
        </div>
    )
}