/**
 * Función que da diseño responsive de videojuego a una página web.
 * Function that gives responsive videogame design to a web page.
 * 
 * @param pantalla Element - Elemento que contiene el juego.
 */
function GamingInterface(pantalla){
	/**************************************************************************************************************
	 * CONSTRUCTOR DEL OBJETO
	 * OBJETC CONSTRUCTOR
	 */
	/**Atributes**/
	var 
		anchoPagina
		,altoPagina
		,anchoPantalla
		,altoPantalla
		,medidaMargen = 100
		,relacionDimensiones = 60/100
	;
	
	/**Methods**/
	adaptar();
	
	/**Asignación de Eventos - Event Asignation**/
	window.onresize = adaptar;
	
	/**
	 * FIN DEL CONSTRUCTOR
	 * CONSTRUCTOR END
	 **************************************************************************************************************/
	
	/**
	 * Función que redimensiona la caja del videojuego.
	 * Function thar resize game box.
	 */
	function adaptar(){
		/**
		 * Comprobamos las dimensiones de la página.
		 * We check page's dimensions.
		 */
		altoPagina = window.innerHeight;
		anchoPagina = window.innerWidth;
		
		if((anchoPagina + medidaMargen) < altoPagina / relacionDimensiones){
			anchoPantalla = anchoPagina - medidaMargen;
			altoPantalla = anchoPantalla * relacionDimensiones;

			pantalla.style.width = anchoPantalla+"px";
			pantalla.style.height = altoPantalla+"px";
		}
		
		else{
			altoPantalla =  altoPagina - medidaMargen;
			anchoPantalla = altoPantalla / relacionDimensiones;

			pantalla.style.width = anchoPantalla+"px";
			pantalla.style.height = altoPantalla+"px";
		}
	};
};