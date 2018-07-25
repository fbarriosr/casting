var yo = require('yo-yo');


module.exports = function header(){
    return yo`

    <div class="">
	   	<nav class="navbar-fixed">
	   		<div  class="header row hide-on-large-only">
		        <a href="#" data-activates="slide-out" class="button-collapse right"><i class="material-icons">menu</i></a>
			    <a  href="/home" class="brand-logo left">
			        <img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">
			    </a>  
	      	</div>
		    <div class="header nav-wrapper hide-on-med-and-down">   
			  <a  href="/home" class="brand-logo left">
		        <img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">
		      </a>
		      <div class="hide-on-med-and-down">
			      <ul id="dropdown1" class="dropdown-content">
			        <li><a id="btnPensionadosHombre">Pensionados Hombre</a></li>
			        <li class="divider"></li>
			        <li><a id="btnPensionadosMujer">Pensionados Mujer</a></li>
			        <li class="divider"></li>
			        <li><a id="btnTrabajadorHombre45">Trabajador Hombre 45 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnTrabajadorHombre25">Trabajador Hombre 25 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnTrabajadorMujer40">Trabajador Mujer 40 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnTrabajadorMujer20">Trabajador Mujer 20 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnKidHombre15">Niño 15 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnKidHombre10">Niño 10 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnKidMujer15">Niña 15 años</a></li>
			        <li class="divider"></li>
			        <li><a id="btnKidMujer6">Niña 6 años</a></li>
			        <li class="divider"></li>
			      </ul>
			      <ul id="dropdown2" class="dropdown-content ">
			        <li><a id="btnporAprobar"><i class="material-icons" style="color: blue">thumbs_up_down</i>Por Aprobar</a></li>
			        <li class="divider"></li>
			        <li><a id="btnAprobar"><i class="material-icons" style="color: green">thumb_up</i>Aprobar</a></li>
			        <li class="divider"></li>
			        <li><a id="btnRechazar"><i class="material-icons" style="color: red">thumb_down</i>Rechazadas</a></li>
			      </ul>
			      <!-- Dropdown Structure -->
			      <ul id="dropdown3" class="dropdown-content">
			        <li><a id="btnParticipantes"><i class="material-icons" style="color: orange">people</i>Participantes</a></li>
			        <li class="divider"></li>
			        <li><a id="btnSeleccionadas"><i class="material-icons" style="color: orange">favorite</i>Seleccionadas</a></li>
			        <li class="divider"></li>
			        <li><a id="btnGanadores"><i class="material-icons" style="color: orange">star</i>Ganadores</a></li>
			      </ul>
			      <ul id="nav-mobile" class="right hide-on-med-and-down">
			        <li><a class="dropdown-button" data-activates="dropdown1">Categorías<i class="material-icons right">arrow_drop_down</i></a></li>
			        <li><a class="dropdown-button" data-activates="dropdown2">Selección<i class="material-icons right">arrow_drop_down</i></a></li>
			        <li><a class="dropdown-button" data-activates="dropdown3">Buscar Ganador<i class="material-icons right">arrow_drop_down</i></a></li>
			      	<li><a class="dropdown-button " id="logOut" ><i class="material-icons">exit_to_app</i></a></li>
			      </ul>
			  </div>
		    </div>	    
	  	</nav>

	  	  <ul id="slide-out" class="side-nav">  
		      <li>
		        <div class="userView">  
		          <img src="trabajadorHombre25.jpg" style="width:100% !important" >
		        </div>
		      </li>
		      <li>
		        <a  id="itemMenuCategorias" class="menuLateral"><i class="material-icons" style="color:  yellow">dashboard</i>CATEGORIAS</a>
		      </li>

		      <li>
		        <a id="itemMenuPorAprobar" class="menuLateralLittle"><i class="material-icons" style="color: blue">thumbs_up_down</i>Por Aprobar</a>
		      </li>
		      <li>
		        <a id="itemMenuAprobar" class="menuLateralLittle"><i class="material-icons" style="color: green">thumb_up</i>Aprobar</a>
		      </li>
		      <li>
		        <a id="itemMenuRechazadas" class="menuLateralLittle"><i class="material-icons" style="color: red">thumb_down</i>Rechazadas</a>
		      </li>
		      <li>
		        <a id="itemMenuParticipantes" class="menuLateralLittle"><i class="material-icons" style="color: orange">people</i>Participantes</a>
		      </li>
		      <li>
		        <a id="itemMenuSeleccionadas" class="menuLateralLittle"><i class="material-icons" style="color: orange">favorite</i>Seleccionadas</a>
		      </li>
		      <li>
		        <a id="itemMenuGanadores" class="menuLateralLittle"><i class="material-icons" style="color: orange">star</i>Ganadores</a>
		      </li>  
		      <li>
		      	<a id="itemMenulogOut" style="color:white; height: auto !important; line-height: 48px;font-weight:bolder" ><i class="material-icons">power_settings_new</i>SALIR</a>
		      </li>  
		    </ul>  
	  </div>	
    `;
}

