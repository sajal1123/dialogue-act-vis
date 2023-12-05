import React from 'react';
import PropTypes from 'prop-types';

PanelContainer.propTypes = {
    panels: PropTypes.array,
};

function PanelContainer(props) {
    return (
        <div style={{ 'display': 'flex', 'height': '55%', 'marginTop': '2%' }}>
            {
                props.panels.map((panel,idx) => <React.Fragment key={idx}> {panel} </React.Fragment>)
            }
        </div>
    );
}

export default PanelContainer;