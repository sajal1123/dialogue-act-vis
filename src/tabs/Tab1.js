import React, { useEffect, useState } from 'react';
import Panel from '../components/core/Panel';
import PanelContainer from '../components/core/PanelContainer';
import ConversationVisualization from '../components/visualizations/DialogueComponent';
import WordCloud from '../components/visualizations/wordCloud';
import EmotionSankeyPlot from '../components/visualizations/TopEmotions/EmotionSankeyPlot';
import Sequence from '../components/visualizations/Sequence';
import EmotionSwitchSequence from '../components/visualizations/EmotionSwitchSequence';
import EmotionSankeyFooter from '../components/visualizations/TopEmotions/EmotionSankeyFooter';
import EmotionSequence from '../components/visualizations/EmotionSequence';
import SequenceFooter from '../components/visualizations/SequenceFooter';
import WordCloudFooter from '../components/visualizations/WordCloudFooter';
import convestations from "../data/Randomcsvjson.json";

let row1 = []
let row2 = []
function Tab1(props) {
  const [convID, setConvId] = useState(10010)
  const [data, setData] = useState(null)
  const convIDs = Array.from(new Set(convestations[0]['Table 1'].map((conv) => conv.conv_id)))
  let rows = getData(convID)
  
  useEffect(() => {
    rows = getData(convID)
  }, [convID])
  return (
    <>
      <label htmlFor="conversationId"><strong>Conversation ID:</strong></label>
      <select
        id="conversationId"
        onChange={(e) => {
          handleConvIDChange(setConvId, parseInt(e.target.value));
        }}
        value={convID}
        style={{
          width: '100px',
          fontSize: '16px',
          padding: '8px',  // Add padding for better appearance
          paddingTop: '10px',
          borderRadius: '5px',  // Add rounded corners
          border: '1px solid #ccc',  // Add a border
        }}
      >
        {convIDs.map((id, idx) => (
          <option key={idx} value={id}>
            {id}
          </option>
        ))}
      </select>
      {rows[0] && rows[1] ? (
        <>
          <PanelContainer panels={rows[0]} />
          <PanelContainer panels={rows[1]} />
        </>
      ) : null}
    </>
  );
  
}

export default Tab1;

const handleConvIDChange = (func, data) => {
  func(data)
}

const getData = (convID) => {
  let temp = convestations[0]['Table 1'].filter((conv) => conv.conv_id === convID)
  row1 = [
        <Panel title={"Conversations"} bgColor={"#ffffff"} visulization={<ConversationVisualization data={temp}/>} flex={0.65} />,
        <Panel title={"Dialogue Act Prevalence"} bgColor={"#ffffff"} footer={<WordCloudFooter />} visulization={<WordCloud data={temp}/>} flex={0.35} />
  ]
  row2 = [
        <Panel title={"Emotion / Dialogue Act association"} footer={<EmotionSankeyFooter/>} bgColor={"#ffffff"} visulization={<EmotionSankeyPlot data={temp}/>} flex={0.35} />,
        <Panel title={"DA Prediction and Sentiment, Emotion Changes"} bgColor={"#ffffff"} footer={<SequenceFooter />} visulization={<EmotionSwitchSequence data={temp}/>} flex={0.65} visHeight={'calc(100% - 2em)'} />
  ]
  
  return [row1, row2]
} 