/*****************************************************************/
// Pong Game
/*****************************************************************/
// Receive Gyro via Websocket Port 8025
// Runs on:
//          Android OK
//          Java    OK
// Sender Coding: WiFiDataExchangeAndroid.pde
/*****************************************************************/
// ANDROID PERMISSIONS:
//   android.permission.INTERNET
//   android.permission.ACCESS_WIFI_STATE
/*****************************************************************/
import websockets.*;
import ketai.net.*;

WebsocketServer ws;

PVector oplayer, oenemy, oball;
float ballSpeedX, ballSpeedY, enemySpeed;

Calib Cal;

//Start Score
int playerScore = 0;
int enemyScore = 0;

//declaring oball size
float ballSize;

String myIPAddress; 
int calibtime = 5000;
int calibrate = 0;
int times;

// Accelerometer
float accelerometerX, accelerometerY, accelerometerZ;
float maxX, maxY, maxZ;
float minX, minY, minZ;

void setup()
{
  
// Clas Example => Constructor
Cal = new Calib(2,2);
// Class Example ==> Method
Cal.docalib(3,1);

    orientation(LANDSCAPE); 
    size(1000, 650);
//    size(displayWidth, displayHeight);
   
    oball = new PVector(width/2, height/2);
    oplayer = new PVector(width, height/2);
    oenemy = new PVector(0, height/2);
    
    ballSpeedX = width/100;
    ballSpeedY = width/100;
    enemySpeed = width/150;
    ballSize = width/20;
    
    rectMode(CENTER);

ws= new WebsocketServer(this,8025,"/john");
myIPAddress = KetaiNet.getIP();
println("My IP Address: " + myIPAddress);
calibrate = 5000;
  
  maxX = 3;
  maxY = 3;
  maxZ = 3;
  minX = -3;
  minY = -3;
  minZ = -3;

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

void draw()
{
    // background is important for clearing
    background(0); 
textSize(width/40);
    text("maxX: " + Cal.maxX + " minX: " + Cal.minX , width/2, height-30);
    text("maxY: " + Cal.maxY + " minY: " + Cal.minY , width/2, height-60);
textSize(width/20);
  times = millis();
  if (times < calibtime + calibrate){
    text(" Calibration!", width/2, 90);

   if ( accelerometerX < minX){ minX = accelerometerX + 1; };
   if ( accelerometerX > maxX){ maxX = accelerometerX - 1; };
   if ( accelerometerY < minY){ minY = accelerometerY + 1; };
   if ( accelerometerY > maxY){ maxY = accelerometerY - 1; };
   if ( accelerometerZ < minY){ minY = accelerometerZ + 1; };
   if ( accelerometerZ > maxY){ maxY = accelerometerZ - 1; };
    
  }
  
    // Main drawings
    centerLine();
    drawball();
    drawplayer();
    drawenemy();
    scoreText();

}

void drawball()
{
    pushMatrix();
      translate(oball.x, oball.y);
      fill(255);
      
      fill(255 * (oball.x/width), 255 * ((width - oball.x)/width), 0);
      
      noStroke();
      ellipse(0, 0, width/20, width/20);
    popMatrix();
    
    oball.x += ballSpeedX;
    oball.y += ballSpeedY;
    
    ballBoundary();
}

void ballBoundary()
{
   //top
   if (oball.y < 0) {
      oball.y = 0;
      ballSpeedY *= -1; 
   }
  
   //bottom
   if (oball.y > height) {
      oball.y = height;
      ballSpeedY *= -1; 
   }
  
  
//   //left
//   if (oball.x < 0) {
//      oball.x = 0;
//      ballSpeedX *= -1; 
//   }
//  
//  
//   //right 
//   if (oball.x > width) {
//      oball.x = width;
//      ballSpeedX *= -1; 
//   }

    float playerDist = oball.dist(oplayer);
    
    if (oball.x > width) {
       oball.x = width/2;
       ballSpeedX *= -1;
       enemyScore ++;
       // Blink
    }
    
    if (oball.x < 0) {
       oball.x = width/2; 
       ballSpeedX *= -1;
       playerScore ++;
       // Blink
    }
    
    //player
    if (oball.x > width - width/40 - ballSize && oball.x < width && Math.abs(oball.y - oplayer.y) < width/10) {
       oball.x = width - width/40 - ballSize;
       ballSpeedX *= -1;
    }
    
    //enemy
    if (oball.x < width/40 + ballSize && oball.x > 0 && Math.abs(oball.y - oenemy.y) < width/10) {
       oball.x = width/40 + ballSize;
       ballSpeedX *= -1; 
    }
    
    
 
}

void drawplayer()
{  
   oplayer.y = int(map(accelerometerX * 100,minX*100,maxX*100,height,0));
  
   pushMatrix();
     translate(oplayer.x - width/20, oplayer.y);
     stroke(0);
     fill(255);
     rect(0, 0, width/20, width/5);
     //box(width/20, width/5, width/50);
   popMatrix();
  
}

void drawenemy()
{
    oenemy.y += enemySpeed;
  
    pushMatrix();
      translate(oenemy.x + width/20, oenemy.y);
      fill(255, 0, 0);
      rect(0, 0, width/20, width/5);
      //box(width/20, width/5, width/50);  
    popMatrix();
    
    oenemyAI();
  
}

void oenemyAI()
{
    if (oenemy.y < oball.y) {
      enemySpeed = width/150;
    }
    
    if (oenemy.y > oball.y) {
      enemySpeed = - width/150; 
    }
    
    if (oenemy.y == oball.y) {
      enemySpeed = 0; 
    }
    
    if (oball.x > width/2) {
      enemySpeed = 0; 
    }
}

void scoreText()
{
    fill(255);
    textSize(width/20);
    text(enemyScore, width/10 * 3, height/5);
    text(playerScore, width/10 * 7, height/5);  
}

/*
void onAccelerometerEvent(float x, float y, float z)
{
  accelerometerX = x;
  accelerometerY = y;
  accelerometerZ = z;
}
*/

/*
// Network Data from Smartphone
void oscEvent(OscMessage theOscMessage) {
  if (theOscMessage.checkTypetag("fff"))                  // 6
  {
    accelerometerX =  theOscMessage.get(0).floatValue();  // 7
    accelerometerY =  theOscMessage.get(1).floatValue();
    accelerometerZ =  theOscMessage.get(2).floatValue();
    
   if ( accelerometerX < minX){ minX = accelerometerX + 1; };
   if ( accelerometerX > maxX){ maxX = accelerometerX - 1; };
  
  }
}*/

void centerLine()
{
   int numberOfLines = 15;
  
   for (int i = 0; i < numberOfLines; i++) {
     strokeWeight(width/150);
     stroke(255);
     line(width/2, i * width/numberOfLines, width/2, (i+1) * width/numberOfLines - width/40);
     stroke(0, 0);
     line(width/2, (i+1) * width/numberOfLines - width/40, width/2, (i+1) * width/numberOfLines);
     
   }
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
