/**
 * 
 */
function AsinCronos(peticionesURL){
	var objetoXHR = false;
	var cambios = false;
	var en = "tronco";
	
	if (window.XMLHttpRequest){
		objetoXHR = new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
    	objetoXHR = new ActiveXObject("Microsoft.XMLHTTP") ;
	}

		
	/**MÉTODOS PRIVADOS**/
	
	/**
	 * 
	 */
	function respuesta (){
		if(objetoXHR.readyState==4 && objetoXHR.status==200){
    		document.getElementById(en).innerHTML=objetoXHR.responseText;
    		cambios = true;
    	}
    	else if(objetoXHR.status==500){
			document.getElementById(en).innerHTML="<h1 class='error'>ERROR 500</h1> <p class='error'>Servidor caído.<br/>Prueba a recargar la página.</p>";
		}
    	else if(objetoXHR.status==404){
			document.getElementById(en).innerHTML="<h1 class='error'>ERROR 404</h1> <p class='error'>Página no encontrada.<br/>Prueba a recargar la página.</p>";
		}
		else{
			document.getElementById(en).innerHTML="<div class='contenedorTransparente mid column enfasis'><div class='esferaLoading'><img src='src/sol.gif'/></div>Cargando...</div>";
    	}
    };

		
	/**MÉTODOS PÚBLICOS**/
		
	/**
	 * 
	 */
	this.actualizar = function(datos,sitioDeCarga){
		if (objetoXHR){
    		if(sitioDeCarga != null) en = sitioDeCarga;
    		else en = "tronco";
    		objetoXHR.open("POST",peticionesURL);
    		objetoXHR.onreadystatechange = respuesta;
    		objetoXHR.setRequestHeader("Content-type", "application/JSON;charset=UTF-8")
    		objetoXHR.send(datos);
    	}
	};
		
	/**
	 * 
	 */
	this.check = function(){
		if (cambios){
			cambios = false;
			return true;
    	}
    	else{
    		return false;
    	}
	};
};