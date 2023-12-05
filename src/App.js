import React, {useState,useEffect, useMemo} from 'react';
import './App.css';
import * as d3 from 'd3';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
const conversationData = require('./data/Conv11103.json')


function App() {

  //state deciding if we are looking at the blackhat or whitehat visualization
  const [viewToggle, setViewToggle] = useState('tab1');

  //fetch data, called only once
  useEffect(()=>{
    localStorage.conversationData = JSON.stringify(conversationData);
  },[])

  //toggle which visualization we're looking at based on the "viewToggle" state
  const tabs = ()=>{
    if(viewToggle === 'tab1'){
      return Tab1();
    }
    if(viewToggle === 'tab2'){
      return Tab2();
    }

    return <></>
  }

  return (
    <div className="App">
      {/* <div className={'header'} style={{'height':'2em','width':'100vw'}}> */}

        {/* Add Tabs Here */}
        {/* <button 
          onClick={() => setViewToggle('tab1')}
          className={viewToggle === 'tab1'? 'inactiveButton':'activeButton'}
          >{"Single Conversation"}
        </button> */}

        {/* <button 
          onClick={() => setViewToggle('tab2')}
          className={viewToggle === 'tab2'? 'inactiveButton':'activeButton'}
          >{"Tab 2"}
        </button> */}


      {/* </div>  */}
      <div className={'body'} 
        style={{'height':'calc(100vh - 2.5em)','width':'100vw'}}
        >
        {tabs()}
      </div>
    </div>
  );
}




export default App;
