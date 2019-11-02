/*****************************************************************/
// Websocket Gyro/Accelerometer send data Port 8025 v.0.1
/*****************************************************************/
// Send OscP5 via oscp.send
// Runs on:
//          Android ?
//          Java    -
// Receiver Coding: 
/*****************************************************************/
// ANDROID PERMISSIONS:
//   android.permission.INTERNET
//   android.permission.ACCESS_WIFI_STATE
/*****************************************************************/
// Min Android SDK Version 17 => Android 4.2
/*****************************************************************/

import websockets.*;
import ketai.net.*;
import ketai.sensors.*;

KetaiSensor sensor;
WebsocketClient wsc;

float myAccelerometerX, myAccelerometerY, myAccelerometerZ;
int x, y, p; 
int connected;
String Messg;
String myIPAddress; 
String remoteAddress = "172.16.247.1";
// PC:                 "192.168.30.207";
// SmartPhone Sony:    "192.168.30.238";
// SmartPhone Samsung: "192.168.30.196";

void setup() {
  println("startup");
  orientation(PORTRAIT);
  textAlign(CENTER, CENTER);
  textSize(35);
  connected = 0;
  
  myIPAddress = KetaiNet.getIP();  
  print("My IP: ");
  println(myIPAddress);
  
  try{
//  wsc= new WebsocketClient(this, "ws://192.168.33.105:8080");
//  connected = 1;
  }
  catch (Exception e){
    print("error");
    connected = 0;
  }
  
  sensor = new KetaiSensor(this);
  sensor.start();
}

void draw() {
  background(78, 93, 75);

  text("Websocket_Gyro_Receive3.pde v.0.1\n" + "Remote Mouse Info: \n" +                          // 3
  "mouseX: " + x + "\n" +
    "mouseY: " + y + "\n" +
    "mousePressed: " + p + "\n\n" +
    "Local Accelerometer Data: \n" + 
    "x: " + nfp(myAccelerometerX, 1, 3) + "\n" +
    "y: " + nfp(myAccelerometerY, 1, 3) + "\n" +
    "z: " + nfp(myAccelerometerZ, 1, 3) + "\n\n" +
    "Local IP Address: \n" + myIPAddress + "\n\n" +
    "Remote IP Address: \n" + remoteAddress, width/2, height/2);

// format Message to send
if (connected == 1){
  Messg = nfp(myAccelerometerX, 1, 3) + ";" +nfp (myAccelerometerY, 1, 3) + ";" + nfp(myAccelerometerZ, 1, 3) ;
  wsc.sendMessage( Messg );
}

}

// Accelerometer Event
void onAccelerometerEvent(float x, float y, float z)
{
  myAccelerometerX = x;
  myAccelerometerY = y;
  myAccelerometerZ = z;
}

void webSocketEvent(String msg) {
  println("event: "+msg);
}
