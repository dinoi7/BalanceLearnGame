import React from 'react'
import { connect } from 'react-redux'

import   Screen from './Screen'


class Screen1 extends Screen  {

    constructor(props) {
        super(props);     
        this.state = {
            width:  100,
            height: 100,   
        }      
    }
    renderLefttop() {
        const {width, height} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:'0px',
            left:'0px',
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 

        return (<div className="lefttop" style={style} >
            <p>lefttop </p>
        </div>);
    }
    renderLefbottom() {
        const {width, height} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:`${heightHalf}px`,
            left:'0px',
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 

        return (<div className="leftbottom" style={style}>
            <p> leftbottom</p>
        </div>);
    }
    renderRighttop() {
        const {width, height} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:'0px',
            left:`${widthHalf}px`,
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 

        return (<div className="righttop" style={style}>
        <p> righttop</p>
    </div>);
    }
    renderRightbottom() {
        const {width, height} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;

        const style = {
            top:`${heightHalf}px`,
            left:`${widthHalf}px`,
            width: `${widthHalf}px`,
            height: `${heightHalf}px`,
        }; 

        return (<div className="rightbottom" style={style}>
                <p> rightbottom</p>
            </div>);
    }


    renderBigCircle() {
        const {width, height} = this.state;
        const widthHalf = width/2;
        const heightHalf = height/2;
      
        const R = 0.4*Math.min(width, height);
        const R2 = R*2;

        const style = {
            top:`${heightHalf-R}px`,
            left:`${widthHalf-R}px`,
            width: `${R2}px`,
            height: `${R2}px`,            
        }; 

        return (<div className="bigCenterCircle" style={style}>
               <div className="bigCenterCircleText">
                   <p> center</p></div> 
            </div>);
    }


    render() { 
        const {width, height} = this.state;
        const {position, connected} = this.props;

        //console.log('redux_postion', position)
        //console.log('redux_connected', connected)
        return (
            <React.Fragment>
               {this.renderLefttop()}
               {this.renderLefbottom()}
               {this.renderRighttop()}
               {this.renderRightbottom()}
               {this.renderBigCircle()}
            <div>
            <p> width = {width} height =  { height} </p>             
            </div>

            </React.Fragment>
           );   
    }
  }



  const mapStateToProps = (state) => {  
    return {
      connected: state.connected,
      //refWebSocket: state.refWebSocket,
      position: state.position,

    }
  }
  export default connect(mapStateToProps, 
        {   })(Screen1);
