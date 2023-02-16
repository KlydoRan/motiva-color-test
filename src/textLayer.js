import React from 'react';

import {LetterColumn} from "./LetterColumn";


export class TextLayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {

        return (
            <div style={{display: 'flex',  flexDirection: 'row', flexWrap: 'wrap', paddingTop: '34px', paddingBottom: '38px', paddingLeft: '38px', paddingRight: '38px'}} className="TextContainer">
                {this.props.brightnessMatrix && this.props.brightnessMatrix.map(((brightness,index) =>  {
                    return <LetterColumn key={index} brightnessColumn={brightness} targetBrightness={this.props.targetBrightness} fontLightColor={this.props.fontLightColor} fontDarkColor={this.props.fontDarkColor}/>}))
                }
            </div>
    )

    }

}

