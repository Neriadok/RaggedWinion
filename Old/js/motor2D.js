/**
 * Librería de funciones para la gestión de coordenadas 2D.
 * Library of functions for 2D.
 */


/*********************************************COORDENADAS************************************************/
/**
 * Función que obtiene la posicion absoluta de un elemento respecto a la pagina.
 * Function that finds an element absolute position related to the page.
 * 
 * @param element Element
 * @return vector bidimensional con las coordenadas (x,y).
 */
function posicionElemento(element){
	/**
	 * Definimos un punto (x,y).
	 * We set an (x,y) point.
	 */
	var pos = { x: element.offsetLeft, y: element.offsetTop };
	
	/**
	 * Si el elemento tiene padre, sumamos la posición del padre.
	 * If this element has a father we add it's father position.
	 */
	if (element.offsetParent) {
		var tmp =  posicionElemento(element.offsetParent);
		pos.x += tmp.x;
		pos.y += tmp.y;
	}
	return pos;
};


/**
 * Función que comprueba si un valor está entre otros dos.
 */
function valorEstaEntreValores(valorEvaluado, valor1, valor2){
	if(
		valorEvaluado < valor1 
		&& valorEvaluado > valor2
		||
		valorEvaluado > valor1 
		&& valorEvaluado < valor2
	){
		return true;
	}
	
	else{
		return false
	}
};





/**********************************************FOTOGRAMAS**************************************************/
/**
 * 
 */
var ContadorFPS = function(canvas, fps){

	console.log('Modulo de FPS cargado...');
 
	var fotogramasSegundo = 0;
	var currentFps = 0;
	var ciclosDeRegistro = 1 / fps * 1000;
	var lastFps = new Date().getTime();
	 
	if ( canvas && canvas.getContext ){
		setInterval(
			function(){ 
				update();
				fotogramasSegundo++;
			}
			, ciclosDeRegistro
		);
    }

	else{
		console.warn('Objeto canvas no encontrado o navegador no soportado!');
	}
 
	/**
	 * 
	 */
	 function update(){
		// Calculamos el tiempo desde el último frame.
		var thisFrame = new Date().getTime(),
		diffTime = Math.ceil((thisFrame - lastFps));
	 
		if (diffTime >= 1000) {
			currentFps = fotogramasSegundo;
			fotogramasSegundo = 0.0;
			lastFps = thisFrame;
			console.log(canvas.id + "FPS: " + currentFps + "/" + fps);
		}
	};
	
	
	/**
	 * Función que retorna el numero de FPSs reales de un elemento Canvas
	 */
	this.getRealFps = function(){
		return currentFps;
	};
};