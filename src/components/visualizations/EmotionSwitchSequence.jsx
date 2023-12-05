import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import 'd3-selection';
import DaNames from '../../data/DaNames';
import jsonData from "../../data/Conv11103.json"
import EDAs from '../../data/daMap';
import actNum from '../../data/daLabelsDict';
import ToolTip from '../core/Tooltip';
import useSVGCanvas from '../core/useSVGCanvas';//pp


const EmotionSequence = (data) => {
  const [opacityEmoTop, setOpacityEmoTop] = useState(1);
  const [opacitySentimentTop, setOpacitySentimentTop] = useState(1);

  let conversation = jsonData;

  //get the dropdown selected conversation
  const data1 = Object.entries(data)[0][1]

  const daLabels = data1.map(row => ([EDAs[actNum[row['act'] - 1]], actNum[row['act'] - 1]]));
  let words = countNumbers(daLabels);

  const svgRef = useRef(null);
  

  useEffect(() => {


    // var opacityEmoTop = opacityEmoTop

    //let opacitySwitch = 1

    //get the dropdown selected conversation
    const conversacionUno = Object.entries(data)[0][1]

    const margin = { left: 30, top: 10, right: 3, bottom: 20 }
    const width = 600;
    const height = 320;
    const svg = d3.select(svgRef.current);




    const radiusScale = d3.scaleSqrt().domain([0, 1]).range([0, 30]);
    const padding = 1;


    const numbers = []

    //add an index number to data
    for (var i = 0; i < conversacionUno.length; i++) {


      conversacionUno[i]["index"] = i




    }



    const xScale = d3.scaleLinear()
      .range([margin.left, width - margin.right])
      .domain(d3.extent(conversacionUno.map(d => d.index)))



    svg.selectAll('g').remove()

    //checkbox to turn off emotion path by setting opacity to zero 
    //(not working yet in svg, for now displayed on parent page, and so doesn't reset chart
    // d3.selectAll("g")
    //   .data(["emotion"])
    //   .enter()
    //   .append('label')
    //   .text(function (d) { return d; })
    //   .append("input")
    //   .attr("checked", true)
    //   .attr("type", "checkbox")

    //   .on("change", function () {

    //     if (this.checked) {
    //       opacityEmoTop = 1
    //       console.log(opacityEmoTop)
    //       //console.log(opacitySwitch)
    //     }
    //     else {
    //       opacityEmoTop = 0
    //       console.log(opacityEmoTop)
    //       //console.log(opacitySwitch)
    //     }
    //     //how do i reload graph with new opacity value
    //     //update();
    //     //svg.selectAll('circle').remove()
    //   }
    //   );



    svg.append('g')
      .call(d3.axisBottom(xScale))
      .attr('transform', `translate(${2 * margin.left},${height - 3 * margin.bottom})`)

    //color prediction true/false
    function getColorDot(d) {
      if (d.DApredict === d.act) {
        return 'SteelBlue'
      }

      return 'red'
    }


    const yScaleAx = d3.scaleLinear()
      .range([height - 5 * margin.bottom, 5 * margin.top])
      .domain([99, 107])

    const yScale = d3.scaleLinear()
      .range([height - 5 * margin.bottom, 5 * margin.top])
      .domain(d3.extent(conversacionUno.map(d => d.topic)))

    const rightScale = d3.scaleOrdinal()
      .range([height - 5 * margin.bottom, 5 * margin.top])
      .domain(d3.extent(conversacionUno.map(d => d.speaker)))

    svg.append('g')
      .call(d3.axisRight(yScaleAx).tickFormat(""))
      .attr('transform', `translate(${2 * margin.left},0)`)
      .attr('opacity', opacityEmoTop)

    svg.append('g')
      .call(d3.axisLeft(rightScale).tickFormat(""))
      .attr('transform', `translate(${225 * margin.right + 10},0)`)
      .attr('opacity', opacitySentimentTop)

    svg.selectAll('circle').remove()

    //emotion sequence
    svg.selectAll('circle')
      .data(conversacionUno)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.index))
      .attr('cy', d => yScaleAx(d.topic))
      .attr('r', 4)
      .attr('opacity', opacityEmoTop)

      .style('fill', d => getColorDot(d))
      .attr('transform', `translate(${2 * margin.left},0)`)
      .on('mouseover', function (e, d) {
        // Handle mouseover event
        const act = EDAs[actNum[d.act]];
        const predict = EDAs[actNum[d.DApredict]];


        d3.select(this).style('opacity', 0.5);

        // Show the tooltip
        tooltip.transition()
          .duration(1000)
          .style('opacity', 0.9);

        // Update tooltip HTML content with the desired information
        tooltip.html(`
              <div>DA Label: ${act}</div>
              <div>Prediction: ${predict}</div>
              
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

    svg.selectAll('rect').remove()

    //sentiment switch sequence 
    svg.selectAll('rect')
      .data(conversacionUno)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.index) - 7 / 2)
      .attr('y', d => rightScale(d.speaker) - 7 / 2)
      .attr('width', 7)
      .attr('height', 7)
      .attr('opacity', opacitySentimentTop)
      .style('fill', d => getColorDot(d))
      .attr('transform', `translate(${2 * margin.left},0)`)
      .on('mouseover', function (e, d) {
        // Handle mouseover event
        const act = EDAs[actNum[d.act]];
        const predict = EDAs[actNum[d.DApredict]];


        d3.select(this).style('opacity', 0.5);

        // Show the tooltip
        tooltip.transition()
          .duration(1000)
          .style('opacity', 0.9);

        // Update tooltip HTML content with the desired information
        tooltip.html(`
              <div>DA Label: ${act}</div>
              <div>Prediction: ${predict}</div>
              
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

    //line for sentiment switch
    const lineSeqSwitch = d3.line()
      .x(d => xScale(d.index))
      .y(d => rightScale(d.speaker))

    //path for sentiment switch
    svg.append('g')
      .selectAll('path')
      .data([conversacionUno])
      .enter()
      .append('path')
      .attr('transform', `translate(${2 * margin.left},0)`)
      .attr('d', d => lineSeqSwitch(d))
      .attr('fill', 'none')
      .attr('stroke', 'purple')
      .attr('opacity', opacitySentimentTop)

    //line for emotion sequence
    const lineSeq = d3.line()
      .x(d => xScale(d.index))
      .y(d => yScaleAx(d.topic))
      .curve(d3.curveStepAfter)





    //path for emotion sequence
    svg.append('g')
      .selectAll('path')
      .data([conversacionUno])
      .enter()
      .append('path')
      .attr('transform', `translate(${2 * margin.left},0)`)
      .attr('d', d => lineSeq(d))
      .attr('fill', 'none')


      .attr('stroke', 'orange')
      .attr('opacity', opacityEmoTop)
      .attr('stroke-width', '2')

    svg.selectAll('text').remove()
    //label chart
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 + 25)
      .attr('y', 730)
      .attr('fill', 'purple')
      .text('Sentiment Switches')
      .attr('opacity', opacitySentimentTop);

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .text('Utterance # within Conversation');


    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 75)
      .attr('fill', 'black')
      .attr('stroke-width', '.01')
      .attr('stroke', 'black')
      .attr('opacity', opacityEmoTop)
      .text('surprise');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 97)
      .attr('fill', 'black')
      .attr('opacity', opacityEmoTop)
      .text('sadness');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 118)
      .attr('fill', 'black')
      .attr('opacity', opacityEmoTop)
      .text('neutral');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 139)
      .attr('fill', 'black')//pink
      .attr('opacity', opacityEmoTop)
      .text('joy');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 161)
      .attr('fill', 'black')
      .attr('opacity', opacityEmoTop)
      .text('fear');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 182)
      .attr('fill', 'black')
      .attr('opacity', opacityEmoTop)
      .text('disgust');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 29)
      .attr('y', 203)
      .attr('fill', 'black')
      .attr('opacity', opacityEmoTop)
      .text('anger');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 125)
      .attr('y', 15)
      .attr('fill', 'red')
      .attr('stroke-width', '.01')
      .attr('stroke', 'black')
      .text('DA PREDICTION ERROR');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 136)
      .attr('y', 35)
      .attr('fill', 'SteelBlue')
      .attr('stroke-width', '.01')
      .attr('stroke', 'black')
      .text('DA PREDICTION CORRECT');

    svg.selectAll('.legendRect')
      .append('rect').attr('class', 'legendRect')
      .attr('fill', 'red')
      .attr('transform', `translate(${2 * margin.left},${height - 2 * margin.bottom})`)




  }, [words, conversation, opacityEmoTop]);

  let checkboxLabels = ["Emotion", "Sentiment Switches"]

  return (
    <>
      {checkboxLabels.map((label) => (
        <div key={label} style={{  alignItems: 'center', marginBottom: '8px' }}>
          <input
            id={label + ' Checkbox'}
            type='checkbox'
            onChange={handleCheckboxChange}
            checked={label === 'Emotion' ? opacityEmoTop === 1 : opacitySentimentTop === 1}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor={label + ' Checkbox'} style={{ fontSize: '14px', userSelect: 'none', color:(label === "Emotion")?'orange':"purple" }}>
            {label}
          </label>
        </div>
      ))}
      <svg ref={svgRef} width="100%" height={'100%'} style={{ paddingLeft: '2%' }}>
      </svg>
    </>
  );
  
  function handleCheckboxChange(event) {
    console.log("label = ", event.target.id);
    if(event.target.id == "Emotion Checkbox"){
      setOpacityEmoTop(event.target.checked ? 1 : 0);
    }
    else{
      setOpacitySentimentTop(event.target.checked ? 1 : 0);
    }
  }
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
