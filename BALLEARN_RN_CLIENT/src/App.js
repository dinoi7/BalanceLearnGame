import React, {Component} from 'react';
import { Router, Route} from 'react-router-dom'
import Websocket from 'react-websocket';
import { connect } from 'react-redux'

import './App.css';
import TestScreen from './screens/TestScreen';
import history from './helpers/history'
import Navigation from './components/Navigation'
import Home from './screens/Home';
import CalibrationScreen from './screens/Calibration'
import Screen1 from './screens/Screen1'
import Screen from './screens/Screen'
import {  WEB_SOCKET_PORT, WEB_SOCKET_IP } from './helpers/const';
import {setConnectionState, 
        setWebSocketRef, 
        sendMessage, 
        setPosition } from './actions/connection'
import {isRequestTypeMessage, 
  isRetrieveGameIDMessage, 
  retrieveGameID,
  createGameIdRequest,
  createLoginMessage,
  isSensorDataMessage,    
} from './helpers/wsMessages'

class App extends Screen  {

  constructor(props) {
      super(props);
     
      this.onOpen = this.onOpen.bind(this);
      this.onClose = this.onClose.bind(this);
      this.handleData = this.handleData.bind(this);
      this.onClickTestButton = this.onClickTestButton.bind(this);
  }

  onOpen() {
    const {connected} = this.props;
    //console.log('connection opend')
    //this.setState({connection:true})
    if(!connected)
      this.props.setConnectionState(true);
  }
  onClose() {
    const {connected} = this.props;
    console.log('connection closed')
    //this.setState({connection:false})
    if(connected)
      this.props.setConnectionState(false);
  }

  handleData(jsonpayload) {      
    const payload = JSON.parse(jsonpayload);
    //console.log('handleData', data)
    //console.log('handleData, jsondata', jsondata)
    this.setState({payload});
    this.setState({jsonpayload});


    if(isRequestTypeMessage(payload)) {
      //this.sendMessage(createTypeAnswer());
      this.props.sendMessage(createGameIdRequest());
    }

    // parse the gameId 
    if(/*!this.state.gameId &&*/ isRetrieveGameIDMessage(payload))  {
      const gameId =  retrieveGameID(payload);
      //console.log('gameId recevied: ', gameId)
      this.setState({gameId});
      this.props.sendMessage(createLoginMessage(gameId))
    }       

    if(isSensorDataMessage(payload)) {
      const position = payload.data;
      console.log('position recevied: ', position);
      this.setState({position});
      this.props.setPosition(position);
    }      
    
  }

  renderWebSocketClient() {

    const url = `ws://${WEB_SOCKET_IP}:${WEB_SOCKET_PORT}/ `;
    //console.log('url', url)
    return ( <Websocket 
            debug={true} 
            reconnect={true}
            url={url}
            onMessage={this.handleData.bind(this)}
            onOpen={this.onOpen}
            onClose={this.onClose}
            ref={Websocket => {
                //this.refWebSocket = Websocket;
                if(Websocket)
                  this.props.setWebSocketRef(Websocket);
            }}
            />);        
  }

  onClickTestButton ()  {
    console.log('onClickTestButton')
    this.onOpen();
  }

  renderTestButton() {
    const withTestButton = false;

    if(withTestButton) { 
      return (  <button style={{fontSize:'40px'}}
      onClick={this.onClickTestButton()} >
          Test button
      </button>
      );
    } else {
      return null;
    }

      
  }
  render() {
    const {connected} = this.props;
    
    //const connectedState = connected?'connected':'not connected';
    //console.log('connectedState= ', connectedState)
    return (
      <Router history={history}>    
        <Navigation data-test="navigation"/>  
        {this.renderWebSocketClient()}
        {this.renderTestButton()}        
        <div className="App">
          <Route path="/" exact component={Screen1} />  
          <Route path="/testscreen" exact component={TestScreen} />    
          <Route path="/calibration" exact component={CalibrationScreen} />  
          <Route path="/screen1" exact component={Screen1} />   
        </div>
      </Router>  
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
      {  setConnectionState,
        setWebSocketRef,
        sendMessage, 
        setPosition })(App);
