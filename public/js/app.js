angular

/**
 * Modulo
 */
.module('ionicApp', ['ionic'])

/**
 * Controlador principal
 * El controlador principal, alte
 */
 .controller("MainCtrl",MainCtrl)
 .controller("GameCtrl",GameCtrl)


/**
 * Configuración Primer state provider.
 */
.config(function($stateProvider,$urlRouterProvider){
  $stateProvider

  .state('Intro', {
    url: "/",
    templateUrl: "./templates/intro.html",
    controller: 'MainCtrl'
  })
  
  .state('Game', {
    url: "/Game",
    templateUrl: "./templates/game.html",
    controller: 'GameCtrl'
  })
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});

function MainCtrl($scope){
	console.log("Welcome Ragged Winion!");
};

function GameCtrl($scope){
	console.log("Inicializando el juego!");
	

	interfaz = new GamingInterface(
		document.getElementById("pantalla")
	);
	
	var juego = new RaggedWinionGame(
		document.getElementById("pantalla")
		,document.getElementById("video")
	);
};