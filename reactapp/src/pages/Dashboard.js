import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import moment from 'moment';
import './Dashboard.css';
import CryptoPieChart from './CryptoPieChart';
import CryptoCoinChart from './CryptoCoinChart';

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

const COLORS = {
    'bitcoin': '#FFBB28',
    'ethereum': '#8884d8',
    'ripple': '#82ca9d',
    'litecoin': '#ffc658',
};

/*class CustomTooltip extends React.Component {
    render() {
        const { active, payload } = this.props;

        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`${payload[0].payload.total.toFixed(2)} USD`}</p>
                </div>
            );
        }

        return null;
    }
}*/

/*class PieChartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieData: Object.keys(props.currentDataEntry.quantity).map((coin) => ({
                name: coin,
                value: props.currentDataEntry[coin],
            })),
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentDataEntry !== this.props.currentDataEntry) {
            this.setState({
                pieData: Object.keys(this.props.currentDataEntry.quantity).map((coin) => ({
                    name: coin,
                    value: this.props.currentDataEntry[coin],
                })),
            });
        }
    }

    render() {
        return (
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={this.state.pieData}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {this.state.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                </Pie>
            </PieChart>
        );
    }
}*/

class CryptoChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            holdingsData: holdings,
            currentDataEntry: { total: 0, quantity: {} },
        };

        this.handleActiveTooltip = this.handleActiveTooltip.bind(this);
        this.CustomTooltip = this.CustomTooltip.bind(this);
        this.coins = [...new Set(this.state.holdingsData.flatMap(holding => Object.keys(holding).filter(key => key !== 'date')))];
        this.startDate = this.state.holdingsData.reduce((minDate, holding) => holding.date < minDate ? holding.date : minDate, this.state.holdingsData[0].date);
    }

    handleActiveTooltip = (payload) => {
        if (payload && payload.length) {
            this.setState({
                currentDataEntry: payload[0].payload,
            });
        }
    };

    componentDidMount() {
        this.fetchData();
        console.log("fetching");
    }

    componentDidUpdate(prevProps, prevState) {
        /*if (prevState.startDate !== this.startDate || prevState.holdingsData !== this.state.holdingsData || prevState.coins !== this.coins) {
            this.fetchData();
        }*/
    }

    fetchData = async () => {
        // Order the holdings data by date
        let holdingsData = [...this.state.holdingsData];
        holdingsData.sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? -1 : 1);

        let currentHoldings = {};

        // Initialize chartData with an array covering each date from startDate to today
        let chartData = [];
        for (let m = moment(this.startDate); m.isSameOrBefore(moment(), 'day'); m.add(1, 'days')) {
            chartData.push({ date: m.format('YYYY-MM-DD') });
        }

        for (const coin of this.coins) {
            // Fetch price data for the coin
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: moment().diff(moment(this.startDate), 'days')
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

        this.setState({
            data: chartData,
            currentDataEntry: chartData[chartData.length - 1],
        });
    };



    CustomTooltip({ active, payload, label }) {
        if (active && payload && payload.length) {
            this.handleActiveTooltip(payload);

            return (
                <div className="custom-tooltip">
                    <p>{`${payload[0].payload.total.toFixed(2)} USD`}</p>
                </div>
            );
        }

        return null;
    };

    render() {
        return (
            <div>
                <div className='display-graph-data'>
                    <LineChart
                        width={500}
                        height={300}
                        data={this.state.data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={this.CustomTooltip} />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" dot={false} /> {/* Show total value */}
                    </LineChart>
                    <div>
                        <p>{`Date: ${this.state.currentDataEntry.date}`}</p>
                        <p>{`Total value: ${this.state.currentDataEntry.total.toFixed(2)} USD`}</p>
                        {Object.keys(this.state.currentDataEntry.quantity).map((coin) => (
                            <p key={coin}>
                                <span style={{ color: COLORS[coin] }}>{`${coin}`}</span>{`: Quantity = ${this.state.currentDataEntry.quantity[coin]}, Total Value = ${this.state.currentDataEntry[coin].toFixed(2)} USD`}
                            </p>
                        ))}
                    </div>
                    <CryptoPieChart data={this.state.currentDataEntry} colors={COLORS} />
                </div>
                {this.coins.map((coin) => (
                    <CryptoCoinChart
                        key={coin}
                        coin={coin}
                        data={this.state.data}
                        color={COLORS[coin]}
                    />
                ))}
            </div>
        );
    }
}

class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <CryptoChart />
            </div>
        );
    }
}

export default Dashboard;
