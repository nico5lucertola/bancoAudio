var cols = 10;
var rows = 10;
var cellWidth = 34;

var yellow;
var red;
var apfelFont;
var selectSound;

var solution = [61, 55, 13, 37];
var grid = [];

var selectedCells = [];
var activePaths = [];

var lastCell;
var edges = [];
var paths = [];
var feedback = '>> Go ahead and click some buttons!';

var testPathpointsIds = [61, 62, 53, 54, 55];
var testPathpointsIds2 = [13, 24, 25, 36, 37];

//load fonts
function preload() {
  apfelFont = loadFont('ApfelGrotezk-Regular.otf');
  selectSound = loadSound('select.wav');
}


function setup() {

    var myCanvas = createCanvas(800, 800);
    myCanvas.parent("centered_canvas");
    

    var cellNumber = 0;
    yellow = color(255, 204, 0);
    yellow = color(255, 0, 0);
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

    var firstPath = new Path(61, 55, testPathpointsIds);
    firstPath.findPathpointCells();
    paths.push(firstPath);

    var secondPath = new Path(13, 37, testPathpointsIds2);
    secondPath.findPathpointCells();
    paths.push(secondPath);
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


    //Draw the paths
    for(var l = 0; l < activePaths.length; l++) {
      activePaths[l].show();
    }
    
  }




  //Function that triggers the clicked() function on the Cell class
  function mousePressed() {

    for(var k = 0; k < grid.length; k++) {
      grid[k].clicked();
    }

    for(var o = 0; o < paths.length; o++) {
      paths[o].checkActivators();
    }
  }




  //Class of the single cell in the grid
  function Cell(i, j) {

    this.x;
    this.y;
    this.id;

    this.brightness = 0;
    this.strokeBrightness = 0;

    this.selected = false;


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
      if(d <= cellWidth / 2) {
        console.log(this.selected);

        //Avoid clicking the same cell twice
        if(this.selected == true) {
          return;
        }

        selectSound.play();
        this.brightness = color(yellow);
        this.selected = true;
        selectedCells.push(this);
        checkSolution();
        
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

  function Path(activator1, activator2, newPathpointsIds) {

    this.pathpointIds = newPathpointsIds;
    this.activators = [activator1, activator2];

    this.pathpointCells = [];

    this.findPathpointCells = function() {

      for(var g = 0; g < this.pathpointIds.length; g++) {
        
        for(var f = 0; f < grid.length; f++) {

          if(this.pathpointIds[g] == grid[f].id) {
            this.pathpointCells.push(grid[f]);
          }
        }
      }
    }

    this.checkActivators = function() {

      var selectedIds = [];

      for(var h = 0; h < selectedCells.length; h++) {
        selectedIds.push(selectedCells[h].id);
      }

      if(checker(selectedIds, this.activators)) {
        activePaths.push(this);
      }
    }   

    this.show = function() {

      for(var i = 0; i < this.pathpointCells.length -1; i++) {

        var newEdge = new Edge(this.pathpointCells[i], this.pathpointCells[i+1]);
        edges.push(newEdge);
      }
      
    }

  }
  

  //Function that checks if the solution is correct and updates the written feedback
  function checkSolution() {

    solution.sort();
    selectedCells.sort();

    //Case 1: the user clicked less than 5 Cells
    if(selectedCells.length!= solution.length ) {
      feedback = '>> You need to click 4 buttons!';
      return;
    }

    //Case 2: the user clicked the wrong 5 cells
    for(var p = 0; p < solution.length; p++) {
      if(solution[p] != selectedCells[p].id) {
        feedback = '>> Not the right buttons! Click "Reset" and restart';
        return;
      }
    }

    //Case 3: the user clicked the right sequence
    feedback = '>> You got it!';
  }


  
  //Function that resets all cells and edges
  function reset() {

    for(var i = 0; i < selectedCells.length; i++) {
      
      selectedCells[i].brightness = 0;
      selectedCells[i].selected = false;
    }

    edges = [];
    activePaths = [];
    selectedCells = [];
  }


  let checker = (container, contained) => contained.every(v => container.includes(v));