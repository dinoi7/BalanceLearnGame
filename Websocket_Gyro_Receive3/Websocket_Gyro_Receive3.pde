/*****************************************************************/
// Websocket Recieve Server v.0.1
/*****************************************************************/
// Receive Gyro via Websocket Port 8025
// Runs on:
//          Android OK
//          Java    OK
// Sender Coding:  
/*****************************************************************/
// ANDROID PERMISSIONS:
//   android.permission.INTERNET
//   android.permission.ACCESS_WIFI_STATE
/*****************************************************************/
// Min Android SDK Version 17 => Android 4.2
/*****************************************************************/

import websockets.*;
import ketai.net.*;

WebsocketServer ws;

float accelerometerX, accelerometerY, accelerometerZ;
float maxX, maxY, maxZ;
float minX, minY, minZ;
int times;
int calibtime = 5000;
int calibrate = 0;
String myIPAddress; 
int newDataPoint1 = 0;
int newDataPoint2 = 0;
int newDataPoint3 = 0;
int newDataPointC1 = 0;
int newDataPointC2 = 0;
int newDataPointC3 = 0;

void setup() {
size(1000, 600); // only for Java
//    orientation(LANDSCAPE); 
    
//  frameRate(100); 
  
ws= new WebsocketServer(this,8025,"/john");
// device
//  remoteLocation = new NetAddress("192.168.30.238", 12000);  // 1 Customize!

  myIPAddress = KetaiNet.getIP();                         // 11
  print("My IP: ");
  println(myIPAddress);
  
  textAlign(CENTER, CENTER);
  textSize(20);
// initial calibrate
calibrate = 5000;

}

public void keyPressed() {
  print("key pressed:");
  println(keyCode);
  if (keyCode == 67) { 
//c for calibrate
calibrate = millis();
maxX = 0;
maxY = 0;
maxZ = 0;
minX = 0;
minY = 0;
minZ = 0;
  }
}

void draw() {
  background(78, 93, 75);
  times = millis();
  if (times < calibtime + calibrate){
    text("Calibration!", width/2, 30);

   if ( accelerometerX < minX){ minX = accelerometerX + 1; };
   if ( accelerometerX > maxX){ maxX = accelerometerX - 1; };
   if ( accelerometerY < minY){ minY = accelerometerY + 1; };
   if ( accelerometerY > maxY){ maxY = accelerometerY - 1; };
   if ( accelerometerZ < minY){ minY = accelerometerZ + 1; };
   if ( accelerometerZ > maxY){ maxY = accelerometerZ - 1; };
    
  }
  text("Websocket_Gyro_Receive3.pde v.0.1\n" + "Remote Accelerometer Info: " + "\n" +
    "x: "+ nfp(accelerometerX, 1, 3) + "\n" +
    "y: "+ nfp(accelerometerY, 1, 3) + "\n" +
//    "z: "+ nfp(accelerometerZ, 1, 3) + "\n\n" +
    "x N1: " + newDataPoint1 + "\n" +
    "y N1: " + newDataPoint2 + "\n" +
    "x NC1: " + newDataPointC1 + "min/max: " + int(minX*100) + "/" + int(maxX*100) + "\n" +
    "y NC1: " + newDataPointC2 + "min/max: " + int(minY*100) + "/" + int(maxY*100) + "\n" +
    "millis" + times + "\n" +
//    "x N: " + newDataPoint3 + "\n" +
    "\nLocal Info: \n" + 
    "mousePressed: " + mousePressed +
    "\n\nLocal IP Address: \n" + myIPAddress + "\n\n" 
//  + "Remote IP Address: \n" + remoteLocation + "\n"
, width/2, height/2);


  stroke(0,0,0);                                                   //set the stroke (line) color to black
  strokeWeight(2);                                                 //set the stroke width (weight) for the axes

// Acc
  newDataPoint1 = int(map(accelerometerX * 100,-1000,1000,width,0));                                          
  newDataPoint2 = int(map(accelerometerY * 100,-1000,1000,0,height));   
// Calibrated
  newDataPointC1 = int(map(accelerometerX * 100,minX*100,maxX*100,width,0));                                          
  newDataPointC2 = int(map(accelerometerY * 100,minY*100,maxY*100,0,height));   


//  newDataPoint3 = int(map(accelerometerZ * 100,-1000,1000,0,width));   

/*
  for(int i = 0; i < maxwidth-2; i++)                                 //each interation of draw, shift data points one pixel to the left to simulate a continuously moving graph
  { println(i);
    data1[i] = data1[i+1];
    data2[i] = data2[i+1];
    data3[i] = data3[i+1];
  }  */
/*
  data1[width-1] = int(accelerometerX);                                 //introduce the bufffered data into the rightmost data slot
  data2[width-1] = int(accelerometerY);
  data3[width-1] = int(accelerometerZ);
*/

  strokeWeight(2);                                                //set the stroke width (weight) for the actual graph

    stroke(255,255,255);
    rect(0,0, newDataPoint1,8);
    rect(0,0,8,newDataPoint2);
    stroke(255,100,100);
    rect(0,8, newDataPointC1,8);
    rect(8,0,8,newDataPointC2);
    
}

void webSocketServerEvent(String msg){
//  println("MSG Receive: " + msg);
float[] Acc = float(split(msg, ';'));

for ( int x = 0; x < 3; x++){
switch(x) {
  case 0: 
    accelerometerX = Acc[x];
    break;
  case 1: 
    accelerometerY = Acc[x];
    break;
  case 2:
  accelerometerZ = Acc[x];
    break;
}
}

}
