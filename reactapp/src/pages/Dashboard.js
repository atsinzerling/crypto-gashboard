/*import CryptoChart from './CryptoChart';*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import moment from 'moment';
import './Dashboard.css';

const holdings = [
    {
        date: '2023-01-01',
        Bitcoin: 400,
        Ethereum: 3000,
    },
    {
        date: '2023-02-01',
        Bitcoin: 410,
        Ethereum: 3100,
        Litecoin: 190,
    },
    {
        date: '2023-03-01',
        Bitcoin: 500,
        Ethereum: 3150,
        Litecoin: 210,
    },
    {
        date: '2023-05-01',
        Bitcoin: 500,
        Ethereum: 3100,
        Litecoin: 215,
    }
];


const CryptoChart = ({ startDate }) => {
    const [data, setData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const coins = ['bitcoin', 'ethereum', 'ripple']; // replace with your coins
            let chartData = [];

            for (const coin of coins) {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart`, {
                    params: {
                        vs_currency: 'usd',
                        days: moment().diff(moment(startDate), 'days')
                    }
                });

                response.data.prices.forEach((item, index) => {
                    const date = moment(item[0]).format('YYYY-MM-DD');
                    const price = item[1];

                    if (!chartData[index]) {
                        chartData[index] = { date };
                    }

                    chartData[index][coin] = price;
                });
            }

            setData(chartData);
        };

        fetchData();
    }, [startDate]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((acc, current) => acc + current.value, 0);
            setTotalValue(total.toFixed(2));
            return (
                <div className="custom-tooltip" > {/*style={{ backgroundColor: '#fff', padding: '3px', border: '1px solid #ccc', color: '#050404' }}*/}
                    {/*<p>{`Date: ${label}`}</p>*/}
                    <p>{`Total value: ${total.toFixed(2)} USD`}</p>
                </div>
            );
        }

        return null;
    };


    return (
        <div class='display-graph-data'>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="bitcoin" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="ethereum" stroke="#82ca9d" dot={false} />
                <Line type="monotone" dataKey="ripple" stroke="#ffc658" dot={false} />
            </LineChart>
            <div>
                <p>{`Total value: ${totalValue} USD`}</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <CryptoChart startDate="2022-01-01" />
        </div>
    );
};

export default Dashboard;