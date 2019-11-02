/*****************************************************************/
// receive test data via websocket Port 8025
/*****************************************************************/
// Runs on:
//          Android ?
//          Java    OK
// Receiver Coding: websocket_client.pde
/*****************************************************************/
// ANDROID PERMISSIONS:
//   android.permission.INTERNET
//   android.permission.ACCESS_WIFI_STATE
/*****************************************************************/
import websockets.*;
import ketai.net.*;
// test
WebsocketServer ws;
int now;
float x,y;
String myIPAddress; 

void setup(){
  size(200,200);
  myIPAddress = KetaiNet.getIP(); 
  println("Server IP Address: " + myIPAddress);
  ws= new WebsocketServer(this,8025,"/john");
  now=millis();
  x=0;
  y=0;
}

void draw(){
  background(0);
  ellipse(x,y,10,10);
  if(millis()>now+2000){
    ws.sendMessage("Server message: " + now);
    now=millis();
  }
}

void webSocketServerEvent(String msg){
 println(msg);
 x=random(width);
 y=random(height);
}
