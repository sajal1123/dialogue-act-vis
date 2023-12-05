import React, { useState } from 'react';
import './DialogueComponent.css';
import Panel from '../core/Panel';
import jsonData from '../../tabs/Conv11103.json'
import emotionMap from '../../data/emotionMap';
import actNum from '../../data/daLabelsDict';
import EDAs from '../../data/daMap';

export default function ConversationVisualization(data) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleRowClick = (conversation) => {
    if (selectedConversation === conversation) {
      setSelectedConversation(null);
    } else {
      setSelectedConversation(conversation);
    }
  };

  const conversations = Object.entries(data)[0][1]//jsonData[0]["Table 1"];

  return (
      <div className="table-container">
        <div className='title-text'>
          <h2>Utterance Data for Conversation ID: {conversations[0].conv_id} </h2>
        </div>
        <table>
          <thead>
            <tr>
              {/* <th>Conv_id</th> */}
              <th>Utterance #</th>
              <th>Emotion</th>
              <th>Sentiment Switch</th>
              <th>Act</th>
              <th>Predicted Act</th>
              <th>Dialogue Text</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation, index) => (
              <tr
                key={`${conversation.conv_id}_${index}`}
                onClick={() => handleRowClick(conversation)}
                className={`${selectedConversation === conversation ? "selected" : ''}`}
              >
                {/* <td>{conversation.conv_id}</td> */}
                <td>{index}</td>
                <td>{emotionMap[conversation.topic]}</td>
                <td>{conversation.speaker === 0 ? 'No' : 'Yes'}</td>
                <td>{EDAs[actNum[conversation.act]]}</td>
                <td className={`${conversation.act === conversation.DApredict ? "correct" : "incorrect"}`}>{EDAs[actNum[conversation.DApredict]]}</td>
                <td>{conversation.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
  }
