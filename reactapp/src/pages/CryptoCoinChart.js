import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import './CryptoCoinChart.css';

/*class CryptoCoinChart extends React.Component {
    render() {
        const { coin, data, color, currentDataEntry } = this.props;
        return (
            <div className="display-subgraph-data">
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
                <div >
                    <p>
                        <span style={{ color: color }}>{coin}</span>{`: ${(typeof currentDataEntry[coin] === "undefined" ? 0 :currentDataEntry[coin].toFixed(2))} USD`}
                    </p>
                </div>
            </div>
        );
    }
}*/

class CryptoCoinChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCoinDataEntry: { total: 0, quantity: 0 },
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

    CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            this.handleActiveTooltip({ active, payload });
            console.log(payload);

            return (
                <div className="custom-tooltip">
                    <p>{`${payload[0].value.toFixed(2)} USD`}</p>
                </div>
            );
        }
        return null;
    }

    render() {
        const { coin, data, color } = this.props;
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                    <h4>{`Value of ${coin}`}</h4>
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
                        <Line type="monotone" dataKey={coin} stroke={color} dot={false} />
                    </LineChart>
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <p>{`Date: ${this.state.currentCoinDataEntry.date}`}</p>
                    <p style={{ color }}>
                        {`Value of ${coin}: ${this.state.currentCoinDataEntry[coin]?.toFixed(2)} USD`}
                    </p>
                </div>
            </div>
        );
    }
}





export default CryptoCoinChart;