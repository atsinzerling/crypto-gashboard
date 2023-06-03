import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';


const CryptoPieChart = ({ data, colors}) => {
    const pieData = Object.keys(data.quantity).map((coin) => ({
        name: coin,
        value: data[coin],
    }));

    return (
        <PieChart width={400} height={280}>
            <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx={150}
                cy={120}
                outerRadius={80}
                innerRadius={60} // This will create a "hole" in the center of the pie, turning it into a doughnut
                fill="#8884d8"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // This will show the percentage of the total that each slice represents
            >
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                ))}
            </Pie>
            </PieChart>
    );
};

export default CryptoPieChart;