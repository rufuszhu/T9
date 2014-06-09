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

	this.changePadPlayable = function(pad, row, col){
		alert("row: " + row + ";  col: " + col);
		//board[row][col][0][0].padActive = 1;
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){
				if (boardRow== row && boardCol==col)
					board[boardRow][boardCol][0][0].padActive = 1;
				else 
					board[boardRow][boardCol][0][0].padActive = 0;
			}
		}
	};
	
	this.playable = function(pad){
		var padActive = pad[0][0].padActive;
		return padActive;
	};
	//alert(pad[0][1].col);
	//board[0][0][0][0].row
	
    this.cellOnClick = function(pad, row, col, row_p, col_p){
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
			this.changePadPlayable(pad, row, col);
		}
		
		//var result = this.checkWin(pad);
		var localResult = this.checkWin(pad);
		this.bigPad[row_p][col_p].ownBy = localResult;
		var result = this.checkWin(this.bigPad);
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
		{row:"0", col:"0", ownBy:0, Symbol:"E", padActive:1},  // we actually only need the padActive attribute for this array element to determine the activeness of a board 
		{row:"0", col:"1", ownBy:0, Symbol:"E", padActive:1},
		{row:"0", col:"2", ownBy:0, Symbol:"E", padActive:1}
	],
	[
		{row:"1", col:"0", ownBy:0, Symbol:"E", padActive:1},
		{row:"1", col:"1", ownBy:0, Symbol:"E", padActive:1},
		{row:"1", col:"2", ownBy:0, Symbol:"E", padActive:1}
	],
	[
		{row:"2", col:"0", ownBy:0, Symbol:"E", padActive:1},
		{row:"2", col:"1", ownBy:0, Symbol:"E", padActive:1},
		{row:"2", col:"2", ownBy:0, Symbol:"E", padActive:1}
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

//determines # of "pads" in one row of (big) board
for (var i=0; i<3; i++) {
	board_r.push(angular.copy(pad));
}

//determines # of  rows our (big) board have. (Board is designed to be a 3x3 m)
for (var i=0; i<3; i++) {
	board.push(angular.copy(board_r));
}


//$(document).ready(function() {
//    $('.div-cell').mouseenter(function() {
//        $('.div-cell').addClass("div-cell-hover");
//    });
//    $('.div-cell').mouseleave(function() {
//        $('.div-cell').removeClass("div-cell-hover");
//    });
//});
