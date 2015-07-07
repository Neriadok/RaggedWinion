/**
 * 
 * @param pantalla
 * @param video
 */
function RaggedWinionGame(
	pantalla
	,video
){
	/******* CONSTRUCTOR *******/	
	
	/**Atributos - Atributes**/
	var relacionDimensiones = 75/100;
	var zoom = 1;
	var ancho = 1000;
	var alto = ancho * relacionDimensiones;
	
	var fps = 40;
	var fpsRealesVideo = fps;
	var fotogramas = 0;
	
	var ciclo = 20;
	var velocidadMax = 20;
	var velocidadMin = 10;
	var velocidad = velocidadMin;
	var aceleracion = 2;
	var inicio = false;
	var pausa = true;
	var puntuacion = 0;
	
	var fechaUltimoFotograma = new Date().getTime();
	var fechaInicio = fechaUltimoFotograma;
	var fechaUltimaPausa = null;
	var tiempoEnPausa = 0;

	var red = 100;
	var blue = 255;
	var green = 100;
	var bgColor = "rgb("+ red +","+ green +","+ blue +")";

	var personaje = new RaggedWinionCharacter("personaje", ancho);
	var elementos = [];

	pantalla.style.zIndex = "1";
	video.style.zIndex = "2";
	var contextoVideo = video.getContext("2d");
	var contadorFpsVideo = new ContadorFPS(video, fps);
	
	
	/**Funciones de Inicio - Onload functions**/
	redimensionar();
	
	/**Asignacion de Eventos - Events' Asignations**/
	document.onkeydown = verificarTecla;
	
	/**Registro - Logs**/
	console.log("fps: "+fps);
	console.log("ancho: "+ancho);
	console.log("zoom: "+zoom);
	console.log("bgColor: "+bgColor);
	
	/**Ciclo de Juego - Game interval*/
	var cicloComprobar = setInterval(
		function (){
			redimensionar();
			if(personaje.getEliminado()){
				video.style.backgroundColor = "rgb(90,20,20)";
				texto("GAME OVER (esc)");
				subTextoDer(puntuacion+" puntos");
			}
			
			else if(!pausa){
				nuevoCiclo();
			}
			
			else{
				video.style.backgroundColor = "rgb(10,20,20)";
				texto("Pulsa 'Enter' para continuar");
				subTextoDer(puntuacion+" puntos");
			}
		}
		,1000 / fps / 2
	);
	
	/******* FIN DEL CONSTRUCTOR *******/
	

	
	function nuevoCiclo(){
		var fechaActual = new Date().getTime();
		var tiempoEntreFotogramas = Math.ceil(fechaActual - fechaUltimoFotograma);
		var tiempoDesdeInicio = Math.ceil(fechaActual - fechaInicio - tiempoEnPausa);
		
		cambiarColor(tiempoDesdeInicio);
		
		if(tiempoEntreFotogramas >= 1000 /fps){
			fechaUltimoFotograma = fechaActual;
		}

		if(tiempoEntreFotogramas >= ciclo){
			eventos(tiempoDesdeInicio);
		}
		
		if(tiempoDesdeInicio < 5000){
			velocidad = velocidadMin;
			video.style.backgroundColor = "rgb(10,20,20)";
			texto("Espera "+parseInt((5000 - tiempoDesdeInicio) / 1000)+" segundos...");
		}
		else if(tiempoDesdeInicio >= 5000 && tiempoDesdeInicio < 5050){
			video.style.backgroundColor = "rgb(10,20,20)";
		}
		
		else{
			video.style.backgroundColor = "transparent";

			dibujar(tiempoDesdeInicio);
		}
		
		supTextoDer("Nivel "+parseInt((tiempoDesdeInicio / 60000)+1));
		subTextoDer(puntuacion+" puntos")
	};
	
	/**
	 * Función que realiza los eventos pertinentes del fotograma actual.
	 */
	function eventos(tiempoDesdeInicio){
		/**Eventos de nivel**/
		if(tiempoDesdeInicio >= 60000 * 2){
			nivel3(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio>= 60000 && tiempoDesdeInicio < 60000 * 2){
			nivel2(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= 8000 && tiempoDesdeInicio < 60000){
			nivel1(tiempoDesdeInicio);
		}
		
		else{
			nivel0(tiempoDesdeInicio);
		}

		/**Elementos**/
		for(var i = 0; i < elementos.length; i++){
			elementos[i].avanzar(velocidad, alto);
			
			if(elementos[i].estaFuera(ancho)){
				elementos.splice(i,1);
			}
		}
		
		/***Personaje***/
		if(tiempoDesdeInicio >= 5050){
			personaje.tocarSuelo(verificarApoyo(), alto);
			
			if(verificarColisionMortal()){
				personaje.eliminar();
			}
		}
		else if(tiempoDesdeInicio >= 5000 && tiempoDesdeInicio < 5050){
			personaje.aparecer();
		}
	};
	
	
	/**
	 * Función que dibuja el fotograma actual.
	 */
	function dibujar(tiempoDesdeInicio){
		for(var i = 0; i < elementos.length; i++){
			elementos[i].dibujar(contextoVideo, ancho, zoom, fps, tiempoDesdeInicio);
		}

		personaje.dibujar(contextoVideo, zoom, fps, tiempoDesdeInicio, velocidad);
	};
	
	
	/**
	 * Función que muestra un texto en el contexto de animaciones
	 * Function that shows a text in animation context
	 */
	function texto(contenido){
		contextoVideo.font = (40*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "orange";
		contextoVideo.textAlign = "center";
		contextoVideo.fillText(contenido, ancho*zoom/2, alto*zoom/2);
	};
	
	
	/**
	 * Función que muestra un texto en el contexto de animaciones
	 * Function that shows a text in animation context
	 */
	function supTextoDer(contenido){
		contextoVideo.font = (40*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "white";
		contextoVideo.textAlign = "right";
		contextoVideo.fillText(contenido, (ancho-40)*zoom, 40*zoom);
	};
	
	
	/**
	 * Función que muestra un texto en el contexto de animaciones
	 * Function that shows a text in animation context
	 */
	function subTextoDer(contenido){
		contextoVideo.font = (20*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "white";
		contextoVideo.textAlign = "right";
		contextoVideo.fillText(contenido, (ancho-40)*zoom, 70*zoom);
	};
	
	
	/**
	 * Función que altera el color gradualmente.
	 * Function that change color gradually.
	 */
	function cambiarColor(tiempoDesdeInicio){
		var azulInicial = 255;
		var rojoInicial = 100;
		var verdeInicial = 100;
		var velocidadCambioColor = (10 * 60 * 1000) / (azulInicial + rojoInicial);
		
		blue = azulInicial - parseInt(tiempoDesdeInicio / velocidadCambioColor);
		
		
		if(blue < 0){
			blue = 0;
		}
		
		if(blue <= verdeInicial){
			green = verdeInicial - parseInt((tiempoDesdeInicio - velocidadCambioColor * (azulInicial - verdeInicial)) / velocidadCambioColor);
		}
		
		if(green < 0){
			green = 0;
		}
		
		if(green == 0){
			red = rojoInicial - parseInt((tiempoDesdeInicio - velocidadCambioColor * (azulInicial)) / velocidadCambioColor);
		}
		
		if(red < 0){
			red = 0;
		}
		
		bgColor = "rgba("+ red +","+ green +","+ blue +", 1)";
		
		pantalla.style.backgroundColor = bgColor;
	};
	
	
	/**
	 * Función que comprueba si el personaje está apoyado.
	 */
	function verificarApoyo(){
		for(var i = 0; i < elementos.length; i++){
			
			if(
				elementos[i].getSolido() 
				&& elementos[i].getPosicion().superior == personaje.getPosicion().pies
				&& 
				(
					valorEstaEntreValores(
						personaje.getPosicion().cara
						, elementos[i].getPosicion(ancho).izquierda
						, elementos[i].getPosicion(ancho).derecha
					)
					||
					valorEstaEntreValores(
						personaje.getPosicion().espalda
						, elementos[i].getPosicion(ancho).izquierda
						, elementos[i].getPosicion(ancho).derecha
					)
				)
			){
				return true;
			}
			
		}
		return false;
	};
	
	
	/**
	 * Función que comprueba si el personaje ha chocado contra algun elemento y muere.
	 */
	function verificarColisionMortal(){
		for(var i = 0; i < elementos.length; i++){
			if(
				(
					valorEstaEntreValores(
						personaje.getPosicion().cabeza
						, elementos[i].getPosicion(ancho).superior
						, elementos[i].getPosicion(ancho).inferior
					)
					||
					valorEstaEntreValores(
						personaje.getPosicion().pies
						, elementos[i].getPosicion(ancho).superior
						, elementos[i].getPosicion(ancho).inferior
					)
				)
				&& 
				(
					valorEstaEntreValores(
						personaje.getPosicion().cara
						, elementos[i].getPosicion(ancho).izquierda
						, elementos[i].getPosicion(ancho).derecha
					)
					||
					valorEstaEntreValores(
						personaje.getPosicion().espalda
						, elementos[i].getPosicion(ancho).izquierda
						, elementos[i].getPosicion(ancho).derecha
					)
				)
				&& elementos[i].getMortal(velocidad) 
			){
				return true;
			}
		}
		
		return false;
	};
	
	
	
	
	
	/******FUNCIONES DERIVADAS DE LA INTERACTIVIDAD********/
	
	
	/**
	 * Función que cambia la velocidad del juego.
	 * Function that changes game speed.
	 * 
	 * @param incremento - Cambio producido en la velocidad.
	 */
	function cambiarVelocidad(incremento){
		velocidad += incremento;
		
		if(velocidad > velocidadMax){
			velocidad = velocidadMax;
		}
		
		else if(velocidad < velocidadMin){
			velocidad = velocidadMin;
		}
		console.log("velocidad: "+velocidad);
	};
	
	
	/**
	 * Función que pausa el juego.
	 * Function that pauses the game.
	 */
	function pausar(){
		if(!inicio){
			inicio = true;
			fotograma = 0;
			fechaUltimoFotograma = new Date().getTime();
			fechaInicio = fechaUltimoFotograma;
			fechaUltimaPausa = new Date().getTime();
			tiempoEnPausa = 0;
			puntuacion = 0;
		}
		
		if(pausa){
			pausa = false;
			var fechaFinPausa = new Date().getTime();
			tiempoEnPausa += fechaFinPausa - fechaUltimaPausa;
		}
		
		else{
			pausa = true;
			fechaUltimaPausa = new Date().getTime();
		}
	};
	
	
	
	/**
	 * Función que evalua que tecla se ha pulsado y en algunos casos llama a otras funciones.
	 * Function that verifies which key was pressed and, in some cases, call other functions.
	 */
	function verificarTecla(e){
		switch(e.keyCode){
			case 37: 
				cambiarVelocidad(-aceleracion);
				break;
			case 39:
				cambiarVelocidad(aceleracion);
				break;
			case 38:
				personaje.saltar(velocidad,alto);
				break;
			case 40:
				personaje.bajar(alto);
				break;
			case 13:
				pausar();
				break;
			case 27: 
				inicio = false;
				pausa = true;
				fotogramas = 0;
				fechaUltimoFotograma = new Date().getTime();
				fechaInicio = fechaUltimoFotograma;
				personaje = new RaggedWinionCharacter("personaje", ancho);
				break;
			default:;
		}
	};
	
	
	/**
	 * Función que actualiza el zoom del videojuego en función del tamaño de pantalla.
	 * Function which resize videogame's zoom depending on pantalla size.
	 */
	function redimensionar(e){
		zoom = pantalla.offsetWidth / ancho;
		video.width = pantalla.offsetWidth;
		video.height = pantalla.offsetHeight;
	};
	
	
	
	
	
	/******NIVELES DE JUEGO******/
	
	/**
	 * 
	 */
	function nivel0(tiempoDesdeInicio){
		/**Elementos Video**/
		var frecuenciaTierra = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaTierra < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "tierra"
					, tiempoDesdeInicio
					, alto-50
					, 120
					, ancho
					, true
					, false
					, 0
					, 0
				)
			);
		}
		

		/**Elementos **/
		var frecuenciaNube = 8000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "nube"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 4) * alto / 5 + 100) 
					, 120
					, 200
					, true
					, false
					, 0
					, 0
				)
			);
		}
	};
	
	/**
	 * 
	 */
	function nivel1(tiempoDesdeInicio){
		/**Elementos Video**/
		var frecuenciaTierra = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaTierra < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "tierra"
					, tiempoDesdeInicio
					, alto-50
					, 120
					, ancho
					, true
					, false
					, 0
					, 0
				)
			);
		}
		

		/**Elementos **/
		var frecuenciaNube = 3500 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "nube"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 4) * alto / 5 + 100) 
					, 120
					, 200
					, true
					, false
					, parseInt(Math.random() * 3)
					, 0
				)
			);
		}
		
		var frecuenciaSoldado = 8000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaSoldado < ciclo){
			switch(parseInt(Math.random() * 10)){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
					elementos.push(
							new RaggedWinionElement(
								19
								, "soldadoEscudo"
								, tiempoDesdeInicio
								, alto-220
								, 180
								, 140
								, true
								, true
								, 1
								, 0
							)
						);
						puntuacion += 4;
					break;
				case 5:
				case 6:
				case 7:
					elementos.push(
							new RaggedWinionElement(
								40
								, "soldadoEspada"
								, tiempoDesdeInicio
								, alto-170
								, 150
								, 100
								, false
								, true
								, 6
								, 0
							)
						);
						puntuacion += 6;
					break;
				default:;
			}
		}
	};

	
	/**
	 * 
	 */
	function nivel2(tiempoDesdeInicio){
		/**Elementos **/
		var frecuenciaNube = 1600 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "nube"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
					, 120
					, 200
					, true
					, false
					, parseInt(Math.random() * 10)
					, 0
				)
			);
			puntuacion += 2;
		}
	};

	
	/**
	 * 
	 */
	function nivel3(tiempoDesdeInicio){
		/**Elementos **/
		var frecuenciaNube = 1400 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nube"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
					, 120
					, 200
					, true
					, false
					, parseInt(Math.random() * 12)
					, 0
				)
			);
		}
		
		/**Elementos **/
		var frecuenciaHalcon = 20000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaHalcon < ciclo){
			elementos.push(
				new RaggedWinionElement(
					5
					, "halcon"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 150) 
					, 75
					, 150
					, true
					, true
					, parseInt(Math.random() * 3) * 5 + 6
					, parseInt(Math.random() * 11) - 5
				)
			);
			puntuacion += 12;
		}
	};
};