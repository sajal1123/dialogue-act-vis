import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import 'd3-selection';
import DaNames from '../../data/DaNames';
import jsonData from '../../data/Conv11103.json'
import EDAs from '../../data/daMap';
import actNum from '../../data/daLabelsDict';

const WordCloud = (props) => {
  const svgRef = useRef(null);

  const data = props.data;

  const daLabels = data.map(row => ([EDAs[actNum[row['act']]], actNum[row['act']]]));

  const words = countNumbers(daLabels);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 300;
    const radiusScale = d3.scaleSqrt().domain([0, 2]).range([0, 30]);
    const padding = 3;

    svg.selectAll('circle').remove(); // Remove existing circles
    svg.selectAll('text').remove(); // Remove existing texts

    const data = Object.entries(words).map(([text, count]) => ({
      text,
      count: count[0],
      radius: radiusScale(count[0]),
      code: count[1]
    }));
 
    const simulation = d3.forceSimulation(data)
      .force('collide', d3.forceCollide().radius(d => d.radius + padding))
      .force('x', d3.forceX(width / 3).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('charge', d3.forceManyBody().strength(5));

    const circles = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', 'lightblue')
      .attr('stroke', 'blue')
      .on('mouseover', function (e, d) {
        // Handle mouseover event
        const text = d.text;
        const count = d.count;
        const code = d.code;

        d3.select(this).style('opacity', 0.5);

        // Show the tooltip
        tooltip.transition()
          .duration(1000)
          .style('opacity', 0.9);

        // Update tooltip HTML content with the desired information
        tooltip.html(`
            <div>DA Label: ${text}</div>
            <div>Count: ${count}</div>
            <div>Abbreviation: ${code}</div>
        `)
          .style('left', (e.pageX) + 'px')
          .style('top', (e.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        // Handle mouseout event
        // Hide the tooltip
        d3.select(this).style('opacity', 1);
        tooltip.transition()
          .duration(1000)
          .style('opacity', 0);
      });

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    circles.each(function (d, i) {
      const circle = d3.select(this);

      const text = svg
        .append('text')
        .attr('x', +circle.attr('cx'))
        .attr('y', +circle.attr('cy'))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(d.code)
        .attr('fill', 'black');
      // }
    });


    simulation.on('tick', () => {
      circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      circles.each(function (d, i) {
        const circle = d3.select(this);
        const text = svg
          .selectAll('text')
          .filter((_, index) => index === i);

        text
          .attr('x', d.x)
          .attr('y', d.y);
      });
    });
  }, [words]);

  return <svg ref={svgRef} width="100%" height={'100%'} style={{'paddingLeft': '25%'}}></svg>;
};

export default WordCloud;


function countNumbers(numbers) {
  const countDict = {}; 

  for (const number of numbers) {
    if (countDict[number[0]] == undefined) {
      countDict[number[0]] = [1, number[1]];
    } else {
      countDict[number[0]][0] += 1;
    }
  }

  return countDict;
}