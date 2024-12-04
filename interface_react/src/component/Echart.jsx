import ReactECharts from 'echarts-for-react';

export default function Echart({option}) {
    return <ReactECharts option={option} style={{ height: '600px', width: '100%' }} />;
  
}
