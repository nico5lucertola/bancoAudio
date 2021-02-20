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


//load fonts
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

    //Draw the cells
    for(var k = 0; k < grid.length; k++) {
      grid[k].show();
    }

    //Draw the edges
    if(edges.length > 0) {
      for(var l = 0; l < edges.length; l++) {
        edges[l].show();
      }
    }

    //Draw the edge preview on mouseposition
    if(lastCell != null && edges.length <= 3) {
      stroke(yellow);
      strokeWeight(4);
      line(lastCell.x, lastCell.y, mouseX, mouseY);
    }
    
  }




  //Function that triggers the clicked() function on the Cell class
  function mousePressed() {
    for(var k = 0; k < grid.length; k++) {
      grid[k].clicked();
    }
  }




  //Class of the single cell in the grid
  function Cell(i, j) {

    this.x;
    this.y;
    this.id;

    this.brightness = 0;
    this.strokeBrightness = 0;

    //Function that actually draws each cell
    this.show = function() {

      this.x = i * cellWidth * 1.8 + 50;
      this.y = j * cellWidth * 1.8 + 50;

      //Draw the circle
      stroke(this.strokeBrightness);
      fill(this.brightness);
      strokeWeight(2);
      ellipse(this.x, this.y, cellWidth, cellWidth);

      //Draw the number of the cell
      textSize(14);
      strokeWeight(0);
      fill(0);
      text(this.id, this.x-cellWidth+12, this.y-cellWidth+12);
    }

    //Function that checks if the Cell was clicked
    this.clicked = function() {
      
      //Distance between the mousepos and the center of the cell
      var d = dist(mouseX, mouseY, this.x, this.y);

      //Comparing d to the circle radius
      if(d <= cellWidth/2) {

        this.brightness = color(yellow);
        selectedCells.push(this);
        checkSolution();

        //If this is not the first cell, we create an Edge
        if(lastCell != null) {

          var newEdge = new Edge(lastCell, this);
          edges.push(newEdge);

        }

        lastCell = this;
      }
    }

  }




  //Class of the single Edge between Cells
  function Edge(firstCell, secondCell) {

    //Start and end positions of the edge
    this.sX = firstCell.x;
    this.sY = firstCell.y;
    this.eX = secondCell.x;
    this.eY = secondCell.y;

    //Function that draws the Edge
    this.show = function() {
      
      stroke(yellow);
      strokeWeight(4);
      line(this.sX, this.sY, this.eX, this.eY);

    }
  }
  

  //Function that checks if the solution is correct and updates the written feedback
  function checkSolution() {

    //Case 1: the user clicked less than 5 Cells
    if(selectedCells.length!= solution.length ) {
      feedback = '>> You need to click 5 buttons!';
      return;
    }

    //Case 2: the user clicked the wrong 5 cells
    for(var p = 0; p < solution.length; p++) {
      if(solution[p] != selectedCells[p].id) {
        feedback = '>> Not the right sequence! Click "Reset" and restart';
        return;
      }
    }

    //Case 3: the user clicked the right sequence
    feedback = '>> You got it!';
  }


  
  //Function that resets all cells and edges
  function reset() {

    for(var i = 0; i < selectedCells.length; i++) {
      lastCell = null;
      selectedCells[i].brightness = 0;
      edges = [];
    }
    
    selectedCells = [];
  }