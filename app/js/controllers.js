'use strict';

/* Controllers */

var app = angular.module('T9', []);

app.controller('gameController', function(){ 
	this.board = board;
	this.turn_1=true;
        
    this.isOccupy = function(cell){
        if (cell.ownBy===0)
			{return false;}
		else
			{return true;}
    };

    this.cellOnClick = function(cell){
		//Setting ownership
		if (this.isOccupy(cell)){
			alert("This is occupied!");
		}else{
            if(this.turn_1){
                cell.Symbol="X";
				cell.ownBy="1";
                this.turn_1=false;
            }else{
                cell.Symbol="O";
				cell.ownBy="-1";
                this.turn_1=true;
            }
		}
		
		
	};
        
	this.checkWin = function(unit){
		var cells = this.board;
            //check rows
            for (var i = 0; i < 3; i++) { 
                if( cells[i].ownBy === cells[i+1].ownBy === cells[i+2].ownBy === "X" )
                    return 1;
                else if( cells[i].ownBy === cells[i+1].ownBy === cells[i+2].ownBy === "O" )
                    return 2;
            }
            //check cols
            for (var i = 0; i < 3; i++) { 
                if( cells[i].ownBy === cells[i+3].ownBy === cells[i+6].ownBy === "X" )
                    return 1;
                else if( cells[i].ownBy === cells[i+3].ownBy === cells[i+6].ownBy === "O" )
                    return 2;
            }
            //check diagonl
            if( cells[0].ownBy === cells[4].ownBy === cells[8].ownBy === "X" )
                return 1;
            else if( cells[2].ownBy === cells[4].ownBy === cells[6].ownBy === "O" )
                return 2;
            
            return 0;
        };

});


var pad_9 = [
[{position:"1", ownBy:0, Symbol:"E"},
{position:"2", ownBy:0, Symbol:"E"},
{position:"3", ownBy:0, Symbol:"E"}
],
[{position:"4", ownBy:0, Symbol:"E"},
{position:"5", ownBy:0, Symbol:"E"},
{position:"6", ownBy:0, Symbol:"E"}
],
[{position:"7", ownBy:0, Symbol:"E"},
{position:"8", ownBy:0, Symbol:"E"},
{position:"9", ownBy:0, Symbol:"E"}
]];

var board_r = [];
var board = [];

for (var i=0; i<3; i++) {
	board_r.push(angular.copy(pad));
}

for (var i=0; i<3; i++) {
	board.push(angular.copy(board_r));
}

