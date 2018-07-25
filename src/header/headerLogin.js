var yo = require('yo-yo');


module.exports = function header(){
    return yo`
	  <div class="navbar-fixed">
	   	<nav>
		    <div class="header nav-wrapper ">    
				<a  href="/home" class="brand-logo left">
		        	<img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">
		     	</a>
		    </div>	    
	  	</nav>
	  </div>	
    `;
}

