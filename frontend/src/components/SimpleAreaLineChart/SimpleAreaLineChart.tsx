import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type props = {
  data: any
}

const SimpleAreaLineChart: React.FC<props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="visits" stackId="1" stroke="#82ca9d" fill="#DBC2CF" />
        <Area type="monotone" dataKey="bounceVisit" stackId="2" stroke="#82ca9d" fill="#3E6990" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaLineChart;
