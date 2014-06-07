'use strict';

/* Controllers */

var app = angular.module('T9', []);

app.controller('gameController', function(){ 
	this.board = board;
	this.bigPad = pad;
	this.turn_1=true;
        
    this.isOccupy = function(cell){
        if (cell.ownBy===0)
			{return false;}
		else
			{return true;}
    };

    this.cellOnClick = function(pad, row, col){
		//Setting ownership
		if (this.isOccupy(pad[row][col])){
			alert("This is occupied!");
		}else{
            if(this.turn_1){
                pad[row][col].Symbol="X";
				pad[row][col].ownBy=1;
                this.turn_1=false;
            }else{
                pad[row][col].Symbol="O";
				pad[row][col].ownBy=-1;
                this.turn_1=true;
            }
		}
		
		var result = this.checkWin(pad);
		//var localResult = this.checkWin(pad);
		//bigPad[][].ownBy = localresult;
		//var result = this.checkWin(bigPad);
		if (result===1)
		{alert("Player 1 wins!");}
		else if (result===-1)
		{alert("Player 2 wins!");}
		
	};
        
	this.checkWin = function(unit){
		var sum = 0;
		
		//check rows		
		for (var i = 0; i < 3; i++){
			sum = unit[i][0].ownBy+unit[i][1].ownBy+unit[i][2].ownBy;
			if (sum===3){
				return 1;
			}else if(sum===-3){
				return -1;
			}
		}
            
		//check cols		
		for (var i = 0; i < 3; i++){
			sum = unit[0][i].ownBy+unit[1][i].ownBy+unit[2][i].ownBy;
			if (sum===3){
				return 1;
			}else if(sum===-3){
				return -1;
			}
		}
		
		//check left diag
		sum = unit[0][0].ownBy+unit[1][1].ownBy+unit[2][2].ownBy;
		if (sum===3){
			return 1;
		}else if(sum===-3){
			return -1;
		}
			
		//check right diag
		sum = unit[2][0].ownBy+unit[1][1].ownBy+unit[0][2].ownBy;
		if (sum===3){
			return 1;
		}else if(sum===-3){
			return -1;
		}
		
		return 0;
	}

});


var pad = [
	[
		{row:"0", col:"0", ownBy:0, Symbol:"E"},
		{row:"0", col:"1", ownBy:0, Symbol:"E"},
		{row:"0", col:"2", ownBy:0, Symbol:"E"}
	],
	[
		{row:"1", col:"0", ownBy:0, Symbol:"E"},
		{row:"1", col:"1", ownBy:0, Symbol:"E"},
		{row:"1", col:"2", ownBy:0, Symbol:"E"}
	],
	[
		{row:"2", col:"0", ownBy:0, Symbol:"E"},
		{row:"2", col:"1", ownBy:0, Symbol:"E"},
		{row:"2", col:"2", ownBy:0, Symbol:"E"}
	]
];
/*
var board = [
	[
		{row:"0", col:"0", ownBy:0, pad_o:angular.copy(pad)},
		{row:"0", col:"1", ownBy:0, pad_o:angular.copy(pad)},
		{row:"0", col:"2", ownBy:0, pad_o:angular.copy(pad)}
	],
	[
		{row:"1", col:"0", ownBy:0, pad_o:angular.copy(pad)},
		{row:"1", col:"1", ownBy:0, pad_o:angular.copy(pad)},
		{row:"1", col:"2", ownBy:0, pad_o:angular.copy(pad)}
	],
	[
		{row:"2", col:"0", ownBy:0, pad_o:angular.copy(pad)},
		{row:"2", col:"1", ownBy:0, pad_o:angular.copy(pad)},
		{row:"2", col:"2", ownBy:0, pad_o:angular.copy(pad)}
	]
];*/

var board_r = [];
var board = [];

for (var i=0; i<3; i++) {
	board_r.push(angular.copy(pad));
}

for (var i=0; i<3; i++) {
	board.push(angular.copy(board_r));
}

