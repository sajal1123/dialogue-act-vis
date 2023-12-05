import React from 'react';
import Panel from '../components/core/Panel';
import PanelContainer from '../components/core/PanelContainer';

function Tab2(props) {
    const Panel_1_1  = <Panel title={"Panel 1"} bgColor={"#CDA434"}/>
    const Panel_1_2  = <Panel title={"Panel 2"} bgColor={"#4C514A"}/>
    const Panel_2_1  = <Panel title={"Panel 3"} bgColor={"#CFD3CD"}/>
    const Panel_2_2  = <Panel title={"Panel 4"} bgColor={"#C93C20"}/>
    return (
        <>
            <PanelContainer panels={[Panel_2_1, Panel_1_1, Panel_2_2]} />
        </>
    );
}

export default Tab2;