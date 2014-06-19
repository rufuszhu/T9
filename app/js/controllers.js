'use strict';

/* Controllers */

var app = angular.module('T9', ['ngRoute', 'firebase']);
var URL = 'https://t9.firebaseio.com';
app.value('fbURL', URL);
//app.value('fbURL', URL + '/friendgames');

/*
app.factory('T9Data', function($firebase, fbURL){
	return $firebase(new Firebase(fbURL));
});
*/

app.config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			controller: 'splashController',
			templateUrl: 'partials/splash.html'
		})
		.when('/local',
		{
			controller: '',
			templateUrl: 'partials/localgame.html'
		})
		.when('/splash',
		{
			controller: 'splashController',
			templateUrl: 'partials/splash.html'
		})
		.when('/online',
		{
			controller: '',
			templateUrl: 'partials/onlinegame.html'
		})
		.when('/friend/:gameId',
		{
			controller: '',
			templateUrl: 'partials/friendgame.html'
		})
		.when('/howto',
		{
			controller: '',
			templateUrl: 'partials/howtoplay.html'
		})
		.otherwise({redirectTo: '/'});
		
});

app.controller('gameController', function(){ 
	this.board  = board;
	this.bigPad = pad;
	this.turn_1 = true;
	this.winnerDeclared = false;
	
    this.isOccupy = function(cell){
        if (cell.ownBy===0)
			{return false;}
		else
			{return true;}
    };

	this.checkPadFull = function(pad, row, col){
        var cellCount=0;
        for(var padRow=0; padRow<3; padRow++){
            for(var padCol=0; padCol<3; padCol++){
                if (board[row][col][padRow][padCol].ownBy === 0){
                    //alert("pad " + row + ", " + col + "is not full!");
                    return 0;
                }
                else{
                    cellCount++;
                }
            }
        }
        //alert("pad " + row + ", " + col + " is full. : " + cellCount);
        return cellCount==9? 1:0; 
    };

	this.playable = function(pad){
		var padActive = pad[0][0].padActive;
		return padActive;
	};
	
	
	
	this.freeAllPads = function(){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){			
				this.board[boardRow][boardCol][0][0].padActive = 1;
			}
		}
	};
	
	this.changePadPlayable = function(row, col){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){
				if (boardRow==row && boardCol==col){
				    if(this.checkPadFull(pad, row, col)===1){
                        this.freeAllPads();
                        return;
                    }
					this.board[boardRow][boardCol][0][0].padActive = 1;
				}
				else {
					this.board[boardRow][boardCol][0][0].padActive = 0;
				}
			}
		}
	};
	
	/* // this function is not working in one very specific condition, which could cause dead lock of game
	this.checkPadFull = function(pad){
		for(var padRow=0; padRow<3; padRow++){
			for(var padCol=0; padCol<3; padCol++){
				if (pad[padRow][padCol].ownBy === 0){
					return 0;
				}
			}
		}
		return 1; 
	};
	*/
	
    this.cellOnClick = function(row, col, row_p, col_p){
		if(this.playable(this.board[row_p][col_p]) && !(this.winnerDeclared)){
			//Setting ownership
			if (this.isOccupy(this.board[row_p][col_p][row][col])){
				alert("This is occupied!");
			}else{
				if(this.turn_1){
					this.board[row_p][col_p][row][col].Symbol="X";
					this.board[row_p][col_p][row][col].ownBy=1;
					this.turn_1=false;
				}else {
					this.board[row_p][col_p][row][col].Symbol="O";
					this.board[row_p][col_p][row][col].ownBy=-1;
					this.turn_1=true;
				}
				//Switching pads
				this.changePadPlayable(row, col);
				//If full, choose pads freely
				//if (this.checkPadFull(this.board[row_p][col_p])===1){
				//	this.freeAllPads();
				//}
			}
			
			//var result = this.checkWin(pad);
			var localResult = this.checkWin(this.board[row_p][col_p]);
			this.bigPad[row_p][col_p].ownBy = localResult;
			var result = this.checkWin(this.bigPad);
			if (result===1){
				alert("Player 1 wins!");
				this.winnerDeclared = true;
				this.changePadPlayable(-1, -1);
			}
			else if (result===-1){
				alert("Player 2 wins!");
				this.winnerDeclared = true;
				this.changePadPlayable(-1, -1);
			}
		}
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
	};
	
	this.rematch = function(showAlert){
		var rematchConfirm = false;
		if (showAlert){
			rematchConfirm = confirm("Rematch. Are you sure?");
		}else{
			rematchConfirm = true;
		}
	
		if (rematchConfirm){
			for(var boardRow=0; boardRow<3; boardRow++){
				for(var boardCol=0; boardCol<3; boardCol++){
					for(var cellRow=0; cellRow<3; cellRow++){
						for(var cellCol=0; cellCol<3; cellCol++){
							this.board[boardRow][boardCol][cellRow][cellCol].ownBy = 0;
						}
					}
					this.bigPad[boardRow][boardCol].ownBy = 0;
				}
			}
			this.winnerDeclared = false;
			this.turn_1=true;
			this.freeAllPads();
		}
	};
	
	this.debug = function() {
		console.log(this.bigPad[0][0].ownBy +" "+ this.bigPad[0][1].ownBy +" "+ this.bigPad[0][2].ownBy);
		console.log(this.bigPad[1][0].ownBy +" "+ this.bigPad[1][1].ownBy +" "+ this.bigPad[1][2].ownBy);
		console.log(this.bigPad[2][0].ownBy +" "+ this.bigPad[2][1].ownBy +" "+ this.bigPad[2][2].ownBy);
	};
	
});

app.controller('splashController', function($scope, $location){
	this.splashboard = board;
	
	$scope.newFriendGame = function(){
		console.log('Creating new friend-friend game');
		//alert(Math.floor(Math.random() * 99999).toString());
		$location.path( "/friend/" + Math.floor(Math.random() * 99999).toString());
	};
});

app.controller('friendgameController', function($scope, fbURL, $firebase, $location, $routeParams){
	this.board  = board;
	this.bigPad = pad;
	this.turn_1 = true;
	this.winnerDeclared = false;
	//alert($routeParams.gameId); //this will alert gameId
	//alert($location.absUrl());  //this will alert absolute URL of the site in the browser address bar
	
	fbURL = fbURL + '/friendgames' + '/' +$routeParams.gameId;
	$scope.tttData = $firebase(new Firebase(fbURL));
	
	var gameInit = new Firebase(fbURL+"/gameStatus");
	var player;
	gameInit.once('value', function(snapshot) {
		//alert('gameStatus? ' + snapshot.val());
		if(snapshot.val()==="pending" ){
			//Game is already initialized by Player 1, so assigned local player variable to P2 
			//alert('gameStatus? ' + snapshot.val().toString());
			player = 1; // 1 is P2
			//alert(player);
			$scope.tttData.$update({gameStatus: 'started'});
		}
		else if (snapshot.val()==="started"){
			player = 2; // 2 is a spectator
			alert("you are just a spectator!");
		} else{
			player = 0  // 0 is P1
			//alert(player);
			$scope.tttData.$update({gameStatus: 'pending'});
		}
		
	});
	
	$scope.tttData.$bind($scope,"board");

	$scope.tttData.gameboard = this.board;
	$scope.tttData.turn =0; //0=P1, 1=P2;
	$scope.tttData.winnerDeclared =false;
	//$scope.tttData.gameStatus =true;
	$scope.tttData.winnerIs ="";

	//$scope.tttData.$save("gameboard");
	//$scope.tttData.$update({winnerIs: ''});
	//$scope.tttData.$save("turn");
	//$scope.tttData.$save("winnerDeclared");
	//$scope.tttData.$save("gameStatus");
	
	//$scope.tttData.$update({gameStatus: 'true'});
	
	$scope.tttData.$on('change', function(){

		$scope.updateActivePad();
		$scope.updateCells();
		//check dead case OK
		//check win
		if ($scope.tttData.winnerIs === 'P1'){
			alert("From AngularFire: Player 1 is the winner!");
			$scope.tttData.$unbind();
		}
		else if ($scope.tttData.winnerIs === 'P2'){
			alert("From AngularFire: Player 2 is the winner!");
			$scope.tttData.$unbind();
		}
	});
	
	
	var checkColor = function(){
		alert("asdwsd");
	}
    this.isOccupy = function(cell){
        if (cell.ownBy===0)
			{return false;}
		else
			{return true;}
    };
	
	this.isWineerDeclared = function(){
		return $scope.tttData.winnerDeclared;
	};
	
	this.changePadPlayable = function(pad, row, col){
		//alert("row: " + row + ";  col: " + col);
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){
				if (boardRow== row && boardCol==col){
					if(this.checkPadFull(pad, row, col)===1){
						this.freeAllPads();
						return;
					}
					board[boardRow][boardCol][0][0].padActive = 1;
					$scope.tttData.gameboard[boardRow][boardCol][0][0].padActive=1;
					//$scope.tttData.$save('gameboard');
				}
				else {
					board[boardRow][boardCol][0][0].padActive = 0;
					$scope.tttData.gameboard[boardRow][boardCol][0][0].padActive=0;
					//$scope.tttData.$save('gameboard');
				}	
			}
		}
	};
	
	this.playable = function(pad){
		var padActive = pad[0][0].padActive;
		return padActive;
	};

	this.checkPadFull = function(pad, row, col){
		var cellCount=0;
		for(var padRow=0; padRow<3; padRow++){
			for(var padCol=0; padCol<3; padCol++){
				if ($scope.tttData.gameboard[row][col][padRow][padCol].ownBy === 0){
					//alert("pad " + row + ", " + col + "is not full!");
					return 0;
				}
				else{
					cellCount++;
				}
			}
		}
		//alert("pad " + row + ", " + col + " is full. : " + cellCount);
		//alert(cellCount);
		return cellCount==9? 1:0; 
	};
	
	
    this.cellOnClick = function(pad, row, col, row_p, col_p){
		if(this.playable(pad) && !(this.isWineerDeclared())){
			console.log("player: " + player);
			//console.log(this.turn_1);
			console.log("turn: " + $scope.tttData.turn);
			//Setting ownership
			if (this.isOccupy(pad[row][col])){
				alert("This is occupied!");
			}else{
				if($scope.tttData.turn === 0 && player===0){
					pad[row][col].Symbol="X";
					pad[row][col].ownBy=1;
					this.turn_1=false;
					$scope.tttData.turn =1;
					$scope.tttData.gameboard[row_p][col_p][row][col].ownBy=1;
					this.changePadPlayable(pad, row, col);
					$scope.tttData.$save("gameboard").then(function(){});
					$scope.tttData.$save("turn");
					
					//$scope.tttData.$update({name: 'alex'}).then(function(result){});
				}else if ($scope.tttData.turn === 1 && player=== 1){
					pad[row][col].Symbol="O";
					pad[row][col].ownBy=-1;
					this.turn_1=true;
					$scope.tttData.turn =0;
					$scope.tttData.gameboard[row_p][col_p][row][col].ownBy=-1;
					this.changePadPlayable(pad, row, col);
					$scope.tttData.$save("gameboard").then(function(){});
                    $scope.tttData.$save("turn");
					
					
				}
				//this.changePadPlayable(pad, row, col);
			}
			
			//var result = this.checkWin(pad);
			var localResult = this.checkWin(pad);
			this.bigPad[row_p][col_p].ownBy = localResult;
			var result = this.checkWin(this.bigPad);
			if (result===1){
				//alert("Player 1 wins!");
				this.winnerDeclared = true;
				//$scope.tttData.winnerDeclared = true;
				//$scope.tttData.$update({winnerIs: 'P1'});
				$scope.tttData.$update({winnerDeclared: true, winnerIs: 'P1'});
			}
			else if (result===-1){
				//alert("Player 2 wins!");
				this.winnerDeclared = true;
				//$scope.tttData.winnerDeclared = true;
				$scope.tttData.$update({winnerIs: 'P2'});
				$scope.tttData.$update({winnerDeclared: true});
			}
		} else if (this.playable(pad) && this.isWineerDeclared()){
			if (!this.isOccupy(pad[row][col])){
				this.changePadPlayable(pad, row, col);
			}
		}
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
	};
	
	this.rematch = function(){
		if (confirm("Rematch. Are you sure???")){
			for(var boardRow=0; boardRow<3; boardRow++){
				for(var boardCol=0; boardCol<3; boardCol++){			
					board[boardRow][boardCol][0][0].padActive = 1;
					$scope.tttData.gameboard[boardRow][boardCol][0][0].padActive=1;
					for(var cellRow=0; cellRow<3; cellRow++){
						for(var cellCol=0; cellCol<3; cellCol++){
							board[boardRow][boardCol][cellRow][cellCol].ownBy = 0;
							$scope.tttData.gameboard[boardRow][boardCol][cellRow][cellCol].ownBy=0;
						}
					}
				}
			}
			$scope.tttData.winnerDeclared= false;
			$scope.tttData.$save('winnerDeclared');
			$scope.tttData.$save('gameboard');
		}
	};
	
	this.freeAllPads = function(){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){			
				board[boardRow][boardCol][0][0].padActive = 1;
				$scope.tttData.gameboard[boardRow][boardCol][0][0].padActive = 1;
			}
		}
	};
	
	$scope.updateActivePad = function(){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){
				board[boardRow][boardCol][0][0].padActive = $scope.tttData.gameboard[boardRow][boardCol][0][0].padActive;
			}
		}
	};
	
	$scope.updateCells = function(){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){			

				for(var cellRow=0; cellRow<3; cellRow++){
					for(var cellCol=0; cellCol<3; cellCol++){
						//update cell occupations
						//if (board[boardRow][boardCol][cellRow][cellCol].ownBy != $scope.tttData.gameboard[boardRow][boardCol][cellRow][cellCol].ownBy){
							board[boardRow][boardCol][cellRow][cellCol].ownBy = $scope.tttData.gameboard[boardRow][boardCol][cellRow][cellCol].ownBy;
						//}
					}
				}
			}
		}
	};
	
});

app.controller('onlineController', function(){ 

	this.board  = board;
	this.bigPad = pad;
	this.turn_1 = true;
	this.winnerDeclared = false;
	var onlineCtrl = this;
	var server = io.connect("http://localhost:81");
	
    this.isOccupy = function(cell){
        if (cell.ownBy===0)
			{return false;}
		else
			{return true;}
    };

	this.changePadPlayable = function(row, col){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){
				if (boardRow==row && boardCol==col){
					this.board[boardRow][boardCol][0][0].padActive = 1;
				}
				else {
					this.board[boardRow][boardCol][0][0].padActive = 0;
				}
			}
		}
	};
	
	this.playable = function(pad){
		var padActive = pad[0][0].padActive;
		return padActive;
	};
	
	this.checkPadFull = function(pad){
		for(var padRow=0; padRow<3; padRow++){
			for(var padCol=0; padCol<3; padCol++){
				if (pad[padRow][padCol].ownBy === 0){
					return 0;
				}
			}
		}
		return 1; 
	};
	
	this.freeAllPads = function(){
		for(var boardRow=0; boardRow<3; boardRow++){
			for(var boardCol=0; boardCol<3; boardCol++){			
				this.board[boardRow][boardCol][0][0].padActive = 1;
			}
		}
	};
	
    this.cellOnClick = function(row, col, row_p, col_p){
		if(this.playable(this.board[row_p][col_p]) && !(this.winnerDeclared)){
			//Setting ownership
			if (this.isOccupy(this.board[row_p][col_p][row][col])){
				alert("This is occupied!");
			}else{
				if(this.turn_1){
					this.board[row_p][col_p][row][col].Symbol="X";
					this.board[row_p][col_p][row][col].ownBy=1;
					this.turn_1=false;
				}else {
					this.board[row_p][col_p][row][col].Symbol="O";
					this.board[row_p][col_p][row][col].ownBy=-1;
					this.turn_1=true;
				}
				
				//Send to server
				server.emit('orderFromClient', {row: row, col: col, row_p: row_p, col_p: col_p}, function(err, data){});
				
				//Switching pads
				this.changePadPlayable(row, col);
				//If full, choose pads freely
				if (this.checkPadFull(this.board[row_p][col_p])===1){
					this.freeAllPads();
				}
			}
			
			//var result = this.checkWin(pad);
			var localResult = this.checkWin(this.board[row_p][col_p]);
			this.bigPad[row_p][col_p].ownBy = localResult;
			var result = this.checkWin(this.bigPad);
			if (result===1){
				alert("Player 1 wins!");
				this.winnerDeclared = true;
				this.changePadPlayable(-1, -1);
			}
			else if (result===-1){
				alert("Player 2 wins!");
				this.winnerDeclared = true;
				this.changePadPlayable(-1, -1);
			}
		}
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
	};
	
	this.rematch = function(showAlert){
		var rematchConfirm = false;
		if (showAlert){
			rematchConfirm = confirm("Rematch. Are you sure?");
		}else{
			rematchConfirm = true;
			//this.server.close();
		}
	
		if (rematchConfirm){
			for(var boardRow=0; boardRow<3; boardRow++){
				for(var boardCol=0; boardCol<3; boardCol++){
					for(var cellRow=0; cellRow<3; cellRow++){
						for(var cellCol=0; cellCol<3; cellCol++){
							this.board[boardRow][boardCol][cellRow][cellCol].ownBy = 0;
						}
					}
					this.bigPad[boardRow][boardCol].ownBy = 0;
				}
			}
			this.winnerDeclared = false;
			this.turn_1=true;
			this.freeAllPads();
		}
	};
	
	this.debug = function() {
		console.log(this.bigPad[0][0].ownBy +" "+ this.bigPad[0][1].ownBy +" "+ this.bigPad[0][2].ownBy);
		console.log(this.bigPad[1][0].ownBy +" "+ this.bigPad[1][1].ownBy +" "+ this.bigPad[1][2].ownBy);
		console.log(this.bigPad[2][0].ownBy +" "+ this.bigPad[2][1].ownBy +" "+ this.bigPad[2][2].ownBy);
	};
	

	server.on('connect', function(data) {
		onlineCtrl.changePadPlayable(-1, -1);
		var username = prompt("Please enter your name","Harry Potter");
		server.emit('join', username, function(err, data){});
	});
	
	server.on('loginSuccess', function(){
		onlineCtrl.freeAllPads();
	});
	
	server.on('orderToClient', function (order) {
		onlineCtrl.cellOnClick(order.row, order.col, order.row_p, order.col_p);
	});
	
});



{var pad = [
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
];}
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