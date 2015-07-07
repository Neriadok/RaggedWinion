/**
 * Clase que usaremos para generar sensacion de despliegue de elementos.
 * 
 * @param elementoId - Id del elemento que activará el despliegue.
 */
function Desplegable(elementoId){

	/***VARIABLES DEL OBJETO***/
	
	/**Definimos los elementos desplegables.*/
	var desplegable = document.getElementsByClassName("desplegable"+elementoId);

	
	
	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(elementoId).onmouseover = desplegar;
	document.getElementById(elementoId).onmouseout = retraer;
	
	
	/***MÉTODOS Y FUNCIONES***/
	
	/**
	 * 
	 */
	function desplegar(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		/**Mostramos todos los elementos desplegables*/
		for(var i=0;i<desplegable.length;i++){
			desplegable[i].style.display = "block";
		}
	}
	
		
	/**
	 * 
	 */
	function retraer(e){
		/**Prevenimos eventos por defecto*/
		e.preventDefault();
		
		/**Escondemos todos los elementos desplegables*/
		for(var i=0;i<desplegable.length;i++){
			desplegable[i].style.display = "none";
		}
	}
};