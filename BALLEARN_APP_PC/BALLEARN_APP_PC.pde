import websockets.*;
import ketai.net.*;

JSONObject json;

WebsocketClient wsc;

float myAccelerometerX, myAccelerometerY, myAccelerometerZ;
int x, y, p;
int xpress, ypress;
int connected;
char mode;
int pressed = 0;
int ButtonStrX;
int ButtonSizX;
int ButtonStrY;
int ButtonSizY;
String Messg;
String myIPAddress; 
String serverreply;
String remoteAddress = "172.16.247.1";
// PC:                 "192.168.30.207";
// SmartPhone Sony:    "192.168.30.238";
// SmartPhone Samsung: "192.168.30.196";

// SETUP
void setup() {
  mode = 's'; // setup
  ButtonStrX = width/4;
  ButtonSizX = width/2;
  ButtonStrY = 20;
  ButtonSizY = 80;

  println("startup");
  orientation(PORTRAIT);
  size(1200, 1000);
  textAlign(CENTER, CENTER);
  textSize(25);
  connected = 0;
  
  myIPAddress = KetaiNet.getIP();  
  print("My IP: ");
  println(myIPAddress);
  
}

// DRAW
void draw() {
  background(78, 93, 75);

// Connect Button
if(mousePressed) {
  update(mouseX, mouseY);
}

  fill(0);
  rect(ButtonStrX, ButtonStrY, ButtonSizX,  ButtonSizY);
  fill(255);
  text("Connect", width/2, 60);
  
// Infos
  text("Websocket_Gyro_Receive3.pde v.0.1\n" + "Remote Mouse Info: \n" +                          // 3
  "mouseX: " + x + "\n" +
    "mouseY: " + y + "\n" +
    "mousePressed: " + p + "\n\n" +
    "Local Accelerometer Data: \n" + 
    "x: " + nfp(myAccelerometerX, 1, 3) + "\n" +
    "y: " + nfp(myAccelerometerY, 1, 3) + "\n" +
    "z: " + nfp(myAccelerometerZ, 1, 3) + "\n\n" +
    "xpress / ypress" + xpress + " " + ypress + "\n" +
    "pressed: " + pressed + " mode: " + mode + "\n\n" +
    "X Range >" + ButtonStrX + " - " + ButtonStrX + ButtonSizX + "\n" +
    "Local IP Address: \n" + myIPAddress + "\n" +
    "Remote IP Address: \n" + remoteAddress +
    "Server Connected: \n" + connected +
    "Server Reply: \n" + serverreply, width/2, height/2);

// format Message to send

if ( mode == 'd'){
//"{ \"event\": \"C_LOGIN\", \"data\": { \"type\" : \"SENSOR\", \"gameId\": 123971239 } }";  
//  Messg = nfp(myAccelerometerX, 1, 3) + ";" +nfp (myAccelerometerY, 1, 3) + ";" + nfp(myAccelerometerZ, 1, 3) ;
Messg = "{ \"event\": \"C_SENSOR_DATA\", \"data\": { \"x\" : \"SENSOR\", \"y\": 123971239 , \"z\": 123971239 } }";  
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

void WebsocketConnect(){
// Websocket connect
  try{
  wsc = new WebsocketClient(this, "ws://192.168.33.101:8080");
//  wsc = new WebsocketClient(this, "ws://192.168.33.105:8080");
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

// Webseocket event
void webSocketEvent(String msg) {
  
  println(msg);
  JSONObject json = JSONObject.parse(msg);
  println(json.size());
  println(json.getString("event"));
  String event = json.getString("event");
  println(event);
  
  switch(event){
  case "S_REQUEST_TYPE":
    mode = 'r'; // request type
//    JSONObject json2 = getJSONObject("data");
//    String test = json2.getString("send");
//    print("test:" + test);
    String data = "{ \"event\": \"C_LOGIN\", \"data\": { \"type\" : \"SENSOR\", \"gameId\": 123971239 } }";
    print("yes");
  case "S_SEND_DATA":
       mode = 'd'; // send sensor data
  case "S_ERR_NO_DISPLAYS":
  
  case "S_CALLIB":
 
  }
  
  if ( event.equals("S_REQUEST_TYPE") ){
    mode = 'r'; // request type
    String data = "{ \"event\": \"C_LOGIN\", \"data\": { \"type\" : \"SENSOR\", \"gameId\": 123971239 } }";
    print("yes");
//    Messg = nfp(myAccelerometerX, 1, 3) + ";" +nfp (myAccelerometerY, 1, 3) + ";" + nfp(myAccelerometerZ, 1, 3) ;
     wsc.sendMessage( data );
    }

  if ( msg == "{\"event\":\"S_SEND_DATA\",\"data\":{\"send\":true,\"filter\":true}" ){
      mode = 'd'; // send sensor data
      
  }

  serverreply = msg;
//  println(msg);

//  {"event":"S_REQUEST_TYPE"}
//  "REQUEST_TYPE" {"event"

}
