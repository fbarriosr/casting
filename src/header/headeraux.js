var yo = require('yo-yo');


module.exports = function header(){
    return yo`
	<div class="navbar-fixed">
		<div  class="row">
	        <a href="#" data-activates="slide-out" class="button-collapse right"><i class="material-icons">menu</i></a>
		    <ul id="slide-out" class="side-nav">     
		      <li>
		        <div class="userView">  
		          <img src="trabajadorHombre25.jpg" >
		        </div>
		        <a id="itemMenuTituloLabel">CATEGORIAS</a>
		        <a id="itemMenuTituloLabel">SELECCIÓN</a>
		        <a id="itemMenuTituloLabel" class="menuLittle">Por Aprobar</a>
		        <a id="itemMenuTituloLabel" class="menuLittle">Aprobar</a>
		        <a id="itemMenuTituloLabel" class="menuLittle">Rechazadas</a>
		        <a id="itemMenuTituloLabel">BUSCAR GANADOR</a>
		        <a id="itemMenuTituloLabel" class="menuLittle">Participantes</a>
		        <a id="itemMenuTituloLabel" class="menuLittle">Seleccionadas</a>
		        <a id="itemMenuTituloLabel" class="menuLittle">Ganadores</a>
		      </li>    
		    </ul>  
      	</div>
	</div>	
    `;
}

