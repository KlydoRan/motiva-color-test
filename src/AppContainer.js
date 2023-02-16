import React from 'react';
import './App.css';
import './textLayer';
import {TextLayer} from "./textLayer";
import Resizer from "react-image-file-resizer";
import {ChromePicker} from "react-color";

export class AppContainer extends React.Component {

    constructor(props) {
        super(props);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.state = {
            selectedItem: 0,
            backgroundImage: null,
            fontDarkColor: {hex: '#000000', rgb: {r: 0, g: 0, b: 0}},
            fontLightColor: {hex: '#ffffff', rgb: {r: 255, g: 255, b: 255}},
            showDarkColorPicker: false,
            showLightColorPicker: false,
            targetBrightness: 127,
        };
    }

    componentDidMount() {
        this.setState({fontDarkColor: {hex: '#000000', rgb: {r: 0, g: 0, b: 0}}});
    }

    processImage = (base64) => {

        let brightnessMatrix = new Array(24);
        for (var h = 0; h < brightnessMatrix.length; h++) {
            brightnessMatrix[h] = new Array(24);
        }

        var image = new Image();
        image.src = base64;
        image.onload = () => {

            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, 556, 696);
            let cellsContrast = [];
            var imageData = context.getImageData(38, 34, canvas.width-76, canvas.height-72);
            for (let i=0; i < 480; i=i+20) {
                for (let j=0; j < 624; j=j+26) {
                // analyzing a cell (getting average grayscale value of cell)
                    var pixels = [];
                    for (let m=0; m<20; m++) {
                        for (let n=0; n<26; n++) {
                            pixels.push(this.getPx(imageData,i+m,j+n));

                        }
                    }
                    let cellBrightnessAverage = pixels.reduce((partialSum, pixel) => partialSum + this.rgb2grayscale(pixel.r,pixel.g,pixel.b), 0)/pixels.length;
                    //console.log('x: '+i,'y: '+j, 'avarageBrightness: '+cellBrightnessAverage);
                    //let cellBrightnessAverage = this.median(pixels.map(pixel => this.rgb2grayscale(pixel.r,pixel.g,pixel.b)));


                    brightnessMatrix[Math.floor(i/20)][Math.floor(j/26)] = cellBrightnessAverage;
                    cellsContrast.push(this.contrastCalc(this.state.targetBrightness,cellBrightnessAverage));
                }
            }
            this.setState({brightnessMatrix: brightnessMatrix, cellsContrast: cellsContrast});
        }
    };

     median = (arr) => {
        if (arr.length === 0) {
            return; // 0.
        }
        arr.sort((a, b) => a - b); // 1.
        const midpoint = Math.floor(arr.length / 2); // 2.
        return arr.length % 2 === 1 ?
            arr[midpoint] : // 3.1. If odd length, just take midpoint
            (arr[midpoint - 1] + arr[midpoint]) / 2; // 3.2. If even length, take median of midpoints
    };

     getPx = (imageData, x, y) => {

        var data32 = new Uint32Array(imageData.data.buffer),
            val32 = data32[y * imageData.width + x],
            str32,
            a = 0,
            b = 0,
            g = 0,
            r = 0;

        if (val32 > 0) {
            str32 = val32.toString(16);
            a = parseInt(str32.substr(0, 2), 16);
            b = parseInt(str32.substr(2, 2), 16);
            g = parseInt(str32.substr(4, 2), 16);
            r = parseInt(str32.substr(6, 2), 16);
        }

        return {
            r: r,
            g: g,
            b: b,
            a: a,
        };

    };

    rgb2grayscale = (r,g,b) => { return 0.3*r + 0.587*g +0.113*b};

    fileChangedHandler(event) {
        var fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        if (fileInput) {
            try {
                Resizer.imageFileResizer(
                    event.target.files[0],
                    556,
                    696,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        this.setState({ backgroundImage: uri });
                        this.processImage(uri);
                    },
                    "base64",
                    556,
                    696
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

   handleChangeFontDarkColor = (color) => {

        this.setState({ fontDarkColor: color });

    };

    handleChangeFontLightColor = (color) => {

        this.setState({ fontLightColor: color });

    };

    onTargetBrightnessChange = (e) => {

        let targetBrightness = e.target.value;
        let cellsContrast =[];
        let cells = this.state.brightnessMatrix;

        if (cells) {
            cells.forEach(column => {
                column.forEach(cell => {
                    cellsContrast.push(this.contrastCalc(targetBrightness,cell))
                })
            });
        }


        this.setState({cellsContrast: cellsContrast, targetBrightness: targetBrightness});
    };

    contrastCalc = (fontBrightness,backgroundBrightness) => {
        if (fontBrightness > backgroundBrightness) return ((fontBrightness/255+0.05)/(backgroundBrightness/255+0.05));
        return ((backgroundBrightness/255+0.05)/(fontBrightness/255+0.05));
    };

    getAverageContrast = () => {
        let cellsContrast = this.state.cellsContrast;

        return cellsContrast && Math.round(cellsContrast.reduce((partialSum, a) => partialSum + a, 0)/cellsContrast.length * 1000) / 1000 ;
    };

    render() {

        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', flexDirection: 'column'}} className="App">
                <div style={{marginBottom: '10px'}}>
                    <input type={"file"} id={'imageUpload'} name={'imageUpload'} onChange={this.fileChangedHandler} />
                </div>
                <div style={{width: '556px', height: '696px', position:'relative'}}>
                    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
                        <img alt={""} style={{width: '556px', height: '696px'}}  src={this.state.backgroundImage}/>
                    </div>
                    <div style={{width: '100%', height: '100%', position: 'absolute'}}>
                        <div style={{width: '100%', height: '100%', fontFamily: 'Motiva'}}>
                            <TextLayer brightnessMatrix={this.state.brightnessMatrix} targetBrightness={this.state.targetBrightness} fontLightColor={this.state.fontLightColor} fontDarkColor={this.state.fontDarkColor}/>
                        </div>
                    </div>

                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '20px'}}>
                    <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'center'}}>
                        <div style={{width: '20px', height: '20px', border: '1px solid', backgroundColor: this.state.fontLightColor.hex}} onClick={()=>{this.setState({showLightColorPicker: !this.state.showLightColorPicker, showDarkColorPicker: false})}}>
                        </div>
                        <div style={{position: 'fixed', bottom: '10px', right: '10px'}}>
                            {this.state.showLightColorPicker ? <ChromePicker width={'200px'} height={'200px'} disableAlpha={true} color={this.state.fontLightColor} onChangeComplete={this.handleChangeFontLightColor}/> : null}
                        </div>
                        <div>
                            <input style={{width: '500px'}}
                                   type='range'
                                   onChange={this.onTargetBrightnessChange}
                                   min={0}
                                   max={255}
                                   step={1}
                                   value={this.state.targetBrightness}
                                   className='custom-slider'>
                            </input>
                        </div>

                        <div style={{width: '20px', height: '20px', border: '1px solid', backgroundColor: this.state.fontDarkColor.hex}} onClick={()=>{this.setState({showDarkColorPicker: !this.state.showDarkColorPicker, showLightColorPicker: false})}}>
                        </div>
                        <div style={{position: 'fixed', bottom: '10px', right: '10px'}}>
                            {this.state.showDarkColorPicker ? <ChromePicker width={'200px'} height={'200px'} disableAlpha={true} color={this.state.fontDarkColor} onChangeComplete={this.handleChangeFontDarkColor}/> : null}
                        </div>

                    </div>
                    <div>
                        {this.state.targetBrightness} <b>Kr</b>
                    </div>
                    <div>
                        {this.getAverageContrast() ?  'Average Contrast: ' + this.getAverageContrast() : '' }
                    </div>
                </div>
            </div>
    )

    }

}


/* getOpacity = () => {

     let opacity = (0.3*(this.state.backgroundColor1.r-this.state.backgroundColor2.r+this.state.textColor.a*(this.state.textColor.r-this.state.backgroundColor1.r))+
                    0.587*(this.state.backgroundColor1.g-this.state.backgroundColor2.g+this.state.textColor.a*(this.state.textColor.g-this.state.backgroundColor1.g))+
                    0.113*(this.state.backgroundColor1.b-this.state.backgroundColor2.b+this.state.textColor.a*(this.state.textColor.b-this.state.backgroundColor1.b))
     )/(0.3*(this.state.textColor.r-this.state.backgroundColor2.r)+0.587*(this.state.textColor.g-this.state.backgroundColor2.g)+0.113*(this.state.textColor.b-this.state.backgroundColor2.b))
     if (opacity >= 0 && opacity <= 1) {
         return Math.round((opacity + Number.EPSILON) * 100) / 100

     }
     return 'Errorrrrrrr';
 };*/

/* getColor = () => {
     switch (this.state.selectedItem) {
         case 0:
             return this.state.backgroundColor1;
         case 1:
             return this.state.backgroundColor2;
         case 2 :
             return this.state.textColor;
         default: console.log('error1')
     }
 };
*/
/*handleChangeComplete = (color) => {
    switch (this.state.selectedItem) {
        case 0:
            this.setState({ backgroundColor1: color.rgb });
            break;
        case 1:
            this.setState({ backgroundColor2: color.rgb });
            break;
        case 2:
            this.setState({ textColor: color.rgb });
            break;
        default:
            console.log('error2')
    }
};

setSelected = (itemNum) => { this.setState({selectedItem: itemNum})};*/

/*    onImageUpload = (e) => {
        const file = e.target.files[0];
        let reader = new FileReader();
        //console.log(reader);

        reader.addEventListener('load', () => {
            this.setState({backgroundImage: reader.result});
            this.processImage(reader.result);
        });

        if (file) {
            reader.readAsDataURL(file);
        }
    };*/

/* <div onClick={(event) => this.setSelected(0)} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',  width: '100%', height: '50%',
                                backgroundColor: 'rgb('+this.state.backgroundColor1.r+','+this.state.backgroundColor1.g+','+this.state.backgroundColor1.b+')'}}>
               <span className={'text'}  onClick={(event) => {event.stopPropagation(); this.setSelected(2)}} style={{fontSize: '40px', color: 'rgba('+this.state.textColor.r+','+this.state.textColor.g+','+this.state.textColor.b+','+this.state.textColor.a+')'}}> Here text opacity is {this.state.textColor.a}</span>
                    <div style={{position: 'fixed', top: '10px', left: '10px'}}>
                        <ChromePicker width={'200px'} height={'200px'} disableAlpha={true} color={this.state.backgroundColor1} onChangeComplete={this.handleChangeBackground1Complete}/>
                    </div>

                </div>

                <div onClick={(event) => this.setSelected(1)} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',width: '100%', height: '50%', backgroundColor: 'rgb('+this.state.backgroundColor2.r+','+this.state.backgroundColor2.g+','+this.state.backgroundColor2.b+')'}}>
                    <span style={{fontSize: '40px', color: 'rgba('+this.state.textColor.r+','+this.state.textColor.g+','+this.state.textColor.b+','+this.getOpacity()+')'}}>Here text the opacity is {this.getOpacity()}</span>
                </div>
                <div onClick={(event => {event.stopPropagation()})} style={{position: 'fixed', top: '10px', left: '10px'}}>
                    <ChromePicker width={'200px'} height={'100px'} color={this.getColor()} onChangeComplete={this.handleChangeComplete}/>
                </div>*/
