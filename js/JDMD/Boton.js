/**
 * 
 * 
 * @param 
 */
function Boton(ca, elementoId,valor,tipo,sitioCarga){

	/***VARIABLES DEL OBJETO***/
	var pulsado=false;

	
	
	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(elementoId).onclick = pressBoton;
	document.getElementById(elementoId).onmouseover = cEncima;
	document.getElementById(elementoId).onmouseout = cFuera;
	document.getElementById(elementoId).onmousedown = cPulsado;
	
	
	/***MÉTODOS Y FUNCIONES***/
	
	/**
	 * 
	 */
	function pressBoton(e){
		switch(tipo){
			case 1: ir(e); break;
			case 2: ir(e); break;
			default:;
		}
	};
	
	/**
	 * 
	 */
	function ir(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		cSoltar(e);
		
		//Creamos el objeto con los datos
		var datos = new Object();
		
		switch(tipo){
			case 2: datos['newTopic'] = valor; break;
			default: datos['destino'] = valor;
		}
			
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};
	
	
	/**
	 * 
	 */
	function cEncima(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		document.getElementById(elementoId).style.borderColor="#F9FF45";
	};
	
	
	/**
	 * 
	 */
	function cFuera(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();

		cSoltar(e);	
		
		document.getElementById(elementoId).style.borderColor="#CBD126";
	};
	
	
	/**
	 * 
	 */
	function cPulsado(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		pulsado=true;

		document.getElementById(elementoId).style.boxShadow="3px 3px 3px grey";
	};
	
	
	/**
	 * 
	 */
	function cSoltar(e){
		if(pulsado){
			pulsado = false;

			document.getElementById(elementoId).style.boxShadow="none";
		}
	};
};