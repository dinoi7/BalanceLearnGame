import  { Component} from 'react'
import { connect } from 'react-redux'


class Screen extends Component  {

    constructor(props) {
        super(props);     
        this.state = {
            width:  100,
            height: 100,   
        }      
    }

    updateDimensions() {       
        let update_width  = window.innerWidth;
        let update_height = window.innerHeight; //Math.round(update_width);
        const centerX = update_width/2;
        const centerY = update_height/2;
        this.setState({ width: update_width,
                        height: update_height, 
                        centerX, 
                        centerY });        
    }
    
    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

   
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }
  
    sendMessage(message){
        if(this.props.connected) {
          console.log('sending the message= ', message);
          this.props.refWebSocket.sendMessage(message);
        }
    }
    render() {
        return null;
    }
    
  }


export default (Screen);

