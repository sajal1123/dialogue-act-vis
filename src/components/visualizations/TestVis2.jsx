import React, { useEffect, useRef, useMemo, useState } from 'react';
import useSVGCanvas from '../shared/useSVGCanvas';
import * as d3 from 'd3';

const x = [1, 2, 3, 4]
const y = [0, 2, 3, 4]


export default function TestVis2(props) {
  //this is a generic component for plotting a d3 plot
  const d3Container = useRef(null);
  const [svg, height, width, tTip] = useSVGCanvas(d3Container);
  const margin = 50;
  const radius = 10;

  let xScale = d3.scaleLinear()
    .domain([1, 4])
    .range([margin, width - margin]);
  let yScale = d3.scaleLinear()
    .domain([0, 4])
    .range([height - margin, margin]);

  useEffect(() => {
    if (svg === undefined) { return }
    svg.selectAll('g').remove()
    svg.append('g')
      .attr('transform', `translate(10,${height - margin + 1})`)
      .call(d3.axisBottom(xScale))

    svg.append('g')
      .attr('transform', `translate(${margin - 2},0)`)
      .call(d3.axisLeft(yScale))
    svg.selectAll(".dot").remove()
    svg.append('g')
      .selectAll(".dot")
      .data(y)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d, idx) => xScale(idx + 1))
      .attr("cy", (d) => yScale(d))
      .attr("r", 4)
      .style("fill", "#d95f02")
  }, [svg]);

  return (
    <>
      <div
        className={"d3-component"}
        style={{ 'height': '99%', 'width': '99%' }}
        ref={d3Container}
      ></div>
    </>
  );
}


