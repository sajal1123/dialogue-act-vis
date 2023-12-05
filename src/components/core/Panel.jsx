import React, { Component } from 'react';
import PropTypes from 'prop-types';

Panel.propTypes = {
    title: PropTypes.string,
    bgColor: PropTypes.string,
    visulization: PropTypes.object,
    footer: PropTypes.object,
    flex: PropTypes.number,
    visHeight: PropTypes.string
};

function Panel(props) {
    return (
        <div style={{ 'flex': props.flex, 'marginLeft': '2%', 'marginRight': '2% ', 'width': '1500%', backgroundColor: props.bgColor }} className={'shadow'}>
            <div style={{ 'height': '90%', 'width': '100%', 'paddingRight': '2%', 'paddingTop': '2%', 'paddingBottom': '2%' }}>
                <div className={'title'} style={{ 'height': '2em', 'width': '100%', 'fontWeight': 'bold', 'fontFamily': 'Georgia' }}>
                    {props.title}
                </div>
                <div style={{ 'height': props.visHeight? props.visHeight:'calc(100% - 4em)', 'width': '99%', 'maxWidth': '80em' }}>
                    {props.visulization}
                </div>
                <div className={'footer'} style={{ 'height': '2em', 'width': '100%', 'fontFamily': 'Georgia' }}>
                    {props.footer}
                </div>
            </div>
        </div>
    );
}

export default Panel;