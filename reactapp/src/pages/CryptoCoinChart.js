import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

class CryptoCoinChart extends React.Component {
    render() {
        const { coin, data, color } = this.props;
        return (
            <div>
                <h4>{`Value of ${coin}`}</h4>
                <LineChart
                    width={400}
                    height={200}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey={coin} stroke={color} dot={false} />
                </LineChart>
            </div>
        );
    }
}

export default CryptoCoinChart;