var cols = 10;
var rows = 10;
var cellWidth = 34;

var yellow;
var apfelFont;

var solution = [32, 33, 65, 78, 87];
var grid = [];

var selectedCells = [];
var lastCell;
var edges = [];
var feedback = '>> Go ahead and click some buttons!';



function preload() {
  apfelFont = loadFont('ApfelGrotezk-Regular.otf');
}


function setup() {

    var myCanvas = createCanvas(800, 800);
    myCanvas.parent("centered_canvas");
    

    var cellNumber = 0;
    yellow = color(255, 204, 0);
    textFont(apfelFont);

    //Create grid of cells
    for(var i = 0; i < rows; i++) {

      for(var j = 0; j < cols; j++) {

        var cell = new Cell(i, j);
        cell.id = cellNumber;
        grid.push(cell);
        cellNumber++;
      }
    }
  }




  
  function draw() {

    background(255);

    //Draw feedback text
    textSize(18);
    fill(0);
    strokeWeight(0);
    text(feedback, 16, 700);


    for(var k = 0; k < grid.length; k++) {
      grid[k].show();
    }

    if(edges.length > 0) {
      for(var l = 0; l < edges.length; l++) {
        edges[l].show();
      }
    }

    if(lastCell != null && edges.length <= 3) {
      stroke(yellow);
      strokeWeight(4);
      line(lastCell.x, lastCell.y, mouseX, mouseY);
    }
    
  }





  function mousePressed() {
    for(var k = 0; k < grid.length; k++) {
      grid[k].clicked();
    }
  }





  function Cell(i, j) {

    this.x = 0;
    this.y = 0;
    this.id;

    this.brightness = 0;
    this.strokeBrightness = 0;

    this.show = function() {
      this.x = i * cellWidth * 1.8 + 50;
      this.y = j * cellWidth * 1.8 + 50;

      stroke(this.strokeBrightness);
      fill(this.brightness);
      strokeWeight(2);
      ellipse(this.x, this.y, cellWidth, cellWidth);

      textSize(14);
      strokeWeight(0);
      fill(0);
      text(this.id, this.x-cellWidth+12, this.y-cellWidth+12);
    }

    this.clicked = function() {

      var d = dist(mouseX, mouseY, this.x, this.y);

      if(d <= cellWidth/2) {
        this.brightness = color(yellow);
        selectedCells.push(this);
        checkSolution();

        if(lastCell != null) {
          var newEdge = new Edge(lastCell, this);
          edges.push(newEdge);
        }
        

        lastCell = this;
      }
    }

  }





  function Edge(firstCell, secondCell) {

    this.sX = firstCell.x;
    this.sY = firstCell.y;
    this.eX = secondCell.x;
    this.eY = secondCell.y;

    this.show = function() {
      
      stroke(yellow);
      strokeWeight(4);
      line(this.sX, this.sY, this.eX, this.eY);
    }
    

  }
  

  function checkSolution() {

    if(selectedCells.length!= solution.length    ) {
      feedback = '>> You need to click 5 buttons!';
      return;
    }

    for(var p = 0; p < solution.length; p++) {
      if(solution[p] != selectedCells[p].id) {
        feedback = '>> Not the right sequence! Click "Reset" and restart';
        return;
      }
    }

    feedback = '>> You got it!';
     
  }


  

  function reset() {
    for(var i = 0; i < selectedCells.length; i++) {
      lastCell = null;
      selectedCells[i].brightness = 0;
      edges = [];
    }
    selectedCells = [];
  }