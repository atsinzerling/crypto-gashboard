import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip , ReferenceLine} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Button, Typography } from '@mui/material';
import moment from 'moment';
import './CryptoCoinChart.css';

import CustomTick from './CustomTick';

class CryptoCoinChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCoinDataEntry: {
                total: 0, coins: {}
            },

            visibleData: [], // Initial visible data here
            zoomLevel: 1,
            visibleStart: 0,
            visibleEnd: 0,
        };

        this.chartRef = React.createRef();
        this.wheelHandler = this.wheelHandler.bind(this);
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
                visibleData: this.props.data,
                visibleEnd: this.props.data.length - 1,
            });
        }
        this.chartRef.current.addEventListener("wheel", this.wheelHandler);

    }

    componentWillUnmount() {
        this.chartRef.current.removeEventListener("wheel", this.wheelHandler);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data && this.props.data.length > 0) {
            this.setState({
                currentCoinDataEntry: this.props.data[this.props.data.length - 1],
                visibleData: this.props.data,
                visibleEnd: this.props.data.length - 1,
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

    wheelHandler(e) {
        e.preventDefault();
        const { zoomLevel, visibleData, visibleEnd, visibleStart } = this.state;
        const { data } = this.props;
        // Change the zoom level based on the event delta. 
        // The exact formula will depend on how you want the zooming to behave.
        const newZoomLevel = Math.max(1, zoomLevel - e.deltaY * 0.0008);

        // Find the index of the current entry
        const currentIndex = data.findIndex(entry => entry.date === this.state.currentCoinDataEntry?.date);
        /*const currentIndex = this.state.currentDataEntry?.date ;*/

        if (currentIndex === undefined) {
            return;
        }

        // Calculate the new visible range
        const visibleRange = Math.round(data.length / newZoomLevel);

        const visiblePositionRatio = (currentIndex - visibleStart) / (visibleEnd - visibleStart);

        // Calculate the new start and end indices based on the mouse position and the new range
        let newStart = Math.round(currentIndex - visiblePositionRatio * visibleRange);
        let newEnd = newStart + visibleRange;

        // Make sure the new range doesn't exceed the data boundaries
        if (newStart < 0) {
            newStart = 0;
            newEnd = newStart + visibleRange;
        }
        if (newEnd > data.length) {
            newEnd = data.length;
            newStart = newEnd - visibleRange;
        }

        // Update the state with the new zoom level and visible data
        this.setState({
            zoomLevel: newZoomLevel,
            visibleStart: newStart,
            visibleEnd: newEnd,
            visibleData: data.slice(newStart, newEnd),
            currentCoinDataEntry: data[currentIndex],
        });
        console.log("Mouse wheeling over graph");
    };

    render() {
        const { coin, data, color, currentMetric } = this.props;
        return (
            <Box>
                <Typography variant="h4">{`${coin}`}</Typography>
                <Box display="flex">
                    <Box ref={this.chartRef}>
                        <LineChart
                            width={700}
                            height={230}
                            data={this.state.visibleData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 45 }}
                        >
                            <XAxis dataKey="date"
                                tick={<CustomTick visibleStart={this.state.visibleStart} visibleEnd={this.state.visibleEnd} visibleData={this.state.visibleData} />}
                                interval={Math.floor((this.state.visibleEnd - this.state.visibleStart) / 10)}
                            />
                            <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                            <ReferenceLine x={this.state.currentCoinDataEntry.date} stroke="#ccc" />
                            <Tooltip content={this.CustomTooltip} />
                            <Line type="linear" dataKey={`coins.${coin}.${currentMetric}`} stroke={color} dot={false} />
                            {currentMetric === 'price' ? null : <Line type="linear" dataKey={`coins.${coin}.invested`} stroke="#A0AAFF" dot={false} />}
                        </LineChart>
                    </Box>

                    <Box ml={2}>
                        <Typography>
                            {`Date: ${this.state.currentCoinDataEntry?.date ? moment(this.state.currentCoinDataEntry.date).format('MMM D, YYYY') : 'Date not available'}`}
                        </Typography>

                        {currentMetric === 'price' ? (
                            <Typography style={{ color: color }}>
                                {`Price of ${coin}: ${new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.state.currentCoinDataEntry.coins[coin]?.price)} USD`}
                            </Typography>
                        ) : (
                            <>
                                <Typography>
                                    {`Profit: ${new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(((this.state.currentCoinDataEntry.coins[coin]?.value / this.state.currentCoinDataEntry.coins[coin]?.invested - 1) * 100))} %`}
                                </Typography>
                                <Typography>
                                    {`Invested: ${new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.state.currentCoinDataEntry.coins[coin]?.invested)} USD`}
                                </Typography>
                                <Typography style={{ color: color }}>
                                    {`Value of ${coin}: ${new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.state.currentCoinDataEntry.coins[coin]?.value)} USD`}
                                </Typography>
                                <Typography style={{ color: color }}>
                                    {`Quantity: ${new Intl.NumberFormat('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(this.state.currentCoinDataEntry.coins[coin]?.quantity)}`}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }
}





export default CryptoCoinChart;