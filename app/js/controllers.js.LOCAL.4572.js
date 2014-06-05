'use strict';

/* Controllers */

var app = angular.module('game', []);  
app.controller('gameController', function(){ 
	this.board = board;
});

var cells_0 = [
{position:"1",},
{position:"2",},
{position:"3",}
];

var cells_1 = [
{position:"4",},
{position:"5",},
{position:"6",}
];

var cells_2 = [
{position:"7",},
{position:"8",},
{position:"9",}
];

var board = [cells_0, cells_1, cells_2];