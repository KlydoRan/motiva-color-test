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
            <div style={{display: 'flex',  width: '100%', height: '100%', flexDirection: 'row', flexWrap: 'wrap'}} className="App">
                {this.props.brightnessMatrix && this.props.brightnessMatrix.map(((brightness,index) =>  {
                    return <LetterColumn key={index} brightnessColumn={brightness} targetBrightness={this.props.targetBrightness}/>}))
                }
            </div>
    )

    }

}

