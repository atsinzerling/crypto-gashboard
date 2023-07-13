import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const CustomTimeline = () => {
    const svgRef = useRef();
    const tooltipRef = useRef();
    const [timelineData, setTimelineData] = useState([]);
    const [currentDate, setCurrentDate] = useState();
    const [currentXPosition, setCurrentXPosition] = useState(0);
    const [dataPointsPositions, setDataPointsPositions] = useState([]);
    const [zoomScale, setZoomScale] = useState(1);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const now = new Date();
        const twoHalfYearsAgo = new Date();
        twoHalfYearsAgo.setMonth(now.getMonth() - 30);

        const xScale = d3.scaleTime().domain([twoHalfYearsAgo, now]).range([0, width]);

        const xAxis = d3
            .axisBottom(xScale)
            .ticks(width > 800 ? d3.timeMonth.every(1) : d3.timeYear.every(1))
            .tickSize(-height);

        const gX = svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        const zoom = d3
            .zoom()
            .scaleExtent([0.5, 20])
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", function (event) {
                let t = event.transform;
                let xScaleZ = t.rescaleX(xScale);
                setZoomScale(t.k); // Store the zoom scale
                let xAxisZ = d3
                    .axisBottom(xScaleZ)
                    .ticks(width > 800 ? d3.timeMonth.every(1) : d3.timeYear.every(1))
                    .tickSize(-height);
                gX.call(xAxisZ);
            });

        svg.call(zoom);

        svg.on("mousemove", function (event) {
            const bounds = svg.node().getBoundingClientRect();
            const xPosition = d3.pointer(event)[0];
            const hoveredDate = xScale.invert(xPosition - bounds.left);
            setCurrentDate(hoveredDate);
            setCurrentXPosition(xPosition - bounds.left); // update x position
            console.log("moved");
        });

        svg.on("click", function (event) {
            const bounds = svg.node().getBoundingClientRect();
            const xPosition = d3.pointer(event)[0];
            const clickedDate = xScale.invert(xPosition - bounds.left);

            const newData = {
                label: "",
                at: clickedDate,
                uid: Math.random()
            };
            setTimelineData([...timelineData, newData]);
            setDataPointsPositions(prevPositions => [
                ...prevPositions,
                {
                    uid: newData.uid,
                    position: (xScale(newData.at) - xScale.range()[0]) /
                        (xScale.range()[1] - xScale.range()[0]) * 100
                }
            ]);
        });
    }, [timelineData]);

    // Adjust data points position based on zoom scale
    useEffect(() => {
        setDataPointsPositions(prevPositions =>
            prevPositions.map(pos => ({
                ...pos,
                position: (pos.position * zoomScale) % 100, // Adjust position based on zoom scale
            }))
        );
    }, [zoomScale]);

    const handleChange = (value, uid) => {
        const newData = timelineData.map((item) => {
            if (item.uid === uid) {
                return { ...item, label: value };
            }
            return item;
        });
        setTimelineData(newData);
    };

    return (
        <div style={{ position: 'relative' }}>
            <svg ref={svgRef} width="800" height="100" />
            <div ref={tooltipRef} className="tooltip" style={{
                position: 'absolute',
                transform: `translateX(${currentXPosition}px)` // use x position
            }}>
                {currentDate ? currentDate.toLocaleDateString() : ""}
            </div>
            {timelineData.map(item => {
                // find the x position for this data point
                const itemPosition = dataPointsPositions.find(pos => pos.uid === item.uid)?.position || 0;

                return (
                    <div
                        key={item.uid}
                        className="datapoint"
                        style={{
                            position: "absolute",
                            left: `calc(${itemPosition}% - 10px)` // use x position
                        }}
                    >
                        <input
                            type="text"
                            value={item.label}
                            onChange={e => handleChange(e.target.value, item.uid)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default CustomTimeline;
