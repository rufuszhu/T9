'use strict';

/* Controllers */

var app = angular.module('T3', []);  
app.controller('gameController', function(){ 
	this.board = cells;
        this.turn_1 = true;
        
        this.isOccupy = function(cell){
            return cell.ownBy.length;
        };
        
        this.setCell = function(cell){
            
            if(!this.isOccupy(cell))
            {    
                if(this.turn_1)
                {
                    cell.ownBy="X";
                    this.turn_1=!this.turn_1;
                }
                else
                {
                    cell.ownBy="O";
                    this.turn_1=!this.turn_1;
                }
            }
            var result = this.checkWin();
            console.log(result);
            if("X"==="X"==="X"==="X")
            console.log("asfsdfsdf");
            if(result === 1)
                alert("winner is player 1!");
            else if(result === 2)
                alert("winner is player 2!");
        };
        
        this.checkWin = function(){
            var cells = this.board;
            console.log(cells[0].ownBy);
            console.log(cells[1].ownBy);
            console.log(cells[2].ownBy);
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


var cells = [
{position:"1", ownBy:""},
{position:"2", ownBy:""},
{position:"3", ownBy:""},

{position:"4", ownBy:""},
{position:"5", ownBy:""},
{position:"6", ownBy:""},

{position:"7", ownBy:""},
{position:"8", ownBy:""},
{position:"9", ownBy:""},
];