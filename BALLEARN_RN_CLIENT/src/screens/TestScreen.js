import React from 'react';
import Websocket from 'react-websocket';
import {isRequestTypeMessage, 
  isRetrieveGameIDMessage, 
  retrieveGameID,
  createGameIdRequest,
  createLoginMessage,
  isSensorDataMessage, 
   
} from '../helpers/wsMessages'
import Screen from './Screen'
import { connect } from 'react-redux'

var QRCode = require('qrcode.react');



  class TestScreen extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        count: 90,
        connection: false,
        gameId : null,
        openConnection : true,
        webSocketIp: '192.168.33.101', //'ws://192.168.1.220:8080/',
        webSocketPort: '8080', 
      };

      this.onOpen = this.onOpen.bind(this);
      this.onClose = this.onClose.bind(this);
      this.handleData = this.handleData.bind(this);
    }

    onOpen() {
        console.log('connection opend')
        this.setState({connection:true})
    }
    onClose() {
      console.log('connection closed')
      this.setState({connection:false})
    }


    
    handleData(jsonpayload) {
      
      const payload = JSON.parse(jsonpayload);
      //console.log('handleData', data)
      //console.log('handleData, jsondata', jsondata)
      this.setState({payload});
      this.setState({jsonpayload});


      if(isRequestTypeMessage(payload)) {
        //this.sendMessage(createTypeAnswer());
        this.sendMessage(createGameIdRequest());
      }

      // parse the gameId 
      if(/*!this.state.gameId &&*/ isRetrieveGameIDMessage(payload))  {
        const gameId =  retrieveGameID(payload);
        console.log('gameId recevied: ', gameId)
        this.setState({gameId});
        this.sendMessage(createLoginMessage(gameId))
      }       

      if(isSensorDataMessage(payload)) {
        const position = payload.data;
        console.log('position recevied: ', position);
        this.setState({position});
      }      
      
    }

    sendMessage(message){
        if(this.state.connection) {
          console.log('sending the message= ', message);
            this.refWebSocket.sendMessage(message);
        }
    }

    renderButtonCalibration() {        
        const calibrationMessage = "calibrationMessage";
        if(this.state.connection)
        return (
            <button style={{fontSize:'40px'}}
                onClick={() => this.sendMessage(calibrationMessage)} >
                Start calibration
            </button>
        )
    }

    renderButtonOpenConnection() {  
        const openConnection  = true;    
       
        return (
            <button style={{fontSize:'40px', 
                backgroundColor:'blue', 
                padding:'10px'}}
                onClick={() => this.setState({openConnection})} 
            >Connect</button>
        )
    }
    renderWebSocketClient() {

        const url = `ws://${this.state.webSocketIp}:${this.state.webSocketPort}/ `;
       
            return ( <Websocket 
                debug={true} 
                reconnect={true}
                url={url}
                onMessage={this.handleData.bind(this)}
                onOpen={this.onOpen}
                ref={Websocket => {
                    this.refWebSocket = Websocket;
                }}
                />);
            
    }

    renderQrCode() {
      const message = {ID: this.state.webSocketIp, 
                      PORT: this.state.webSocketPort,
                      GAME_ID: this.state.gameId}
      return (
      <QRCode value={JSON.stringify(message)} />
      );
      // <QRCode value="http://facebook.github.io/react/" />
    }
    
  
 

    render() {

      const {position} = this.state;      
      let right = 0;
      let top = 0;
      if(position && position.rx && position.ry) {
        const scala = 200;
        right = `${this.state.width*position.rx/scala}px`;
        top = `${this.state.height* position.ry/scala}px`;
      }
       
     
      const currentPoint = { right,top};
      const backgroundColorConnection = 
      (this.state.openConnection)? ( (this.state.connection)?'green':'red'):'orange';
        return (
          <React.Fragment>
            <div style={{width:'100%', height:'30px', backgroundColor:backgroundColorConnection}} />    
                  
           {position && position.rx && position.ry && <div className="currentPoint" style={{...currentPoint}}/>}
           {this.renderWebSocketClient()}
          </React.Fragment>
        );
    }

    render1() {
      const backgroundColorConnection = 
      (this.state.openConnection)? ( (this.state.connection)?'green':'red'):'orange';
        return (
          <div>
          <div style={{width:'100%', height:'30px', backgroundColor:backgroundColorConnection}} />    
                  
          {this.renderButtonCalibration()}
          {this.renderWebSocketClient()}

          <div style={{fontSize:'30px', padding:'10px'}}>
          Sever data: <p style={{fontSize:'40px'}}>{this.state.jsondata}</p>
          </div>
          {this.renderQrCode()}     
          
          </div>
        );
    }
  }

  const mapStateToProps = (state) => {  
    return {
      connected: state.connected,
      refWebSocket: state.refWebSocket
    }
  }
  export default connect(mapStateToProps, 
        {   })(TestScreen);