import React from 'react';
import './App.css';
import {ChromePicker} from "react-color";

export class AppContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            backgroundColor1: {r: 200, g: 100, b: 100},
            backgroundColor2: {r: 200, g: 50, b: 150},
            textColor: {r: 0, g: 100, b: 150, a: 0.7},
            selectedItem: 0,
        };
    }


    getOpacity = () => {

        let opacity = (0.3*(this.state.backgroundColor1.r-this.state.backgroundColor2.r+this.state.textColor.a*(this.state.textColor.r-this.state.backgroundColor1.r))+
                       0.587*(this.state.backgroundColor1.g-this.state.backgroundColor2.g+this.state.textColor.a*(this.state.textColor.g-this.state.backgroundColor1.g))+
                       0.113*(this.state.backgroundColor1.b-this.state.backgroundColor2.b+this.state.textColor.a*(this.state.textColor.b-this.state.backgroundColor1.b))
        )/(0.3*(this.state.textColor.r-this.state.backgroundColor2.r)+0.587*(this.state.textColor.g-this.state.backgroundColor2.g)+0.113*(this.state.textColor.b-this.state.backgroundColor2.b))
        if (opacity >= 0 && opacity <= 1) {
            return Math.round((opacity + Number.EPSILON) * 100) / 100

        }
        return 'Errorrrrrrr';
    };

    getColor = () => {
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

    handleChangeComplete = (color) => {
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

    setSelected = (itemNum) => { this.setState({selectedItem: itemNum})};

    render() {

        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', flexDirection: 'column'}} className="App">
                <div onClick={(event) => this.setSelected(0)} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',  width: '100%', height: '50%',
                                backgroundColor: 'rgb('+this.state.backgroundColor1.r+','+this.state.backgroundColor1.g+','+this.state.backgroundColor1.b+')'}}>
               <span className={'text'}  onClick={(event) => {event.stopPropagation(); this.setSelected(2)}} style={{fontSize: '40px', color: 'rgba('+this.state.textColor.r+','+this.state.textColor.g+','+this.state.textColor.b+','+this.state.textColor.a+')'}}> Here text opacity is {this.state.textColor.a}</span>
                    {/*<div style={{position: 'fixed', top: '10px', left: '10px'}}>
                        <ChromePicker width={'200px'} height={'200px'} disableAlpha={true} color={this.state.backgroundColor1} onChangeComplete={this.handleChangeBackground1Complete}/>
                    </div>*/}

                </div>

                <div onClick={(event) => this.setSelected(1)} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',width: '100%', height: '50%', backgroundColor: 'rgb('+this.state.backgroundColor2.r+','+this.state.backgroundColor2.g+','+this.state.backgroundColor2.b+')'}}>
                    <span style={{fontSize: '40px', color: 'rgba('+this.state.textColor.r+','+this.state.textColor.g+','+this.state.textColor.b+','+this.getOpacity()+')'}}>Here text the opacity is {this.getOpacity()}</span>
                </div>
                <div onClick={(event => {event.stopPropagation()})} style={{position: 'fixed', top: '10px', left: '10px'}}>
                    <ChromePicker width={'200px'} height={'100px'} color={this.getColor()} onChangeComplete={this.handleChangeComplete}/>
                </div>
            </div>
    )

    }

}

