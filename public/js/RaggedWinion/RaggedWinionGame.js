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
	var duracionNivel = 30000;
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
	
	var finalBoss = true;
	
	
	/**Funciones de Inicio - Onload Methods**/
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
				interfaz();
			}
			
			else if(!pausa){
				nuevoCiclo();
			}
			
			else{
				video.style.backgroundColor = "rgb(10,20,20)";
				texto("Pulsa 'Enter' para continuar");
				interfaz();
				subTextoDer(puntuacion+" puntos");
			}
		}
		,1000 / fps / 2
	);
	
	/******* FIN DEL CONSTRUCTOR *******/
	

	/**
	 * Método que genera un ciclo de proceso.
	 * Method which generates an evaluation process.
	 */
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
		
		supTextoDer("Nivel "+parseInt((tiempoDesdeInicio / duracionNivel)+1));
		subTextoDer(puntuacion+" puntos");
		interfaz();
	};
	
	/**
	 * Método que realiza los eventos pertinentes del fotograma actual.
	 * Method which makes the events from the actual photogram.
	 */
	function eventos(tiempoDesdeInicio){
		/**Eventos de nivel**/
		if(tiempoDesdeInicio >= duracionNivel * 10){
			nivel0(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 8 && tiempoDesdeInicio < duracionNivel * 9){
			nivel9(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 7 && tiempoDesdeInicio < duracionNivel * 8){
			nivel8(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 6 && tiempoDesdeInicio < duracionNivel * 7){
			nivel7(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 5 && tiempoDesdeInicio < duracionNivel * 6){
			nivel6(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 4 && tiempoDesdeInicio < duracionNivel * 5){
			nivel5(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 3 && tiempoDesdeInicio < duracionNivel * 4){
			nivel4(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel * 2 && tiempoDesdeInicio < duracionNivel * 3){
			nivel3(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= duracionNivel && tiempoDesdeInicio < duracionNivel * 2){
			nivel2(tiempoDesdeInicio);
		}
		
		else if(tiempoDesdeInicio >= 8000 && tiempoDesdeInicio < duracionNivel){
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
	 * Método que dibuja el fotograma actual.
	 * Method wich draws the photogram.
	 */
	function dibujar(tiempoDesdeInicio){
		for(var i = 0; i < elementos.length; i++){
			elementos[i].dibujar(contextoVideo, ancho, zoom, fps, tiempoDesdeInicio);
		}

		personaje.dibujar(contextoVideo, zoom, fps, tiempoDesdeInicio, velocidad);
	};
	
	
	/**
	 * Método que muestra un texto en el contexto.
	 * Method that shows a text in the context.
	 */
	function texto(contenido){
		contextoVideo.font = (40*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "orange";
		contextoVideo.textAlign = "center";
		contextoVideo.fillText(contenido, ancho*zoom/2, alto*zoom/2);
	};
	
	
	/**
	 * Método que muestra un texto en el contexto.
	 * Method that shows a text in the context.
	 */
	function supTextoDer(contenido){
		contextoVideo.font = (40*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "white";
		contextoVideo.textAlign = "right";
		contextoVideo.fillText(contenido, (ancho-40)*zoom, 40*zoom);
	};
	
	
	/**
	 * Método que muestra un texto en el contexto.
	 * Method that shows a text in the context.
	 */
	function supTextoIzq(contenido){
		contextoVideo.font = (40*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "white";
		contextoVideo.textAlign = "left";
		contextoVideo.fillText(contenido, 40*zoom, 40*zoom);
	};
	
	
	/**
	 * Método que muestra la interfaz de juego.
	 * Method that shows the gaming interface.
	 */
	function interfaz(){
		img = new Image();
		img = document.getElementById("cristal" + velocidad);
		if(img != null){
			contextoVideo.drawImage(img, parseInt((ancho/2 - 40) * zoom), parseInt(10*zoom), 80*zoom, 120*zoom);
		}
	};
	
	
	/**
	 * Método que muestra un texto en el contexto de animaciones
	 * Method that shows a text in animation context
	 */
	function subTextoDer(contenido){
		contextoVideo.font = (20*zoom)+"px Sans Sherif";
		contextoVideo.fillStyle = "white";
		contextoVideo.textAlign = "right";
		contextoVideo.fillText(contenido, (ancho-40)*zoom, 70*zoom);
	};
	
	
	/**
	 * Método que altera el color gradualmente.
	 * Method that change color gradually.
	 */
	function cambiarColor(tiempoDesdeInicio){
		var rojoInicial = 100;
		var verdeInicial = 100;
		var azulInicial = 255;
		var velocidadCambioColor = (duracionNivel * 10) / (azulInicial + rojoInicial);
		
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
		console.log(bgColor)
		pantalla.style.backgroundColor = bgColor;
	};
	
	
	/**
	 * Método que comprueba si el personaje está apoyado.
	 * Method which verify if the character is on the floor.
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
	 * Método que comprueba si el personaje ha chocado contra algun elemento y muere.
	 * Method which verify if the character crash with an enemy and die.
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
	 * Método que cambia la velocidad del juego.
	 * Method that changes game speed.
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
	 * Método que pausa el juego.
	 * Method that pauses the game.
	 */
	function pausar(){
		if(!inicio){
			inicio = true;
			
			fotograma = 0;
			fechaUltimoFotograma = new Date().getTime();
			fechaInicio = fechaUltimoFotograma;
			fechaUltimaPausa = new Date().getTime();
			tiempoEnPausa = 0;
			
			red = 100;
			blue = 255;
			green = 100;
			bgColor = "rgb("+ red +","+ green +","+ blue +")";
			
			elementos = [];
			puntuacion = 0;
			finalBoss = true;
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
	 * Método que evalua que tecla se ha pulsado y en algunos casos llama a otras funciones.
	 * Method that verifies which key was pressed and, in some cases, call other functions.
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
	 * Método que actualiza el zoom del videojuego en Método del tamaño de pantalla.
	 * Method which resize videogame's zoom depending on pantalla size.
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
		var frecuenciaSuelo = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaSuelo < ciclo){
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
		var frecuenciaSuelo = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaSuelo < ciclo){
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
		
		var frecuenciaEnemigo = 8000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaEnemigo < ciclo){
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
								15
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
			puntuacion += 2;
		}
	};

	
	/**
	 * 
	 */
	function nivel3(tiempoDesdeInicio){
		/**Elementos **/
		var frecuenciaNube = 1200 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){

			if(Math.random() * 2 < 1){
				elementos.push(
					new RaggedWinionElement(
						21
						, "nubegris"
						, tiempoDesdeInicio
						, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
						, 120
						, 200
						, true
						, false
						, parseInt(Math.random() * 14)
						, 0
					)
				);
			}
			else{
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
		}
		
		/**Elementos **/
		var frecuenciaEnemigo = 25000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaEnemigo < ciclo){
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

	
	/**
	 * 
	 */
	function nivel4(tiempoDesdeInicio){
		/**Elementos **/
		var frecuenciaNube = 1200 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nubegris"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
					, 120
					, 200
					, true
					, false
					, parseInt(Math.random() * 14)
					, 0
				)
			);
		}
		
		var frecuenciaNubeTormentosa = 20000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNubeTormentosa < ciclo){
			elementos.push(
				new RaggedWinionElement(
					1000
					, "nubetormentosa"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
					, 100
					, 160
					, true
					, true
					, parseInt(Math.random() * 8)
					, 0
				)
			);
			puntuacion += 10;
		}
		
		/**Elementos **/
		var frecuenciaEnemigo = 90000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaEnemigo < ciclo){
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

	
	/**
	 * 
	 */
	function nivel5(tiempoDesdeInicio){
		/**Elementos **/
		var frecuenciaNube = 1200 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			if(Math.random()  * 4 < 1){
				elementos.push(
					new RaggedWinionElement(
						21
						, "nubemalvada"
						, tiempoDesdeInicio
						, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
						, 120
						, 240
						, true
						, false
						, parseInt(Math.random() * 10 + 8)
						, 0
					)
				);
			}
			else{
				elementos.push(
					new RaggedWinionElement(
						21
						, "nubegris"
						, tiempoDesdeInicio
						, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
						, 120
						, 200
						, true
						, false
						, parseInt(Math.random() * 14)
						, 0
					)
				);
			}
		}
		
		var frecuenciaNubeTormentosa = 14000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNubeTormentosa < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nubetormentosa"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
					, 180
					, 280
					, true
					, true
					, parseInt(Math.random() * 10)
					, 0
				)
			);
			puntuacion += 14;
		}
	};

	
	/**
	 * 
	 */
	function nivel6(tiempoDesdeInicio){
		/**Elementos **/
		var frecuenciaNube = 1200 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nubemalvada"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 5) * alto / 5 + 100) 
					, 120
					, 240
					, true
					, false
					, parseInt(Math.random() * 10 + 8)
					, 0
				)
			);
		}
		
		var frecuenciaAlma = 15000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaAlma < ciclo){
			elementos.push(
					new RaggedWinionElement(
						21
						, "alma"
						, tiempoDesdeInicio
						, -100 
						, 80
						, 80
						, true
						, true
						, 0
						, parseInt(Math.random() * 20 + 5)
					)
				);
			puntuacion += 15;
		}
	};

	
	/**
	 * 
	 */
	function nivel7(tiempoDesdeInicio){
		var frecuenciaSuelo = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaSuelo < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "huesos"
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
		var frecuenciaNube = 10000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nubemalvada"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 3 - 1) * alto / 5 + 100) 
					, 120
					, 240
					, true
					, false
					, parseInt(Math.random() * 10 + 8)
					, 0
				)
			);
		}
		
		var frecuenciaAlma = 15000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaAlma < ciclo){
			elementos.push(
					new RaggedWinionElement(
						21
						, "alma"
						, tiempoDesdeInicio
						, -100 
						, 80
						, 80
						, true
						, true
						, 0
						, parseInt(Math.random() * 20 + 5)
					)
				);
			puntuacion += 15;
		}
	};

	
	/**
	 * 
	 */
	function nivel8(tiempoDesdeInicio){
		var frecuenciaSuelo = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaSuelo < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "huesos"
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
		var frecuenciaNube = 10000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nubemalvada"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 3 - 1) * alto / 5 + 100) 
					, 120
					, 240
					, true
					, false
					, parseInt(Math.random() * 10 + 8)
					, 0
				)
			);
		}
		
		var frecuenciaAlma = 18000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaAlma < ciclo){
			elementos.push(
					new RaggedWinionElement(
						21
						, "alma"
						, tiempoDesdeInicio
						, -100 
						, 80
						, 80
						, true
						, true
						, 0
						, parseInt(Math.random() * 15 + 10)
					)
				);
			puntuacion += 15;
		}
		
		var frecuenciaEnemigo = 8000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaEnemigo < ciclo){
			switch(parseInt(Math.random() * 10)){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
					elementos.push(
							new RaggedWinionElement(
								Math.random()*10
								, "minion"
								, tiempoDesdeInicio
								, alto-140
								, 100
								, 75
								, false
								, true
								, 10
								, 0
							)
						);
						puntuacion += 6;
					break;
				case 5:
				case 6:
				case 7:
					elementos.push(
							new RaggedWinionElement(
								15
								, "esqueleto"
								, tiempoDesdeInicio
								, alto-170
								, 150
								, 100
								, false
								, true
								, 4
								, 0
							)
						);
						puntuacion += 8;
					break;
				default:;
			}
		}
	};

	
	/**
	 * 
	 */
	function nivel9(tiempoDesdeInicio){
		if(finalBoss){
			elementos.push(
				new RaggedWinionElement(
					39
					, "demoniojefe"
					, tiempoDesdeInicio
					, 100
					, 300
					, 250
					, false
					, true
					, -19.55
					, 5
				)
			);
			
			finalBoss = false;
			
			puntuacion += 100;
		}
		
		
		var frecuenciaSuelo = 4000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaSuelo < ciclo){
			elementos.push(
				new RaggedWinionElement(
					40
					, "huesos"
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
		var frecuenciaNube = 14000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaNube < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "nubemalvada"
					, tiempoDesdeInicio
					, parseInt(parseInt(Math.random() * 3 - 1) * alto / 5 + 100) 
					, 120
					, 240
					, true
					, false
					, parseInt(Math.random() * 10 + 8)
					, 0
				)
			);
		}
		
		var frecuenciaAlma = 18000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaAlma < ciclo){
			elementos.push(
				new RaggedWinionElement(
					21
					, "alma"
					, tiempoDesdeInicio
					, -100 
					, 80
					, 80
					, true
					, true
					, 0
					, parseInt(Math.random() * 15 + 10)
				)
			);
			puntuacion += 15;
		}
		
		var frecuenciaEnemigo = 7000 / velocidad;
		if(tiempoDesdeInicio % frecuenciaEnemigo < ciclo){
			switch(parseInt(Math.random() * 10)){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
					elementos.push(
						new RaggedWinionElement(
							Math.random()*10
							, "minion"
							, tiempoDesdeInicio
							, alto-140
							, 100
							, 75
							, false
							, true
							, 10
							, 0
						)
					);
					puntuacion += 6;
					break;
				case 5:
				case 6:
				case 7:
					elementos.push(
						new RaggedWinionElement(
							15
							, "esqueleto"
							, tiempoDesdeInicio
							, alto-170
							, 150
							, 100
							, false
							, true
							, 4
							, 0
						)
					);
					puntuacion += 8;
					break;
				default:;
			}
		}
	};
};