import React, { useEffect, useRef, useMemo, useState } from 'react';
import useSVGCanvas from '../../core/useSVGCanvas';
import * as d3 from 'd3';
import ToolTip from '../../core/Tooltip';




let daLabelBoxPositions = [3.7, 2.9, 2.1, 1.3, 0.5]
let emotionBoxPositions = [3.5, 3, 2.5, 2, 1.5, 1, 0.5]
const getPlotData = (data) => {
    var mappings = {}
    data.forEach((utterance) => {
        let act = utterance.act
        if (!Object.keys(mappings).includes(`${act}`)) {
            mappings[act] = []
        }
        mappings[act].push(utterance.topic - 100) // Recoding the emotions for each act
    })
    const topActs = Object.keys(mappings).sort((t1, t2) => { return mappings[t2].length - mappings[t1].length }).slice(0, 5).map(act => parseInt(act))

    const emotions = [0, 1, 2, 3, 4, 5, 6];
    const allEmotions = Object.values(Object.fromEntries(Object.entries(mappings).filter(([key, value]) => topActs.includes(parseInt(key))))).map(x => [...new Set(x)]).flatMap(x => x)
    let emotionCounts = {}
    emotions.forEach((emotion) => {
        emotionCounts[emotion] = allEmotions.filter(search => search == emotion).length
    })
    return {
        //topEmotions,
        actToEmotionsMap: mappings,
        topActs,
        emotions,
        emotionCounts
    }
}

const formLinks = (svg, xScale, yScale, data) => {
    let srcTargetPairs = []
    let links = []
    let linkProperties = []
    let maxCount = Math.max(...Object.values(data.emotionCounts))
    addArrowHeadDef(svg)
    data.topActs.forEach((act, idx) => {
        const emotions = data.actToEmotionsMap[act]
        const linkSource = {
            x: xScale(1.45),
            y: yScale(daLabelBoxPositions[idx] - 0.2)
        }

        emotions.forEach((emotion) => {
            const linkTarget = {
                x: xScale(3.50),
                y: yScale(emotionBoxPositions[emotion] - 0.1)
            }

            srcTargetPairs.push([linkSource, linkTarget])
            linkProperties.push({
                opacity: data.emotionCounts[emotion] / maxCount
            })
        })
    })

    svg.selectAll('.connections').remove();
    // Create links and Draw the links
    srcTargetPairs.forEach(([src, target], idx) => {
        const link = d3
            .linkHorizontal()
            .x(d => d.x)
            .y(d => d.y)({
                source: src,
                target: target
            });


        const path = svg
            .append('path')
            .attr('d', link)
            .attr('class', 'connections')
            .attr('marker-end', 'url(#arrow)')
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('opacity', linkProperties[idx].opacity);

        const length = path.node().getTotalLength()

        path.attr("stroke-dasharray", length + " " + length)
            .attr("stroke-dashoffset", length)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(500);
    })

}

function EmotionSankeyPlot(props) {
    let [data, setData] = useState(null);
    let [selectedEmotion, setSelectedEmotion] = useState(null);

    const d3Container = useRef(null);
    const [svg, height, width, tTip] = useSVGCanvas(d3Container);
    const margin = 10;
    let xScale = d3.scaleLinear()
        .domain([1, 4])
        .range([margin, width - margin]);
    let yScale = d3.scaleLinear()
        .domain([0, 4])
        .range([height - margin, margin]);

    const colorMap = d3.interpolateBuGn
    useEffect(() => {
        if (svg === undefined) { return }
        const plotData = getPlotData(props.data)
        if(JSON.stringify(plotData) !== JSON.stringify(data)){
            setSelectedEmotion(null)
        }
        if (JSON.stringify(plotData) !== JSON.stringify(data) && selectedEmotion === null) {
            setData(plotData)
            setSelectedEmotion(null)
        }
        if (!data) {
            return
        }


        svg.selectAll(".dalabels-heading").remove()
        svg.append('g')
            .selectAll(".dalabels-heading")
            .data([1])
            .enter()
            .append("text")
            .text("DA Labels")
            .attr("class", "dalabels-heading")
            .attr("x", xScale(0.95))
            .attr("y", yScale(3.8))

        svg.selectAll(".emotions-heading").remove()
        svg.append('g')
            .selectAll(".emotions-heading")
            .data([1])
            .enter()
            .append("text")
            .text("Emotions")
            .attr("class", "emotions-heading")
            .attr("x", xScale(3.45))
            .attr("y", yScale(3.8))


        // DA Label boxes
        svg.selectAll(".dalabels-box").remove()
        svg.append('g')
            .selectAll(".dalabels-box")
            .data(daLabelBoxPositions)
            .enter()
            .append("rect")
            .attr("class", "dalabels-box")
            .attr("x", (d, idx) => xScale(1))
            .attr("y", (d) => yScale(d))
            .attr("width", 60)
            .attr("height", 30)
            .style("fill", (d) => colorMap(d / 5))
            .on('mouseover', (e, d) => {
                let idx = daLabelBoxPositions.indexOf(d)
                let daLabelAbrv = actNum[data.topActs[idx]]
                let daLabel = EDAs[daLabelAbrv]
                tTip.html(daLabel);
            }).on('mousemove', (e) => {
                //see app.js for the helper function that makes this easier
                ToolTip.moveTTipEvent(tTip, e);
            }).on('mouseout', (e, d) => {
                ToolTip.hideTTip(tTip);
            });

        // DA label Text
        svg.selectAll(".dalabels-text").remove()
        svg.append('g')
            .selectAll(".dalabels-text")
            .data(daLabelBoxPositions)
            .enter()
            .append("text")
            .text((d, idx) => actNum[data.topActs[idx]])
            .attr("class", "dalabels-text")
            .attr("x", (d, idx) => xScale(1.15))
            .attr("y", (d) => yScale(d - 0.2))
            .on('mouseover', (e, d) => {
                let idx = daLabelBoxPositions.indexOf(d)
                let daLabelAbrv = actNum[data.topActs[idx]]
                let daLabel = EDAs[daLabelAbrv]
                tTip.html(daLabel);
            }).on('mousemove', (e) => {
                //see app.js for the helper function that makes this easier
                ToolTip.moveTTipEvent(tTip, e);
            }).on('mouseout', (e, d) => {
                ToolTip.hideTTip(tTip);
            });


        // Emotion Boxes
        svg.selectAll(".emotions-box").remove()
        svg.append('g')
            .selectAll(".emotions-box")
            .data(emotionBoxPositions)
            .enter()
            .append("rect")
            .attr("class", "emotions-box")
            .attr("x", (d, idx) => xScale(3.5))
            .attr("y", (d) => yScale(d))
            .attr("width", 60)
            .attr("height", 15)
            .style("fill", (d, idx) => emotionColors[idx][0])
            .style("stroke", (d, idx) => selectedEmotion === idx ? "#5DE23C" : "transparent")
            .style("stroke-width", "3.5")
            .on("click", (event, d) => {
                let emotion = emotionBoxPositions.indexOf(d);
                if (selectedEmotion == emotion) {
                    setSelectedEmotion(null);
                    setData(getPlotData(props.data))
                } else {
                    let plotData = getPlotData(props.data)
                    Object.keys(plotData.emotionCounts).forEach((e) => {
                        plotData.emotionCounts[e] = 0.15;
                    })
                    plotData.emotionCounts[emotion] = 5;
                    setSelectedEmotion(emotion);
                    setData(plotData)

                }
                //setSelectedEmotion(emotion)
            })


        // Emotion Text
        svg.selectAll(".emotions-text").remove()
        svg.append('g')
            .selectAll(".emotions-text")
            .data(emotionBoxPositions)
            .enter()
            .append("text")
            .text((d, idx) => emotions[idx])
            .attr("class", "emotions-text")
            .attr("x", (d, idx) => xScale(3.55))
            .attr("y", (d) => yScale(d - 0.115))
            .attr('font-size', '0.8em')
            .attr('fill', (d, idx) => emotionColors[idx][1])
            .on("click", (event, d) => {
                let emotion = emotionBoxPositions.indexOf(d);
                if (selectedEmotion == emotion) {
                    setSelectedEmotion(null);
                    setData(getPlotData(props.data))
                } else {
                    let plotData = getPlotData(props.data)
                    Object.keys(plotData.emotionCounts).forEach((e) => {
                        plotData.emotionCounts[e] = 0.15;
                    })
                    plotData.emotionCounts[emotion] = 5;
                    setSelectedEmotion(emotion);
                    setData(plotData)

                }
                //setSelectedEmotion(emotion)
            })

        // Form links here and put them on SVG
        formLinks(svg, xScale, yScale, data);

    }, [svg, props.data, data])
    return (
        <div
            className={"d3-component"}
            style={{ 'height': '100%', 'width': '100%' }}
            ref={d3Container}
        >
        </div>
    );
}

const addArrowHeadDef = (svg) => {
    const markerBoxWidth = 20;
    const markerBoxHeight = 20;
    const refX = markerBoxWidth / 2;
    const refY = markerBoxHeight / 2;
    const markerWidth = markerBoxWidth / 2;
    const markerHeight = markerBoxHeight / 2;
    const arrowPoints = [[0, 5], [0, 16], [10, 10]];

    svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'black');


    return svg;
}
const emotions = { 0: 'anger', 1: 'disgust', 2: 'fear', 3: 'joy', 4: 'neutral', 5: 'sadness', 6: 'surprise' }
const emotionColors = { 0: ['red', 'white'], 1: ['brown', 'white'], 2: ['black', 'white'], 3: ['pink', 'black'], 4: ['#E8E8E8', 'black'], 5: ['grey', 'white'], 6: ['orange', 'black'] }
const actNum = {
    0: 'qw^d',
    1: '^2',
    2: 'b^m',
    3: 'qy^d',
    4: '^h',
    5: 'bk',
    6: 'b',
    7: 'fa',
    8: 'sd',
    9: 'fo_o_fw_"_by_bc',
    10: 'ad',
    11: 'ba',
    12: 'ng',
    13: 't1',
    14: 'bd',
    15: 'qh',
    16: 'br',
    17: 'qo',
    18: 'nn',
    19: 'arp_nd',
    20: 'fp',
    21: 'aap_am',
    22: 'oo_co_cc',
    23: 'h',
    24: 'qrr',
    25: 'na',
    26: 'x',
    27: 'bh',
    28: 'fc',
    29: 'aa',
    30: 't3',
    31: 'no',
    32: '%',
    33: '^g',
    34: 'qy',
    35: 'sv',
    36: 'ft',
    37: '^q',
    38: 'bf',
    39: 'qw',
    40: 'ny',
    41: 'ar',
    42: '+',
    43: 'xx'
}

let EDAs = {
    'sd': 'Statement-non-opinion', 'sv': 'Statement-opinion',
    'qw': 'Wh-Question', 'qw^d': 'Declarative Wh-Question',
    'qy': 'Yes-No-Question', 'qy^d': 'Declarative Yes-No-Question',
    'qh': 'Rhetorical-Question', 'qo': 'Open-question', 'qrr': 'Or-Clause-Question',
    '^q': 'Quotation', '^g': 'Tag-Question',
    'nn': 'No-Answer', 'ng': 'Negative non-no answers',
    'ny': 'Yes-Answer', 'na': 'Affirmative non-yes answers',
    'no': 'Other Answer', 'nd': 'Dispreferred answer',
    'aa': 'Agree or Accept', 'ar': 'Reject', 'aap': 'Accept-part', 'am': 'Maybe',
    'ad': 'Action-directive', '^h': 'Hold before answer or agreement',
    'b': 'Acknowledge (Backchannel)', 'bk': 'Response Acknowledgement',
    'bh': 'Rhetorical Backchannel', 'ba': 'Appreciation or Assessment',
    'bf': 'Reformulate', 'br': 'Signal-non-understanding',
    'bd': 'Downplaying-response', '^2': 'Collaborative Completion',
    'fo': 'Other Forward Function', 'fc': 'Conventional-closing', 'fp': 'Conventional-opening',
    'ft': 'Thanking', 'fa': 'Apology', 'oo_co_cc': 'Offers, Options, Commits',
    '%': 'Uninterpretable', 'b^m': 'Repeat-phrase',
    't1': 'Self-talk', 't3': '3rd-party-talk',
    'h': 'Hedge',
    'x': 'Non-verbal',
    'xx': "Unknown"
}



export default EmotionSankeyPlot;
