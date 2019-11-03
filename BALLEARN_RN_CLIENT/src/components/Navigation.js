import React, { Component} from 'react'
import { Link } from 'react-router-dom'

import Logo from './Logo'

class Navigation extends Component  {

    constructor(props) {
        super(props);
        this.state= {scrolling:false};
    }
        
    renderOnlyMobileExample() {
        return (
        <React.Fragment>
         <div className="ui mobile only red label">Mobile</div>
        </React.Fragment>
        );
    }
    renderLogo() {       
        return (
            <div content="hidden" className="header item">
                <Logo/>                                           
            </div>
        );
    }
    render() {          
        return (
            <div className="ui borderless inverted main stackable menu">
                <div className="ui text container">
                    {this.renderLogo()}           
                    <Link className="item" to="/">Home</Link>        
                    <Link className="item" to="/TestScreen">TestScreen</Link>
                    <Link className="item" to="/calibration">Calibration</Link>
                    <Link className="item" to="/screen1">Screen1</Link>
                    
                </div>
            </div>
        );
    }
    render1() {
        return null;
    }
}


export default Navigation;
