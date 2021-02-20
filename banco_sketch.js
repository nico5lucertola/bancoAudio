var cols = 10;
var rows = 10;
var w = 40;
var grid = [];
var selectedNumbers = [];
var selectedCells = [];
var solution = [32, 33, 65, 78, 87];

var feedback = 'click some buttons!';

var lastCell;

var edges = [];

function setup() {

    var myCanvas = createCanvas(700, 700);
    myCanvas.parent("centered_canvas");
    
    resetButton = createButton('reset!');
    
    resetButton.mousePressed(reset);

    var counter = 0;

    for(var i = 0; i < rows; i++) {
      for(var j = 0; j < cols; j++) {
        var cell = new Cell(i, j);
        cell.id = counter;
        grid.push(cell);

        counter++;
      }
    }
  }




  
  function draw() {
    background(0);

    textSize(32);
    fill(255);
    strokeWeight(0);
    text(feedback, 20, 600);

    textSize(20);
    fill(255, 204, 0);
    strokeWeight(0);
    text('do you know how to use a mixer?', 20, 20);
    
    resetButton.position(windowWidth/2 - 90, 50);

    for(var k = 0; k < grid.length; k++) {
      grid[k].show();
    }

    if(edges.length > 0) {
      for(var l = 0; l < edges.length; l++) {
        edges[l].show();
      }
    }

    if(lastCell != null && edges.length <= 3) {
      stroke(255, 204, 0);
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

    this.show = function() {
      this.x = i * w * 1.3 + 50;
      this.y = j * w * 1.3 + 50;
      stroke(255);
      strokeWeight(2);
      fill(this.brightness);
      ellipse(this.x, this.y, w, w);

      textSize(14);
      strokeWeight(0);
      fill(255);
      text(this.id, this.x-5, this.y+5);
    }

    this.clicked = function() {

      var d = dist(mouseX, mouseY, this.x, this.y);

      if(d <= w/2) {
        this.brightness = 255;
        selectedNumbers.push(this.id);
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
      
      stroke(255, 204, 0);
      strokeWeight(4);
      line(this.sX, this.sY, this.eX, this.eY);
    }
    

  }
  

  function checkSolution() {

    //selectedNumbers.sort();

    if(selectedNumbers.length!= solution.length    ) {
      feedback = 'you need to click 5 buttons';
      return;
    }

    for(var p = 0; p < solution.length; p++) {
      if(solution[p] != selectedNumbers[p]) {
        feedback = 'not the right sequence';
        return;
      }
    }

    feedback = 'you got it!';
     
  }


  

  function reset() {
    for(var i = 0; i < selectedCells.length; i++) {
      lastCell = null;
      selectedCells[i].brightness = 0;
      edges = [];
      selectedNumbers = [];
    }
  }