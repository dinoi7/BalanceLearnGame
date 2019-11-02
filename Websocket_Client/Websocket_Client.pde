/*****************************************************************/
// send test data via websocket Port 8025
/*****************************************************************/
// Runs on:
//          Android OK
//          Java    OK
// Receiver Coding: websocket_server.pde
/*****************************************************************/
// ANDROID PERMISSIONS:
//   android.permission.INTERNET
//   android.permission.ACCESS_WIFI_STATE
/*****************************************************************/
import websockets.*;
import ketai.net.*;

WebsocketClient wsc;
int now;
boolean newEllipse;

void setup(){
  size(200,200);
  
  newEllipse=true;
  
// PC:                 "192.168.30.207";
// SmartPhone Sony:    "192.168.30.238";
// SmartPhone Samsung: "192.168.30.196";

  wsc= new WebsocketClient(this, "ws://192.168.30.238:8025/john");
  now=millis();
}

void draw(){
  if(newEllipse){
    ellipse(random(width),random(height),10,10);
    newEllipse=false;
  }
    
  if(millis()>now+2000){
    wsc.sendMessage("Client message: " + now);
    now=millis();
  }
}

void webSocketEvent(String msg){
 println(msg);
 newEllipse=true;
}
