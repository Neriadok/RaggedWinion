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
	 * @param fps integer
	 * @param fechaActual integer
	 * @param velocidad integer
	 */
	this.dibujar = function(contexto, zoom, fps, fechaActual, velocidad){
		var img = null;
		
		if(jugando && !eliminado){
			img = new Image();
			
			if(saltando){
				img = document.getElementById(imagenSRC +"Saltando");
			}
			
			else if(!apoyado){
				img = document.getElementById(imagenSRC +"Cayendo");
			}

			else{
				switch(parseInt((fechaActual) * velocidad / 1000) % 6){
					case 0:
						img = document.getElementById(imagenSRC +"1");
						break;
						
					case 1:
						img = document.getElementById(imagenSRC +"2");
						break;
						
					case 2:
						img = document.getElementById(imagenSRC +"3");
						break;
						
					case 3:
						img = document.getElementById(imagenSRC +"4");
						break;
						
					case 4:
						img = document.getElementById(imagenSRC +"5");
						break;
						
					case 5:
						img = document.getElementById(imagenSRC +"6");
						break;
					
					default: 
						img = document.getElementById(imagenSRC +"1");
				}
			}
			
			contexto.drawImage(img, parseInt(latitud *zoom), parseInt(altura * zoom), ancho*zoom, alto*zoom);
		}
	};
	
	
	/**
	 * Método que evalua si el personaje está apoyado o en el aire.
	 * Method which evaluates if the character is on the floor or in the air.
	 * 
	 * @param valor boolean
	 * @param altoPantalla integer
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
	 * Método que hace aparecer al personaje.
	 * Method which makes the character apears.
	 */
	this.aparecer = function (){
		jugando = true;
		altura = 100;
	};
	
	
	/**
	 * Método que permite al personaje saltar.
	 * Method which alows the character jump.
	 * 
	 * @param velocidad integer
	 * @param altoPantalla integer
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
	 * Método que permite al personaje bajar de un apoyo.
	 * Method which alows the character drop himself from somewhere.
	 * 
	 * @param altoPantalla integer
	 */
	this.bajar = function (altoPantalla){
		if(apoyado && altura < altoPantalla - alto - 50){
			apoyado = false;
			altura += gravedad;
		}
	};
	
	
	/**
	 * Método que retorna las lineas limite del personajes.
	 * Method which returns the character's limit lines.
	 */
	this.getPosicion = function(){
		return {cabeza: altura, pies: altura+alto, cara: latitud+ancho, espalda: latitud};
	};
	
	
	/**
	 * Método que elimina al personaje.
	 * Method which terminate the character.
	 */
	this.eliminar = function(){
		console.log("Eliminado");
		eliminado = true;
	};
	
	
	/**
	 * Método que retorna true si el personaje esta eliminado.
	 * Method which returns true if the characte is terminated.
	 */
	this.getEliminado = function(){
		return eliminado;
	};
};