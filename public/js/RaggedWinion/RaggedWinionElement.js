/**
 * 
 */
function RaggedWinionElement(
	resistencia
	, imagenElemento
	, fechaAparicion
	, alturaInicial
	, alto
	, ancho
	, solido
	, mortal
	, velocidadHorizontal
	, velocidadVertical
){
	/******* CONSTRUCTOR *******/	
	
	/**Atributos - Atributes**/
	var recorrido = 0;
	var destruido = false;
	var fechaDestruccion = null;
	var fechaSalto = null;
	var fechaDisparo = null;
	var subiendo = false;
	var altura = alturaInicial;
	
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
	 * @param fechaActual integer
	 */
	this.dibujar = function(contexto, anchoPantalla, zoom, fps, fechaActual){
		var img = null;
		
		if(!destruido){
			img = new Image();
			switch(parseInt((fechaActual - fechaAparicion) * (velocidadHorizontal +1) /800) % 4){
				case 0:
					img = document.getElementById(imagenElemento +"A");
					break;
				case 1:
					img = document.getElementById(imagenElemento +"B");
					break;
				case 2:
					img = document.getElementById(imagenElemento +"C");
					break;
				case 3:
					img = document.getElementById(imagenElemento +"B");
					break;
			}
		}
		
		if(img != null){
			if(mortal){
				var icono = new Image();
				if(resistencia + velocidadHorizontal <= 10){
					icono = document.getElementById("esfera10");
				}
				else if(resistencia + velocidadHorizontal <= 12){
					icono = document.getElementById("esfera12");
				}
				else if(resistencia + velocidadHorizontal <= 14){
					icono = document.getElementById("esfera14");
				}
				else if(resistencia + velocidadHorizontal <= 16){
					icono = document.getElementById("esfera16");
				}
				else if(resistencia + velocidadHorizontal <= 18){
					icono = document.getElementById("esfera18");
				}
				else if(resistencia + velocidadHorizontal <= 20){
					icono = document.getElementById("esfera20");
				}
				else{
					icono = document.getElementById("esfera21");
				}
				
				if(icono != null){
					contexto.drawImage(
						icono
						, parseInt((anchoPantalla - recorrido + ancho) * zoom)
						, parseInt((altura - 86)*zoom)
						, 60*zoom
						, 60*zoom
					);
				}
			}
			contexto.drawImage(img, parseInt((anchoPantalla - recorrido)*zoom), parseInt((altura-20)*zoom), ancho*zoom, alto*zoom);
		}
	};
	
	
	/**
	 * Método que mueve el elemento.
	 */
	this.avanzar = function(avanzado, altoPantalla){
		recorrido += avanzado + velocidadHorizontal;
		
		if(subiendo){
			altura -= velocidadVertical;
		}
		
		else{

			altura += velocidadVertical;
		}
		
		if(altura <= 0){
			subiendo = false;
			altura == 0;
		}
		
		if(altura >= altoPantalla){
			subiendo = true;
			altura == altoPantalla;
		}
	};
	
	
	/**
	 * Función que retorna la altura maxima y minima del elemento.
	 */
	this.getPosicion = function(anchoPantalla){
		return {superior: altura, inferior: altura+alto, derecha: anchoPantalla-recorrido+ancho, izquierda: anchoPantalla-recorrido};
	};

	
	/**
	 * Función que devuelve true si el elemento es solido.
	 */
	this.getSolido = function(){
		return solido;
	};

	
	/**
	 * Función que devuelve true si el elemento es mortal.
	 */
	this.getMortal = function(velocidad){
		if(velocidad >= resistencia + velocidadHorizontal){
			destruido = true;
			return false;
		}
		else{
			return mortal;
		}
	};
	
	
	/**
	 * Método que mueve el elemento.
	 */
	this.estaFuera = function(anchoPantalla){
		if(destruido){
			return true;
		}
		
		else if(anchoPantalla + 5 * ancho - recorrido <= 0){
			return true;
		}
		
		else{
			return false;
		}
	};
};