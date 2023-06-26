import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';


const CryptoPieChart = ({ data, colors}) => {
    const pieData = (data?.coins ? Object.keys(data.coins).map((coin) => ({
        name: coin,
        value: data.coins[coin].value,
    })) : null);

    return (
        <PieChart width={190} height={170}>
            <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx={95}
                cy={85}
                outerRadius={80}
                innerRadius={60} // This will create a "hole" in the center of the pie, turning it into a doughnut
                fill="#8884d8"
                labelLine={false}
                //label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // This will show the percentage of the total that each slice represents
            >
                {(pieData ? pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                )) : <></>)}
            </Pie>
            </PieChart>
    );
};

export default CryptoPieChart;