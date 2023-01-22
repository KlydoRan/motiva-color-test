import React from 'react';


export class LetterCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    getRandomLetter = () => {
        return String.fromCharCode(Math.floor(Math.random()*26)+65);
    }

    getOpacity = () => {
        let cellBrightness = this.props.brightness;
        let targetBrightness = this.props.targetBrightness;
        console.log(cellBrightness);
        console.log(targetBrightness);
        console.log((targetBrightness-cellBrightness)/(this.getBrightness()-cellBrightness));
        return (targetBrightness-cellBrightness)/(this.getBrightness()-cellBrightness);
    };

    getBrightness = () => {
        let cellBrightness = this.props.brightness;
        if (cellBrightness < 128) return 255;
        return 1;
    };

    getColor = () => {
        let cellBrightness = this.props.brightness;
        if (cellBrightness < 128) return '#ffffff';
        return '#000000';
    };

    render() {

        return (
            <div style={{width: '20px', height:'27px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{opacity: this.getOpacity(), color: this.getColor()}}>{this.getRandomLetter()}</div>
            </div>

    )

    }

}

