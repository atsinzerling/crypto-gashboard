import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import './CryptoCoinChart.css';

class CryptoCoinChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCoinDataEntry: {
                total: 0, coins: {} },
        };
        this.handleActiveTooltip = this.handleActiveTooltip.bind(this);
    }

    handleActiveTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            this.setState({
                currentCoinDataEntry: payload[0].payload,
            });
        }
    };

    componentDidMount() {
        if (this.props.data && this.props.data.length > 0) {
            this.setState({
                currentCoinDataEntry: this.props.data[this.props.data.length - 1],
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data && this.props.data.length > 0) {
            this.setState({
                currentCoinDataEntry: this.props.data[this.props.data.length - 1],
            });
        }
    }

    CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            this.handleActiveTooltip({ active, payload });
            /*console.log(payload);
            console.log(this.state.currentCoinDataEntry);*/

            /*console.log(payload[0].payload);
            console.log(payload[0].payload[this.props.coin]);*/

            return (
                <div className="custom-tooltip">
                    <p>{`${payload[0].payload.coins[this.props.coin]?.[this.props.currentMetric].toFixed(2)} USD`}</p> 
                </div>
            );
        }
        return null;
    }

    render() {
        const { coin, data, color, currentMetric} = this.props;
        return (
            <div >
                <h4>{`${coin}`}</h4>
                <div className='display-subgraph-data'>
                    <LineChart
                        width={440}
                        height={180}
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={this.CustomTooltip} />
                        <Line type="monotone" dataKey={`coins.${coin}.${currentMetric}`} stroke={color} dot={false} />
                        {currentMetric === 'price' ? (<></>) : (<Line type="monotone" dataKey={`coins.${coin}.invested`} stroke="#A0AAFF" dot={false} />) }
                    </LineChart>
                <div style={{ marginLeft: '20px' }}>
                        <p>{`Date: ${this.state.currentCoinDataEntry.date}`}</p>
                        {currentMetric === 'price' ? (

                            <p style={{ color }}>
                                {`Price of ${coin}: ${this.state.currentCoinDataEntry.coins[coin]?.price?.toFixed(2)} USD`}
                            </p>

                        ): (
                            <>
                                <p>{`Profit: ${((this.state.currentCoinDataEntry.coins[coin]?.value / this.state.currentCoinDataEntry.coins[coin]?.invested - 1) * 100)?.toFixed(2)} %`}</p>
                                <p>{`Invested: ${this.state.currentCoinDataEntry.coins[coin]?.invested?.toFixed(2)} USD`}</p>
                                <p style={{ color }}>
                                    {`Value of ${coin}: ${this.state.currentCoinDataEntry.coins[coin]?.value?.toFixed(2)} USD`}
                                </p>
                                <p style={{ color }}>
                                    {`Quantity: ${this.state.currentCoinDataEntry.coins[coin]?.quantity}`}
                                </p>
                            </>
                        )}
                        
                </div>
                </div>
            </div>
        );
    }
}





export default CryptoCoinChart;