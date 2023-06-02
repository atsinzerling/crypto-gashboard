import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import moment from 'moment';
import './Dashboard.css';

const holdings = [
    {
        date: '2023-01-01',
        bitcoin: 400,
        ethereum: 3000,
    },
    {
        date: '2023-02-01',
        bitcoin: 410,
        ethereum: 3100,
        ripple: 190,
    },
    {
        date: '2023-03-01',
        bitcoin: 500,
        ethereum: 3150,
        ripple: 210,
    },
    {
        date: '2023-05-01',
        bitcoin: 500,
        ethereum: 3100,
        ripple: 215,
    }
];

const CryptoChart = () => {
    const [data, setData] = useState([]);
    const [holdingsData, setHoldingsData] = useState(holdings); // Use holdings as state

    const [currentDataEntry, setCurrentDataEntry] = useState({ total: 0, quantity: {} });

    // Extract coins and start date from holdings
    const coins = [...new Set(holdingsData.flatMap(holding => Object.keys(holding).filter(key => key !== 'date')))];
    const startDate = holdingsData.reduce((minDate, holding) => holding.date < minDate ? holding.date : minDate, holdingsData[0].date);

    useEffect(() => {
        const fetchData = async () => {
            // Order the holdings data by date
            holdingsData.sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? -1 : 1);

            let currentHoldings = {};

            // Initialize chartData with an array covering each date from startDate to today
            let chartData = [];
            for (let m = moment(startDate); m.isSameOrBefore(moment(), 'day'); m.add(1, 'days')) {
                chartData.push({ date: m.format('YYYY-MM-DD') });
            }

            for (const coin of coins) {
                // Fetch price data for the coin
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}/market_chart`, {
                    params: {
                        vs_currency: 'usd',
                        days: moment().diff(moment(startDate), 'days')
                    }
                });

                response.data.prices.forEach((item) => {
                    const date = moment(item[0]).format('YYYY-MM-DD');
                    const price = item[1];

                    // Find the corresponding holding for the current date
                    const newHolding = holdingsData.find(holding => holding.date === date);

                    // Update currentHoldings if newHolding exists
                    if (newHolding) {
                        currentHoldings = { ...currentHoldings, ...newHolding };
                    }

                    const quantity = currentHoldings[coin] || 0;

                    // Find the corresponding data item for the current date
                    const dataItem = chartData.find(dataItem => dataItem.date === date);
                    dataItem[coin] = price * quantity; // Calculate value of holding
                    if (!dataItem.quantity) {
                        dataItem.quantity = {};
                    }
                    dataItem.quantity[coin] = quantity; // Add quantity to data item
                    dataItem.total = (dataItem.total || 0) + dataItem[coin]; // Update total value
                });
            }

            setData(chartData);
        };

        fetchData();
    }, [startDate, holdingsData, coins]);



    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            /*const total = payload.reduce((acc, current) => acc + current.value, 0);
            setTotalValue(total.toFixed(2));

            const coinDetail = payload.map((coin) => ({
                name: coin.name,
                value: coin.value,
                quantity: coin.payload[coin.dataKey]
            }));*/
            /*console.log(payload[0].payload);*/
            setCurrentDataEntry(payload[0].payload);
            /*console.log(payload, coinDetail);*/

            return (
                <div className="custom-tooltip">
                    <p>{`${payload[0].payload.total.toFixed(2)} USD`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className='display-graph-data'>
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
                <Line type="monotone" dataKey="total" stroke="#8884d8" dot={false} /> {/* Show total value */}
            </LineChart>
            <div>
                <p>{`Date: ${currentDataEntry.date}`}</p>
                <p>{`Total value: ${currentDataEntry.total.toFixed(2)} USD`}</p>
                {Object.keys(currentDataEntry.quantity).map((coin) => (
                    <p key={coin}>
                        {`${coin}: Quantity = ${currentDataEntry.quantity[coin]}, Total Value = ${currentDataEntry[coin].toFixed(2) } USD`}
                    </p>
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <CryptoChart />
        </div>
    );
};

export default Dashboard;
