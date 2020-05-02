$(function(){
	//Function for local storage. Lets the user store and display there game library.
	var Library = {};

	(function(app){
		var $name = $('#name'),
			$gameinfo = $('#gameinfo'),
			$ul = $('#gamelist'),
			$ul2 = $('#gamelist2'),
			$delete = '<a id="btnDelete" href="" data-href="ID" data-name="$NAME" data-role="button">Delete</a>',
			li = '<li><a href="#rightpanel" id="panelinfo" data-name="$NAME">ID</a></li>',
			li2 = '<li>ID</li>',
			noGames = '<li id="noGames">You have no games in your library!</li>';

		app.init = function(){
			app.bindings();
            app.checkForStorage(); 
		};

		app.bindings = function(){
			$('#btnAddGame').on('click', function(e){
				e.preventDefault();
				app.addGame(
					$('#name').val(),					
					$('#category').val(),
					$('#rating').val(),
					$('#gameinfo').val()
				);
			});

			$(document).on('click', '#gamelist a', function(e){
				e.preventDefault();
				app.loadGame($(this).data('name'));
			});

			$(document).on('click', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('name');
				app.deleteGame(key);
			});
		};

		app.loadGame = function(name){
			var gamesObj = app.getGames(),
			game = gamesObj.games.filter(g => g.name === name)[0],
			gamestring = "Category: " + game.category + "<br><br> Scored: " + game.rating + "<br><br>" + game.gameInfo;
			$('#name').html(game.name);
			$('#gameinfo').html(gamestring);	
			$("#btnDelete").remove();
			$("#panelinfo").append($delete.replace('$NAME', name)).enhanceWithin();
		};

		app.addGame = function (name, category, rating, gameInfo){
			var gamesObj = localStorage['Library'];
			if (gamesObj) {
				gamesObj = JSON.parse(gamesObj);
			}
			var game = {};
			if (!gamesObj) {
				gamesObj = {games: []}
				game.name = name;
				game.category = category;
				game.rating = rating;
				game.gameInfo = gameInfo;
				gamesObj.games.push(game);
			} else {
				game = {};
				if (gamesObj.games.filter(g => g.name === name).length > 0) {
					game = gamesObj.games.filter(g => g.name === name)[0];
					game.category = category;
					game.rating = rating;
					game.gameInfo = gameInfo;
				} else {
					game = {
						name: name,
						category: category,
						rating: rating,
						gameInfo: gameInfo
					}
				}
				gamesObj.games = gamesObj.games.filter(g => g.name !== name);
				gamesObj.games.push(game)
			}
			localStorage['Library'] = JSON.stringify(gamesObj);
			$name.val('');
			$gameinfo.val('');
		  };

		app.getGames = function(){
			var gamesObj = localStorage['Library'];			
			if(gamesObj) return JSON.parse(gamesObj);			
			return [];
		};

		app.displayGames = function(){
			var gamesObj = app.getGames(),
				html = '',
				html2 = '',
				i,
				name;
			for(i = 0; i < gamesObj.games.length; i++){
				name = gamesObj.games[i].name;
				html += li.replace('$NAME', name).replace('ID', name)
				html2 += li2.replace(/ID/g,name.replace(/-/g,' ')).replace(/LINK/g,name);
			}		
			$ul.html(html).listview('refresh'); //Game Info Page.
			$ul2.html(html2).listview('refresh'); //Library page.
		};

		app.deleteGame = function(key){
			var gamesObj = app.getGames(),	
			removeIndex = gamesObj.games.map(function(item) { return item.name; }).indexOf(key);
			gamesObj.games.splice(removeIndex, 1);	
			localStorage['Library'] = JSON.stringify(gamesObj);
			app.checkForStorage();
		};

		app.checkForStorage = function(){
			var gamesObj = app.getGames();
			if (!$.isEmptyObject(gamesObj)) {
				app.displayGames();
			} else {
				$ul.html(noGames).listview('refresh');  //Game Info Page.
				$ul2.html(noGames).listview('refresh'); //Library page.
			}
		};

		app.init();

	})(Library);
});