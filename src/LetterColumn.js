import React from 'react';
import {LetterCell} from "./letterCell";


export class LetterColumn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {

        return (
            <div style={{width: '20px', height:'624px', display: 'flex', flexDirection: 'column'}}>
                {this.props.brightnessColumn && this.props.brightnessColumn.map(((brightness,index) =>  {
                    return <LetterCell key={index} brightness={brightness} targetBrightness={this.props.targetBrightness} lightColor={this.props.fontLightColor} darkColor={this.props.fontDarkColor}/>}))
                }
            </div>

    )

    }

}

