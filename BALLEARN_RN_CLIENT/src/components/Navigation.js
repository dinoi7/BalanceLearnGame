import React, { Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {setNavigationHeight} from '../actions/navigation'
import Logo from './Logo'



class Navigation extends Component  {

    constructor(props) {
        super(props);
        this.state= {scrolling:false};
    }
    componentDidMount() {
        if(this.divElement) {
            const height = this.divElement.clientHeight;
            //this.setState({ height });
            this.props.setNavigationHeight(height);
        }       
      }

    renderOnlyMobileExample() {
        return (
        <React.Fragment>
         <div className="ui mobile only red label">Mobile</div>
        </React.Fragment>
        );
    }
    renderLogo() {      
        
        return null; 
        /*return (
            <div content="hidden" className="header item">
                <Logo/>                                           
            </div>
        );*/
    }
    render1() {          
        return (
            <div className="ui borderless inverted main stackable menu"
                style={{zIndex:999}}
                ref={ (divElement) => this.divElement = divElement}
                >
                <div className="ui text container">
                    {this.renderLogo()}           
                    <Link className="item" to="/">Screen1</Link>        
                    <Link className="item" to="/TestScreen">TestScreen</Link>
                    <Link className="item" to="/calibration">Calibration</Link>
                    <Link className="item" to="/screen1">Screen1</Link>
                    
                </div>
            </div>
        );
    }
    render() {
        return null;
    }
}

const mapStateToProps = (state) => {  
    return {   

    }
  }
  export default connect(mapStateToProps, 
        {  setNavigationHeight })(Navigation);



