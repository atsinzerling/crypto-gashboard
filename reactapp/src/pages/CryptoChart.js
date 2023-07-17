import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import CustomTick from './CustomTick';

class CryptoChart extends React.Component {
    render() {
        const { visibleData, currentDataEntry, visibleStart, visibleEnd, handleActiveTooltip, CustomTooltip, tooltipKey } = this.props;
        return (
            <LineChart
                width={850}
                height={300}
                data={visibleData}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            >
                <XAxis dataKey="date"
                    tick={<CustomTick visibleStart={visibleStart} visibleEnd={visibleEnd} visibleData={visibleData} />}
                    interval={Math.floor((visibleEnd - visibleStart) / 10)}
                />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                <ReferenceLine key={currentDataEntry.date} x={currentDataEntry ? currentDataEntry.date : null} stroke="#ccc" />
                <Tooltip content={CustomTooltip} key={tooltipKey} />
                <Line type="linear" dataKey="total" stroke="#001BFF" dot={false} />
                <Line type="linear" dataKey="totalinvested" stroke="#A0AAFF" dot={false} />
            </LineChart>
        );
    }
}

export default CryptoChart;
