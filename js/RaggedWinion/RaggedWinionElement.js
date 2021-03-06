/**
 * 
 */
function RaggedWinionElement(
	resistencia
	, imagenSRC
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
					img.src = "src/" + imagenSRC +"A.png";
					break;
				case 1:
					img.src = "src/" + imagenSRC +"B.png";
					break;
				case 2:
					img.src = "src/" + imagenSRC +"C.png";
					break;
				case 3:
					img.src = "src/" + imagenSRC +"B.png";
					break;
			}
		}
		
		if(img != null){
			if(mortal){
				var icono = new Image();
				if(resistencia + velocidadHorizontal <= 10){
					icono.src = "src/esfera10.png";
				}
				else if(resistencia + velocidadHorizontal <= 12){
					icono.src = "src/esfera12.png";
				}
				else if(resistencia + velocidadHorizontal <= 14){
					icono.src = "src/esfera14.png";
				}
				else if(resistencia + velocidadHorizontal <= 16){
					icono.src = "src/esfera16.png";
				}
				else if(resistencia + velocidadHorizontal <= 18){
					icono.src = "src/esfera18.png";
				}
				else if(resistencia + velocidadHorizontal <= 20){
					icono.src = "src/esfera20.png";
				}
				else{
					icono.src = "src/esfera21.png";
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