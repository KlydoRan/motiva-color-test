import React from 'react';


export class LetterCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    getRandomLetter = () => {
        return String.fromCharCode(Math.floor(Math.random()*26)+65);
    };

    getOpacity = () => {
        let cellBrightness = this.props.brightness;
        let targetBrightness = this.props.targetBrightness;
        /*console.log(cellBrightness);
        console.log(targetBrightness);
        console.log((targetBrightness-cellBrightness)/(this.getBrightness()-cellBrightness));*/
        let opacity = (targetBrightness-cellBrightness)/(this.getBrightness()-cellBrightness);
        if (opacity < 0) return 0;
        if (opacity > 1) return 1;
        if (!opacity) return 0;
        return opacity;
    };

    getBrightness = () => {
        let cellBrightness = this.props.brightness;
        let targetBrightness = this.props.targetBrightness;
        if (cellBrightness < targetBrightness) return 255;
        if (this.props.darkColor.rgb) return 0.3*this.props.darkColor.rgb.r+0.587*this.props.darkColor.rgb.g+0.113*this.props.darkColor.rgb.b;
        return 0;
    };

    getColor = () => {
        let cellBrightness = this.props.brightness;
        let targetBrightness = this.props.targetBrightness;

        if (cellBrightness < targetBrightness) return '#ffffff';
        return this.props.darkColor.hex;

    };

    render() {

        return (
            <div style={{width: '20px', height:'26px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{opacity: this.getOpacity(), color: this.getColor()}}>{this.getRandomLetter()}</div>
            </div>

    )

    }

}


