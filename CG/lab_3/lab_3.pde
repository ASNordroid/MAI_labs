float rotX = 0.0, rotY = 0.0;
float distX = 0.0, distY = 0.0;
int lastX, lastY;
int scale_value = 100;
boolean strokeStatus = false;
boolean projectionStatus = false;
int h = 18;

void setup() {
  size(640, 480, P3D); 
}

void draw() {
  background(255);
  directionalLight(126, 126, 126, 0, 0, -1);
  directionalLight(0, 255, 0, 0, -1, 0);
  pointLight(255, 0, 0, width/2, height/2, 400);
  ambientLight(102, 102, 102);
  translate(width/2, width/3, height/4);

  if (projectionStatus) {
    ortho(-width/2, width/2, -height/2, height/2);
  } else {
    perspective();
  }
  rotateY(rotY + distX);
  rotateX(rotX + distY);

  scale((float)scale_value * 1.21 / (float)100);
  drawCylinder(h, 30, 100);
}

void drawCylinder( int sides, float r, float he)
{
    float angle = 360 / sides;
    float halfHeight = he / 2;

    // draw top of the tube
    beginShape();
    for (int i = 0; i < sides; i++) {
        float x = cos( radians( i * angle ) ) * r;
        float y = sin( radians( i * angle ) ) * r;
        vertex( x, y, -halfHeight);
    }
    endShape(CLOSE);

    // draw bottom of the tube
    beginShape();
    for (int i = 0; i < sides; i++) {
        float x = cos( radians( i * angle ) ) * r;
        float y = sin( radians( i * angle ) ) * r;
        vertex( x, y, halfHeight);
    }
    endShape(CLOSE);
    
    // draw sides
    beginShape(TRIANGLE_STRIP);
    for (int i = 0; i < sides + 1; i++) {
        float x = cos( radians( i * angle ) ) * r;
        float y = sin( radians( i * angle ) ) * r;
        vertex( x, y, halfHeight);
        vertex( x, y, -halfHeight);    
    }
    endShape(CLOSE);
}


void mousePressed() {
  lastX = mouseX;
  lastY = mouseY;
}

void mouseDragged() {
  distX = radians(mouseX - lastX);
  distY = radians(lastY - mouseY);
}

void mouseReleased() {
  rotX += distY;
  rotY += distX;

  if (mouseButton == RIGHT && (distX == 0) && (distY == 0)) {
    strokeStatus = (strokeStatus) ? false : true;
  }
  if (mouseButton == LEFT && (distX == 0) && (distY == 0)) {
    projectionStatus = (projectionStatus) ? false : true;
  }
  distX = distY = 0.0;
}

void mouseWheel(MouseEvent event) {
  if (scale_value >= 1) {
    scale_value -= event.getCount();
  }
}

void keyPressed() {
  if (key == CODED) {
    if (keyCode == UP) {
      h+=6;
    } else if (keyCode == DOWN && h > 6) {
      h-=6;
    }
  }
}
