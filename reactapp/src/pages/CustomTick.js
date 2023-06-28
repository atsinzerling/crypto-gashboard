import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
/*import { PieChart, Pie, Cell } from 'recharts';*/
import moment from 'moment';


class CustomTick extends React.Component {
    render() {
        const { x, y, payload, visibleStart, visibleEnd, visibleData } = this.props;
        let date = moment(payload.value);
        /*console.log(date);
        console.log('Visible Start:', visibleStart);
        console.log('Visible End:', visibleEnd);*/
        const startDate = new Date(visibleData[0].date);
        const endDate = new Date(visibleData[visibleData?.length - 1].date);
        /*console.log(startDate, endDate);*/

        const diff = visibleEnd - visibleStart;
        // Define custom tick formatting here
        let format;
        if (diff > 100 || startDate.getFullYear() !== endDate.getFullYear()) {
            format = 'MMM D, YYYY';
        } else {
            format = 'MMM D';
        }

        /*format = 'MMM D, YYYY';*/

        /*console.log(date.format(format));*/
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
                    {date.format(format)}
                </text>
            </g>
        );
    }
}

export default CustomTick;