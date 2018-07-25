var yo = require('yo-yo');

module.exports = function title(t1,t2){
// <a href="#" class="brand-logo center" style="font-weight: 700;">${name}</a>
    return yo`
	  <div class="container">
	  	<div class="row">
			<h2 >${t1}</h2>
	        <h4 >${t2}</h4>  
 	  	</div>
 	  </div>
	 
    `;
}

