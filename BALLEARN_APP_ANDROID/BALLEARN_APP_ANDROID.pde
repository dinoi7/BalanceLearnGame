/*****************************************************************/
// BALLEARN WEBSOCKED
/*****************************************************************/
// Runs on:
//          Android OK
//          Java    -
// Receiver Coding: node.js
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

JSONObject json;
KetaiSensor sensor;
WebsocketClient wsc;
KalmanFilter kfX;
KalmanFilter kfY;

float myAccelerometerX, myAccelerometerY, myAccelerometerZ;
float myAccelerometerXF, myAccelerometerYF, myAccelerometerZF;
float rotationX, rotationY, rotationZ;
int x, y, p;
int ix, iy, iz;
int xpress, ypress;
int connected;
char mode;
int pressed = 0;
int ButtonStrX;
int ButtonSizX;
int ButtonStrY;
int ButtonSizY;
int textsz = 30;
double timer;
boolean nodispl;
boolean callib;
String Messg;
String event;
String myIPAddress; 
String serverreply;
String remoteAddress = "172.16.247.1";
// PC:                 "192.168.30.207";
// SmartPhone Sony:    "192.168.30.238";
// SmartPhone Samsung: "192.168.30.196";

//font = createFont("VT323-Regular.ttf", 32);

// SETUP
void setup() {
  mode = 's'; // setup
  ButtonStrX = width/4;
  ButtonSizX = width/2;
  ButtonStrY = 20;
  ButtonSizY = 80;

  println("startup");
  orientation(PORTRAIT);
  textAlign(CENTER, CENTER);
  textSize(textsz);
  connected = 0;
  
  myIPAddress = KetaiNet.getIP();  
  print("My IP: ");
  println(myIPAddress);
  
  sensor = new KetaiSensor(this);
  sensor.start();
  
kfX = new KalmanFilter();
kfY = new KalmanFilter();
 timer = millis();
}

// DRAW
void draw() {
  background(0);

// Connect Button
if(mousePressed) {
  update(mouseX, mouseY);
}

 double dt = (double)(millis() - timer) / 1000; // Calculate delta time
 timer = millis();

// Actual Position
  fill(255);
circle(map(myAccelerometerX,-10,10,0,width), map(myAccelerometerY,-10,10,0,height/2), 50);
  fill(0, 212, 255);
circle(map(myAccelerometerXF,-10,10,0,width), map(myAccelerometerYF,-10,10,0,height/2)+(height/2), 50);

// draw Connect Button
  fill(0, 212, 255);
  rect(ButtonStrX, ButtonStrY, ButtonSizX,  ButtonSizY);
  fill(255);
  text("Connect", width/2, 60);

// Callib Info
  if (callib){
    text("Callib!", width/2, 90);
  }

if (nodispl){
    textSize(textsz*2);
      text("no display!", width/2, 90);
    textSize(textsz);
}

// Infos

  text("BALLEARN_APP_ANDROID.pde v.0.1\n" + "Remote Mouse Info: \n" +                          // 3
  "mouseX: " + x + "\n" +
    "mouseY: " + y + "\n" +
    "mousePressed: " + p + "\n\n" +
    "Local Accelerometer Data: \n" + 
    "x: " + nfp(myAccelerometerX, 1, 3) + "\n" +
    "y: " + nfp(myAccelerometerY, 1, 3) + "\n" +
    "z: " + nfp(myAccelerometerZ, 1, 3) + "\n" +
    "x (f) " + myAccelerometerXF + "\n" +
    "Local Gyroscope Data: \n" + 
    "x: " + nfp(rotationX, 1, 3) + "\n" +
    "y: " + nfp(rotationY, 1, 3) + "\n" +
    "z: " + nfp(rotationZ, 1, 3) + "\n" +
    "xpress / ypress: " + xpress + " / " + ypress + "\n" +
    "pressed: " + pressed + " mode: " + mode + "\n\n" +
    "X Range >" + ButtonStrX + " - " + ButtonStrX + ButtonSizX + "\n" +
    "Local IP Address: \n" + myIPAddress + "\n" +
    "Remote IP Address: \n" + remoteAddress + "\n" +
    "Server Connected: " + connected + "\n" +
    "Server Reply: \n" + serverreply, width/2, height/2);


// format Message to send
if ( mode == 'd'){
  ix = int(myAccelerometerX * 1000);
  iy = int(myAccelerometerY * 1000);
  iz = int(myAccelerometerZ * 1000);
// "{ \"event\": \"C_LOGIN\", \"data\": { \"type\" : \"SENSOR\", \"gameId\": 123971239 } }";  
//  Messg = nfp(myAccelerometerX, 1, 3) + ";" +nfp (myAccelerometerY, 1, 3) + ";" + nfp(myAccelerometerZ, 1, 3) ;
  Messg = "{ \"event\": \"C_SENSOR_DATA\", \"data\": { \"x\" : " +ix + ", \"y\": "+ iy + ", \"z\": " + iz + "} }";  
  wsc.sendMessage( Messg );
}

}

// Screen Interaction
void update(int x, int y)
{
  // Button pressed?
if(mousePressed) {
  if ( ( x >= ButtonStrX ) && ( x <= ButtonStrX + ButtonSizX ) && ( y >= ButtonStrY ) && ( y <= ButtonStrY + ButtonSizY )){
    if ( pressed == 0){
    pressed = 1;
    WebsocketConnect();
    }
  }
  xpress = x;
  ypress = y;
}
}

// Accelerometer Event
void onAccelerometerEvent(float x, float y, float z)
{
  myAccelerometerX = x;
  myAccelerometerY = y;
  myAccelerometerZ = z;
  
  myAccelerometerXF = kfX.predict_and_correct(myAccelerometerX);
  myAccelerometerYF = kfY.predict_and_correct(myAccelerometerY);
}

void WebsocketConnect(){
// Websocket connect
  try{
  wsc = new WebsocketClient(this, "ws://192.168.33.105:8080");
    //  wsc = new WebsocketClient(this, "ws://192.168.33.101:8080");
  connected = 1;
  }
  catch (IllegalArgumentException e) {
    print("error");
    connected = 0;
  }
  catch (IllegalStateException e) {
    print("error");
    connected = 0;
  } 
    catch (Exception e) {
    print("error");
    connected = 0;
  } 
}

// Gyroscope Event
void onGyroscopeEvent(float x, float y, float z)
{
  rotationX = x;
  rotationY = y;
  rotationZ = z;
}

// Webseocket event
void webSocketEvent(String msg) {
  
  JSONObject json = JSONObject.parse(msg);
  JSONObject json1 = new JSONObject();
  println(json.size());
  event = json.getString("event");

  switch(event){
  case "S_REQUEST_TYPE":
    mode = 'r'; // request type
    // Send Login to Server
     String data = "{ \"event\": \"C_LOGIN\", \"data\": { \"type\" : \"SENSOR\", \"gameId\": 123971239 } }";
     wsc.sendMessage( data );
     break;
  case "S_SEND_DATA":
       mode = 'd'; // send sensor data
       //json.get
       break;
  case "S_ERR_NO_DISPLAYS":
       nodispl = true;
       break;
  case "S_CALLIB":
       callib = true;
       break;
  }

  serverreply = msg;

/*
  if ( event == "S_REQUEST_TYPE" ){
    mode = 'r'; // request type
    String data = "{ \"event\": \"C_LOGIN\", \"data\": { \"type\" : \"SENSOR\", \"gameId\": 123971239 } }";

//    Messg = nfp(myAccelerometerX, 1, 3) + ";" +nfp (myAccelerometerY, 1, 3) + ";" + nfp(myAccelerometerZ, 1, 3) ;
     wsc.sendMessage( data );
    }
*/
/*
  if ( msg == "{\"event\":\"S_SEND_DATA\",\"data\":{\"send\":true,\"filter\":true}" ){
      mode = 'd'; // send sensor data
      
  }*/

//  {"event":"S_REQUEST_TYPE"}
//  "REQUEST_TYPE" {"event"

}

class KalmanFilter {
  float q = 1.0;     // process variance
  float r = 2.0;     // estimate of measurement variance, change to see effect

  float xhat = 0.0;  // a posteriori estimate of x
  float xhatminus;   // a priori estimate of x
  float p = 1.0;     // a posteriori error estimate
  float pminus;      // a priori error estimate
  float kG = 0.0;    // kalman gain
  
  KalmanFilter() {};
  KalmanFilter(float q, float r) {
    q(q); 
    r(r);
  }
  
  void q(float q) {
    this.q = q;
  }
  
  void r(float r) {
    this.r = r;
  }
  
  float xhat() {
    return this.xhat;
  }

  void predict() {
    xhatminus = xhat;
    pminus = p + q;
  }

  float correct(float x) {
    kG = pminus / (pminus + r);
    xhat = xhatminus + kG * (x - xhatminus);
    p = (1 - kG) * pminus;
    
    return xhat;
  }
  
  float predict_and_correct(float x) {
    predict();
    return correct(x);
  }
}
