var cols = 10;
var rows = 10;
var w = 40;
var grid = [];
var selectedCells = [];
var solution = [32, 33, 65, 78, 87];

var feedback = 'click some buttons!';

function setup() {
    createCanvas(1000, 1000);

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
    

    for(var k = 0; k < grid.length; k++) {
      grid[k].show();
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
    }

    this.clicked = function() {
      var d = dist(mouseX, mouseY, this.x, this.y);

      if(d <= w/2) {
        this.brightness = 255;
        selectedCells.push(this.id);
        //console.log(this.id);
        //console.log(solution);
        //console.log(selectedCells);
        checkSolution();
      }
    }

  }

  function checkSolution() {

    selectedCells.sort();

    if(selectedCells.length!= solution.length    ) {
      feedback = 'you need to click 5 buttons';
      return;
    }

    for(var p = 0; p < solution.length; p++) {
      if(solution[p] != selectedCells[p]) {
        feedback = 'not the right buttons';
        return;
      }
    }

    feedback = 'you got it!';
     
  }