import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RandomScatterPlot() {
  const d3Container = useRef(null);

  useEffect(() => {
    // Generate random data
    const data = generateRandomData(50); // Change the number of data points as needed

    // Set up your SVG container
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 200 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create scales for your data
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height, 0]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Create circles for each data point
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .style('fill', '#d95f02');

    // Add x and y axis labels
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .text('X Axis Label');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -30)
      .text('Y Axis Label');
  }, []);

  function generateRandomData(numPoints) {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      data.push({
        x: Math.random() * 100, // Adjust the range as needed
        y: Math.random() * 100, // Adjust the range as needed
      });
    }
    return data;
  }

  return (
    <div className="d3-component" style={{ 'height': '99%', 'width': '99%' }} ref={d3Container}></div>
  );
}
