import React from 'react'
import   Screen from './Screen'


class Screen1 extends Screen  {

    constructor(props) {
        super(props);     
        this.state = {
            width:  100,
            height: 100,   
        }      
    }
  
    render() { 
        const {width, height} = this.state;
        return (<div>
            <p> width = {width} height =  { height} </p>             
            </div>);   
    }
  }



export default Screen1;
