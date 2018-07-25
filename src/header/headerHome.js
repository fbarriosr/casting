var yo = require('yo-yo');


module.exports = function header(){
    return yo`
	  <div class="navbar-fixed">
	   	<nav>
		    <div class="header nav-wrapper ">    
				<a  href="/home" class="brand-logo left">
		        	<img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">
		     	</a>

		      <ul id="nav-mobile" class="right ">
		       <li><a class="dropdown-button " id="logOut" ><i class="material-icons">exit_to_app</i></a></li>
		      </ul>
		    </div>	    
	  	</nav>
	  </div>	
    `;
}

