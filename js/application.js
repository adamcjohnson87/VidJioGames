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
			noGames = '<li id="noGames">You have no games in your library!</li>',
			$row = "<p id='gridvalues'>VALUE</p>"

		app.init = function(){
			app.bindings();
            app.checkForStorage(); 
		};

		app.bindings = function(){
			//Button to add a game to the local storage from the add page. 
			$('#btnAddGame').on('click', function(e){
				e.preventDefault();
				if($('#name').val() !== "" && $('#name').val() !== undefined){
					console.log("test")
					app.addGame(
						$('#name').val(),					
						$('#category').val(),
						$('#rating').val(),
						$('#gameinfo').val()
					);
				} else{
					alert("Enter game information to add the game!");
				}
			});
			//List selection to populate a panel with the game information on the info page. 
			$(document).on('click', '#gamelist a', function(e){
				e.preventDefault();
				$("#panelinfo").show();
				app.loadGame($(this).data('name'));
			});
			//On combox box change on the top page grid control. 
			$("#category").change(function () {
				var end = this.value;
				app.gridset(end);
			});
			//Deletes a game from the local storage, found in the panel dynamically created for the info page.
			$(document).on('click', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('name');
				app.deleteGame(key.tostr);
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
			$("#gameadd").popup('open');
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
			app.gridset("all"); //Populating Top page grid. 
			app.dropdown(); //Populating dropdown menu on top page.
		};

		app.gridset = function(category){
			var gamesObj = app.getGames(),
			htmlname = '',
			htmlrating = '',
			htmlcategory = '',
			htmluser = '',
			i;
			category = (category).toLowerCase();
			console.log(category)
			for(i = 0; i < gamesObj.games.length; i++){ //Emptying grid elements. 
				$("#gridvalues").remove();
				$("#gridvalues").remove();
				$("#gridvalues").remove();
				$("#gridvalues").remove();
			}
			for(i = 0; i < gamesObj.games.length; i++){
				if(gamesObj.games[i].category === category || category === "all"){
					htmlname += $row.replace('VALUE', gamesObj.games[i].name);
					htmlrating += $row.replace('VALUE', gamesObj.games[i].rating);
					htmlcategory += $row.replace('VALUE', gamesObj.games[i].category);
					htmluser += $row.replace('VALUE', "User");
				}
			}
			$("#gridname").append(htmlname).enhanceWithin();
			$("#gridrating").append(htmlrating).enhanceWithin();
			$("#gridcategory").append(htmlcategory).enhanceWithin();
			$("#gridadd").append(htmluser).enhanceWithin();
		}

		app.dropdown = function(){
			var options = ["Shooter","RPG","Action","Horror", "Adventure","Sports",
						  "Racing","Strategy","Simulation","Puzzel","Platformer",
						  "Fighting","Rhythm", "MMO", "VR"],		
				defaultoption = '<option id="catchange" data-name="$NAME" selected>VALUE</option>',		
				option = '<option id="catchange" data-name="$NAME">VALUE</option>',
				i;
				$("#category").append(defaultoption.replace('$NAME', 'all').replace('VALUE', "All")).enhanceWithin().selectmenu('refresh', true);
			for(i = 0; i < options.length; i++){
				$("#category").append(option.replace('$NAME', options[i]).replace('VALUE', options[i])).enhanceWithin();
			}
		}

		app.deleteGame = function(key){
			var gamesObj = app.getGames(),	
			removeIndex = gamesObj.games.map(function(item) { return item.name; }).indexOf(key);
			gamesObj.games.splice(removeIndex, 1);	
			localStorage['Library'] = JSON.stringify(gamesObj);
			$("#panelinfo").hide();
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