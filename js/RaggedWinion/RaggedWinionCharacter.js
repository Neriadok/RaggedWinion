/**
 * 
 */
function RaggedWinionCharacter(
	imagenSRC
	, anchoPantalla
	, altoPantalla
){
	/******* CONSTRUCTOR *******/	
	
	/**Atributos - Atributes**/
	var gravedad = 10;
	var ancho = 75;
	var alto = 100;
	var jugando = false;
	var eliminado = false;
	var fotogramaDestruccion = false;
	var fotogramaSalto = false;
	var fotogramaDisparo = false;
	var altura = 100;
	var latitud = anchoPantalla / 5;
	var apoyado = false;
	var saltando = false;
	var dobleSalto = false;
	var alturaSalto = null;
	
	/**Funciones de Inicio - Onload functions**/
	
	/**Asignacion de Eventos - Events' Asignations**/
	
	/**Registro - Logs**/
	
	
	/******* FIN DEL CONSTRUCTOR *******/
	
	
	
	
	/**
	 * Método que dibuja el elemento.
	 * Method which draws the element.
	 * 
	 * @param contexto Canvas Context
	 * @param anchoPantalla integer
	 * @param zoom integer
	 * @param fotogramaActual integer
	 */
	this.dibujar = function(contexto, zoom, fps, fechaActual, velocidad){
		var img = null;
		
		if(jugando && !eliminado){
			img = new Image();
			
			if(saltando){
				img.src = "src/" + imagenSRC +"Saltando.png";
			}
			
			else if(!apoyado){
				img.src = "src/" + imagenSRC +"Cayendo.png";
			}

			else{
				switch(parseInt((fechaActual) * velocidad / 1000) % 6){
					case 0:
						img.src = "src/" + imagenSRC +"1.png";
						break;
						
					case 1:
						img.src = "src/" + imagenSRC +"2.png";
						break;
						
					case 2:
						img.src = "src/" + imagenSRC +"3.png";
						break;
						
					case 3:
						img.src = "src/" + imagenSRC +"4.png";
						break;
						
					case 4:
						img.src = "src/" + imagenSRC +"5.png";
						break;
						
					case 5:
						img.src = "src/" + imagenSRC +"6.png";
						break;
					
					default: 
						img.src = "src/" + imagenSRC +"1.png";
				}
			}
			
			contexto.drawImage(img, parseInt(latitud *zoom), parseInt(altura * zoom), ancho*zoom, alto*zoom);
		}
	};
	
	
	/**
	 * Función que hace que el personaje aparezca.
	 */
	this.tocarSuelo = function(valor, altoPantalla){
		apoyado = valor;
		
		if(saltando){
			altura -= 20;
			
			if(altura <= alturaSalto){
				altura == alturaSalto;
				saltando = false;
			}
		}
		
		else if(!apoyado){
			
			altura += gravedad;
			
			if(altura > altoPantalla){
				this.eliminar();
			}
			
		}
		
		else{
			dobleSalto = false;
		}
	};
	
	
	/**
	 * 
	 */
	this.aparecer = function (){
		jugando = true;
		altura = 100;
	};
	
	
	/**
	 * 
	 */
	this.saltar = function (velocidad, altoPantalla){
		if(apoyado){
			saltando = true;
			dobleSalto = true;
			alturaSalto = altura - velocidad * altoPantalla / 40;
		}
		else if(dobleSalto){
			saltando = true;
			altura -= 50;
			alturaSalto = altura - velocidad * altoPantalla / 40;
			dobleSalto = false;
		}
	};
	
	
	/**
	 * 
	 */
	this.bajar = function (altoPantalla){
		if(apoyado && altura < altoPantalla - alto - 50){
			apoyado = false;
			altura += gravedad;
		}
	};
	
	
	/**
	 * Función que retorna la altura de los pies y la cabeza del personaje.
	 */
	this.getPosicion = function(){
		return {cabeza: altura, pies: altura+alto, cara: latitud+ancho, espalda: latitud};
	};
	
	
	/**
	 * Función que elimina al personaje.
	 */
	this.eliminar = function(){
		console.log("Eliminado? "+eliminado);
		eliminado = true;
	};
	
	
	/**
	 * Función que retorna true si el personaje esta eliminado.
	 */
	this.getEliminado = function(){
		return eliminado;
	};
};