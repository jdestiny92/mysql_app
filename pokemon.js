var Pokedex = require('pokedex-promise-v2');
var inquirer = require('inquirer');
var mysql = require('mysql');
var P = new Pokedex();
var connection = mysql.createConnection({
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "jpmfic6bzhhzeyjd", //Your username//
    password: "az0rql713ckr5hef", //Your password//
    database: "jycxtsgajvvqqqrx"
})
var pokemon;

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    
})

function updateTable(){
	//console.log(pokemon);
	connection.query('INSERT INTO pokemon (name) VALUES (?)', pokemon, function(err, result){
		if (err) throw err;
	})
}

function catchPokemon(){
	var result;
	var decision = Math.floor(Math.random() * 2);
	if(decision == 0){
		result = false;
	}
	else{
		result = true;
	}
	if(!result){
		console.log("--------------------------------------------------------");
		console.log('Sorry, it broke out of the Pokeball and ran away');
		console.log("--------------------------------------------------------");
		start();
	}
	else{
		console.log("--------------------------------------------------------");
		console.log('Congratulations! You caught it!');
		console.log("--------------------------------------------------------");
		updateTable();
		start();
	}
}

function encounter(){

var random = Math.floor(Math.random() * 700);

P.getPokemonByName(random, function(response, error) { // with callback
      if(!error) {
      	pokemon = response.name;
      	console.log("--------------------------------------------------------");
        console.log('A random ' + response.name + ' appeared!');
        console.log("--------------------------------------------------------");

        inquirer.prompt([{
        	type: 'confirm',
        	name: 'boolean',
        	message: 'Would you like to try and catch it?'
        }]).then(function (choice){
        	//console.log(choice);
        	if(choice.boolean){
        		//run probablity/catching function
        		catchPokemon();
        	}
        })
      } else {
        console.log(error)
      }
    });

};

function start(){

	inquirer.prompt([{
		type: 'list',
		name: 'decision', 
		message: 'What would you like to do?',
		choices: [
			'search for pokemon',
			'open my inventory']
	}]).then(function (choice){
		//console.log(choice);

		if(choice.decision == 'search for pokemon'){
			encounter();
		}
		if(choice.decision == 'open my inventory'){
			connection.query('SELECT * FROM pokemon;', function(err, data){
				if (err) throw err;
				console.log("--------------------------------------------------------");
				for(i=0; i<data.length; i++){
					console.log(data[i].name);
				}
				console.log("--------------------------------------------------------");
				start();
			});

		}
	})
}

start();