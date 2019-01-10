// Соболев А. Ю. М8О-307Б
// Вариант №17: 4-гранная прямая правильная усеченная пирамида 

float rotX = 0.0, rotY = 0.0;
float distX = 0.0, distY = 0.0;
int lastX, lastY;
int scale_value = 50;
boolean fillStatus = false;
boolean projectionStatus = false;
 
void setup() {
    size(800, 600, P3D);
}
 
void draw() {
    background(255);
    translate(width/2, width/3, height/4);
 
    if (projectionStatus) {
        ortho();
    } else {
        perspective();
    }
 
    rotateY(rotY + distX);
    rotateX(rotX + distY);
 
    scale((float)scale_value * 1.21 / (float)100);
    drawTruncatedPyramid(50, 180, 200, 4);
}
 
void drawTruncatedPyramid(float topRadius, float bottomRadius, float tall, int sides) {
  if (fillStatus) {
    noFill();
  } else {
    fill(color(0, 102, 204));
  }
  
  float angle = 0;
  float angleIncrement = TWO_PI / sides;
  beginShape(QUAD_STRIP);
  for (int i = 0; i < sides + 1; ++i) {
    vertex(topRadius*cos(angle), 0, topRadius*sin(angle));
    vertex(bottomRadius*cos(angle), tall, bottomRadius*sin(angle));
    angle += angleIncrement;
  }
  endShape();
  
  // If it is not a cone, draw the circular top cap
  if (topRadius != 0) {
    angle = 0;
    beginShape(TRIANGLE_FAN);
    
    // Center point
    vertex(0, 0, 0);
    for (int i = 0; i < sides + 1; i++) {
      vertex(topRadius * cos(angle), 0, topRadius * sin(angle));
      angle += angleIncrement;
    }
    endShape();
  }

  // If it is not a cone, draw the circular bottom cap
  if (bottomRadius != 0) {
    angle = 0;
    beginShape(TRIANGLE_FAN);

    // Center point
    vertex(0, tall, 0);
    for (int i = 0; i < sides + 1; i++) {
      vertex(bottomRadius * cos(angle), tall, bottomRadius * sin(angle));
      angle += angleIncrement;
    }
    endShape();
  }
}
 
void mousePressed() {
    lastX = mouseX;
    lastY = mouseY;
}
 
void mouseDragged() {
    distX = radians(mouseX - lastX);
    distY = radians(lastY - mouseY);
}

void mouseWheel(MouseEvent event) {
  float e = event.getCount();
  if (e < 0) {
    if (scale_value >= 1) {
            scale_value += 5;
    }
  }
  else if (e > 0) {
    if (scale_value >= 1) {
            scale_value -= 5;
    }
  }
}

void keyPressed() {
    if(key != CODED) {
        if (key == 'p' || key == 'P' && ((distX == 0) && (distY == 0))) {
          projectionStatus = (projectionStatus) ? false : true;
        }
        if (key == 'f') {
          fillStatus = (fillStatus) ? false : true;
        }
    }
}
 
void mouseReleased() {
    rotX += distY;
    rotY += distX;
    distX = distY = 0.0;
}
