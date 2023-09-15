import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type SimpleBarChartProps = {
    data?: any
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data = {} }) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart

                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#69b4df" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default SimpleBarChart