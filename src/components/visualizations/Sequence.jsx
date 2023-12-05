import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import 'd3-selection';
import jsonData from "../../data/Conv11103.json"
import EDAs from '../../data/daMap';
import actNum from '../../data/daLabelsDict';


const   Sequence = () => {
  let conversation = jsonData;
  const data = jsonData['0']['Table 1'];
  const daLabels = data.map(row => ([EDAs[actNum[row['act'] - 1]], actNum[row['act'] - 1]]));
  let words = countNumbers(daLabels);
  const svgRef = useRef(null);
  console.log(conversation[0]['Table 1'])//pd
  const conversacionUno = conversation[0]['Table 1']
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 320;
    const radiusScale = d3.scaleSqrt().domain([0, 1]).range([0, 30]);
    const padding = 3;

    //pd
    //add an index number to data
    for (var i = 0; i < conversacionUno.length; i++) {
      console.log(conversacionUno.length)
      console.log(i)
      console.log(conversacionUno[i].index)
      console.log(conversacionUno[i].speaker)
      conversacionUno[i]["index"] = i
      console.log("this is index")
      console.log(conversacionUno[i].index)
    }


    const margin = { left: 30, top: 10, right: 10, bottom: 20 }
    const xScale = d3.scaleLinear()
      .range([margin.left, width - margin.right])
      .domain(d3.extent(conversacionUno.map(d => d.index)))

    svg.append('g')
      .call(d3.axisBottom(xScale))
      .attr('transform', `translate(${2 * margin.left},${height - 3 * margin.bottom})`)

    function getColorDot(d) {
      if (d.DApredict === d.act) {
        return 'SteelBlue'
      }

      return 'red'
    }

    const yScale = d3.scaleOrdinal()
      .range([height - 5 * margin.bottom, 5 * margin.top])
      .domain(d3.extent(conversacionUno.map(d => d.speaker)))

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', `translate(${2 * margin.left},0)`)

    svg.selectAll('circle')
      .data(conversacionUno)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.index))
      .attr('cy', d => yScale(d.speaker))
      .attr('r', 4)
      .style('fill', d => getColorDot(d))
      .attr('transform', `translate(${2 * margin.left},0)`);


    const lineSeq = d3.line()
      .x(d => xScale(d.index))
      .y(d => yScale(d.speaker))

    svg.append('g')
      .selectAll('path')
      .data([conversacionUno])
      .enter()
      .append('path')
      .attr('transform', `translate(${2 * margin.left},0)`)
      .attr('d', d => lineSeq(d))
      .attr('fill', 'none')
      .attr('stroke', 'black')

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom)
      .text('Utterance # within Conversation');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 30)
      .text('Sentiment Switches');

    svg.append('text')
      .attr('text-anchor', 'middle')
      //.attr('transform', 'rotate(-90)')
      .attr('x', width)
      .attr('y', 15)
      .attr('fill', 'red')
      .text('INCORRECT DA PREDICTION');
    svg.append('text')
      .attr('text-anchor', 'middle')
      //.attr('transform', 'rotate(-90)')
      .attr('x', width)
      .attr('y', 30)
      .attr('fill', 'steelblue')
      .text('CORRECT DA PREDICTION');

    svg.selectAll('.legendRect')
      .append('rect').attr('class', 'legendRect')
      .attr('fill', 'red')
      .attr('transform', `translate(${2 * margin.left},${height - 2 * margin.bottom})`)

    //pd


  }, [words], [conversation]);

  return <svg ref={svgRef}  width="100%" height={'100%'}></svg>;
};

export default Sequence;

function countNumbers(numbers) {
  const countDict = {}; // Create an empty dictionary

  for (const number of numbers) {
    // console.log("NUMBER", number);
    if (countDict[number[0]] == undefined) {
      countDict[number[0]] = [1, number[1]]; // If the number is not in the dictionary, initialize the count to 1
    } else {
      countDict[number[0]][0] += 1; // If the number is already in the dictionary, increment the count
    }
  }

  return countDict;
}