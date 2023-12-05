import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import 'd3-selection';
import DaNames from '../../data/DaNames';
import jsonData from "../../data/Conv11103.json"
import EDAs from '../../data/daMap';
import actNum from '../../data/daLabelsDict';


const EmotionSequence = () => {
  let conversation = jsonData;
  const data = jsonData['0']['Table 1'];
  const daLabels = data.map(row => ([EDAs[actNum[row['act'] - 1]], actNum[row['act'] - 1]]));
  let words = countNumbers(daLabels);
  const svgRef = useRef(null);
  console.log("conversacionUno")
  console.log(conversation[0]['Table 1'])//pd
  const conversacionUno = conversation[0]['Table 1']
  const conversacionDos = []
  //emoNum = {‘anger’: 0, ‘disgust’: 1, ‘fear’: 2, ‘joy’: 3, ‘neutral’: 4, ‘sadness’: 5, ‘surprise’: 6}
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 200;
    const height = 320;
    const radiusScale = d3.scaleSqrt().domain([0, 1]).range([0, 30]);
    const padding = 1;

    console.log("initial conversacionDos")
    console.log(conversacionDos)
    const numbers=[]

    //pd
    //add an index number to data
    for (var i=0;i<conversacionUno.length; i++ ) {
      console.log(conversacionUno.length)
      console.log(i)
      console.log(conversacionUno[i].index)
      console.log(conversacionUno[i].topic)
      
      conversacionUno[i]["index"]=i
      
      
      console.log("this is index")
      console.log(conversacionUno[i].index)
      
      
    }
    console.log(numbers)
    console.log("conversacionUno")
    console.log(conversacionUno)
    console.log("conversacionUno length")
    console.log(conversacionUno.length)

    for (var i=0;i<conversacionUno.length; i++ ) {
      conversacionDos.pop()
    }
    console.log("conversacionDos")
    console.log(conversacionDos)

    const margin = { left: 30, top: 10, right: 3, bottom: 20 }
    const xScale = d3.scaleLinear()
      .range([margin.left, width - margin.right])
      .domain(d3.extent(conversacionUno.map(d => d.index)))
    


    svg.selectAll('g').remove()
    
    svg.append('g')
      .call(d3.axisBottom(xScale))
      .attr('transform', `translate(${2*margin.left},${height - 3*margin.bottom})`)

    function getColorDot(d){
        if (d.DApredict===d.act) {
          return 'SteelBlue'
        }
        
        return 'red'
    }

  //   function getColorLine(d){
  //     console.log("topic")
  //     console.log(d)
  //     if (d.topic===100) {
  //       return 'orange'
  //     }
  //     if (d.topic===101) {
  //       return 'green'
  //     }
  //     if (d.topic===102) {
  //       return 'SteelBlue'
  //     }
  //     if (d.topic===103) {
  //       return 'red'
  //     }
  //     if (d.topic===104) {
  //       return 'yellow'
  //     }
  //     if (d.topic===105) {
  //       return 'brown'
  //     }
      
  //     if (d.topic===106) {
  //       return 'black'
  //     }
  //     return 'red'
  // }

    const yScale = d3.scaleLinear()
      .range([height - 5*margin.bottom, 5*margin.top])
      .domain(d3.extent(conversacionUno.map(d => d.topic)))
    
    

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', `translate(${2*margin.left},0)`)
    
    svg.selectAll('circle')
      .data(conversacionUno)
      .enter()
      .append('circle') 
        .attr('cx', d => xScale(d.index))
        .attr('cy', d => yScale(d.topic))
        //.attr('cy', d => d.topic)
        .attr('r', 4)
        
        .style('fill', d => getColorDot(d))
        //.attr('stroke-width','.05')
        //.attr('stroke','black')
        //.attr('stroke-opacity','10')
        .attr('transform', `translate(${2*margin.left},0)`);
      
    
    const lineSeq = d3.line()
      .x(d => xScale(d.index))
      .y(d => yScale(d.topic))
      .curve(d3.curveStepAfter)
      //.attr('stroke',d => getColorDot(d))
      
    
    svg.append('g')
      .selectAll('path')
      .data([conversacionUno])
      .enter()
      .append('path')
        .attr('transform', `translate(${2*margin.left},0)`)
        .attr('d', d => lineSeq(d)) 
        .attr('fill', 'none')
        //these do what?
        //.attr("stroke-linejoin", "round")
        //.attr("stroke-linecap", "round")
        
        .attr('stroke','orange')// 'black')
        //.style('fill', d => getColorDot(d))
        
        
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height )
      .text('Utterance # within Conversation');
  
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 + 25)
      .attr('y',20)
      .text('Emotions');
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      //.attr('transform', 'rotate(-90)')
      .attr('x', width)
      .attr('y', 15)
      .attr('fill','red')
      .attr('stroke-width','.01')
      .attr('stroke','black')
      .text('DA PREDICTION ERROR');
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      //.attr('transform', 'rotate(-90)')
      .attr('x', width+11)
      .attr('y', 40)
      .attr('fill','SteelBlue')
      .attr('stroke-width','.01')
      .attr('stroke','black')
      .text('DA PREDICTION CORRECT');
    
    svg.selectAll('.legendRect')
      .append('rect').attr('class','legendRect')
      .attr('fill','red')
      .attr('transform', `translate(${2*margin.left},${height-2*margin.bottom})`)

    //pd

   
  }, [words],[conversation]);

  return <svg ref={svgRef} width="100%" height={'100%'} style={{'paddingLeft': '2%'}}></svg>;
};

export default EmotionSequence;

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
