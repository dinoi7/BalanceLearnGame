import React from 'react'
import Screen from './Screen'
import logoJson from '../helpers/logo.json'
import {getRandomInt} from '../helpers/helpers'

class Calibration extends Screen  {

    constructor(props) {
        super(props);     
        const logo = this.initLogo(logoJson);
        const logoRows = logo.rows.length;
        const logoColumns = logo.rows[0].columns.length;
        this.state = {
            simulationActive: false,     
            WX : 100,
            HX: 100,
            WY: 100,
            HY: 100,
            logo,
            logoRows,
            logoColumns,
            logoAnimationActive: false,
            logoAnimationCount: 0,

        }   
        this.onClickSimulation = this.onClickSimulation.bind(this); 
        this.onClickLogoAnimationStart = this.onClickLogoAnimationStart.bind(this);

    }

    componentDidMount() {
        super.componentDidMount();
        setTimeout(
            () => {             
                this.onClickSimulation();
                this.onClickLogoAnimationStart();                   
          }, 500);

       
    }
    initLogo(logoJson) {
        var logo = JSON.parse(JSON.stringify(logoJson));
        logo.rows.forEach((row, i) => {
            row.columns.forEach((column, j)=>{
                column.current= column.init;
            })
        })

        //console.log('initlogo', logo);
        return logo;
    }

    simulate = ()=> {
        //console.log('simulate')
        const plus = 10;
        const time = 100;       

        if(this.state.simulationActive && 
            (this.state.WX<this.state.width ||
            this.state.HY<this.state.height) ) {
          setTimeout(
            () => {             
              if(this.state.simulationActive===true) {
                this.setState({
                    WX: this.state.WX+plus,
                    HY: this.state.HY+plus}, ()=>this.simulate() ) ;
                 
              }                     
          }, time);
        } else {
            //this.setState({simulationActive:false});
        }  
    }

    getLogoFilledSquers() {
        const {logo}  = this.state;
        //console.log('getLogoFilledSquers', logo);

        var count = 0;
        logo.rows.forEach((row, i) => {
            row.columns.forEach((column, j)=>{
                count+= (column.current===1)?1:0;
            })
        })
        return count;
    }

    
    logoAnimate = ()=> {
        //console.log('logoAnimate');       
        const time = 500;       
        this.setState({logoAnimationCount: this.state.logoAnimationCount+1})

        //console.log('getLogoFilledSquers', this.getLogoFilledSquers())
        if(this.state.logoAnimationActive===true && 
            this.getLogoFilledSquers()>0  
            //&& this.state.logoAnimationCount <5
            ) {
          setTimeout(
            () => {             
              if(this.state.logoAnimationActive===true) {                                
                this.modifyLogo() ;                
              }                     
          }, time);
        } else {
            //this.setState({logoAnimationActive:false});
        }    
    }

    modifyLogo() {
        const {logo}  = this.state;
        
        let found = false;
        for (let i = logo.rows.length-1; i>-1 && !found; i--) {
            for (let j = logo.rows[i].columns.length-1; j>-1 && !found; j--) {
                if (logo.rows[i].columns[j].current === 1) {
                    logo.rows[i].columns[j].current = 0;
                    this.setState({...logo}, ()=>this.logoAnimate());
                    //console.log('found:', i, j)
                    found = true;                   
                }
            }               
        }  
    }
    modifyLogo2() {
        const {logo}  = this.state;
        
        let found = false;
        for (let i = 0; i < logo.rows.length && !found; i++) {
            for (let j = 0; j< logo.rows[i].columns.length && !found; j++) {
                if (logo.rows[i].columns[j].current === 1) {
                    logo.rows[i].columns[j].current = 0;
                    this.setState({...logo});
                    console.log('found:', i, j)
                    found = true;                   
                }
            }               
        }  
    }

    modifyLogo1() {
        var f = false;
        const {logo, logoRows, logoColumns}  = this.state;
        while(!f) {
            const r = getRandomInt(logoRows-1);
            const c = getRandomInt(logoColumns-1);
            if(logo.rows[r].columns[c].current===1) {
                f = true;
                logo.rows[r].columns[c].current = 0;
                this.setState({...logo});
            }
            console.log('cccc')
        }
    }


    onClickSimulation() {
        //console.log('onClickSimulation')
        if(this.state.simulationActive===false)
            this.setState({ simulationActive: true, 
                WX : 100,
                HX: 100,
                WY: 100,
                HY: 100 }, ()=> this.simulate()) 
    }

    onClickLogoAnimationStart() {
        if(this.state.logoAnimationActive===false) {
            this.setState({ logoAnimationActive: true }, ()=> this.logoAnimate()) 
        }
    }

    renderLogo() {
        const {logo, logoRows, logoColumns}  = this.state;
        const W = 20;
        const H = 20;
       
      
        //console.log('rowsCount', logoRows)
        //console.log('columnsCount', logoColumns)
        return (
        <div className="squareLogoWrapper" style={{width:`${W*logoColumns}px`,
                        height: `${H*logoRows}px`}}>
        {logo.rows.map((row, i) => {
            //console.log('row', row)
            //return (<p>{i}</p>)
            
            return (                 
                row.columns.map((column, j)=>{
                    //return (<p>{i*j}</p>)
                    const styleBackround = column.current?"red":"white";
                    return (<div key={i*logoColumns + j} 
                        className="squareLogo" 
                        style={{ backgroundColor: styleBackround,
                        width:`${W}px`,
                        height: `${H}px`}}/>)
                })
            )
        })
        }</div>
        )
    }
    renderStartSimulationButton() {
        //console.log('renderStartSimulationButton');
        if(this.state.simulationActive===false)
            return (<button style={{fontSize:'40px'}}
                onClick={this.onClickSimulation()} >
                Start simulation
                </button>);
            
    }

    renderStartAnimationLogo() {
        return (<button style={{fontSize:'40px'}}
            onClick={this.onClickLogoAnimationStart()} >
            Start animation
            </button>);
    }

    renderRingingCircle() {
        return (<div className="ring-container">
            <div className="ringring"></div>
            <div className="circle"></div>
            </div>);
    }

    renderTestPositions() {
        const {centerX, centerY} = this.state;

        return (
            <React.Fragment>
             <div style={{ position: 'absolute', width:'20px', height: '20px', backgroundColor:'red', 
            left: `${ centerX-10}px`, top: `${ centerY-10}px`}}/>

            <div style={{ position: 'absolute', width:'20px', height: '20px', backgroundColor:'red', 
            left: `0px`, top: `0px`}}/>

            <div style={{ position: 'absolute', width:'20px', height: '20px', backgroundColor:'red', 
            left: `${ this.state.width-10}px`, top: `${ this.state.height-10}px`}}/>

            <div className="dot"></div>
           
            {this.renderLogo()}
           
            
            
            
            </React.Fragment>);
    }
    render() {
        const centerX = this.state.width/2;
        const centerY = this.state.height/2;

        //console.log('centerX', centerX)
        //console.log('centerY', centerY)
        //console.log('this.state.width', this.state.width)
        //console.log('this.state.height', this.state.height)

        const wx = `${this.state.WX}px`;
        const hx = `${this.state.HX}px`;
        const leftx = `${centerX-this.state.WX/2}px`;
        const topx = `${centerY-this.state.HX/2}px`;

        const wy = `${this.state.WY}px`;
        const hy = `${this.state.HY}px`;
        const lefty = `${centerX-this.state.WY/2}px`;
        const topy = `${centerY-this.state.HY/2}px`;


        //console.log('leftx', leftx)
        //console.log('topx', topx)

        const styleX = {width: wx, height: hx, left: leftx, top: topx};
        const styleY = {width: wy, height: hy, left: lefty, top: topy};
    
    return(
        <React.Fragment>
            
            <div className="calibrationXElem" style={{...styleX}}/>
            <div className="calibrationYElem" style={{...styleY}}/>
           
           {this.renderStartSimulationButton()}
            {this.renderTestPositions()}

        </React.Fragment>      
    );
  }
}


export default Calibration;
