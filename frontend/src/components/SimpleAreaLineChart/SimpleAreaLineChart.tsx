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
  type: string
}

const SimpleAreaLineChart: React.FC<props> = ({ data, type }) => {
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
        <Area type="monotone" dataKey={type} stackId="1" stroke="#DBC2CF" fill="#DBC2CF" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaLineChart;
