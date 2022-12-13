import { Column } from '@ant-design/plots';

export const ChartCV = ({CV}) => {
    if(CV.views.length){
    const datax = CV.views.map((item)=>{
        return {
            name: item.company.com_name,
            view: item.views
        }
    })
  const config = {
    data: datax,
    xField: 'name',
    yField: 'view',
    seriesField: 'name',
    legend: {
      position: 'top-left',
    },
  };
  return <Column {...config} />;
}else{
    return 'Chưa có Lượt xem nào!'
}
};
