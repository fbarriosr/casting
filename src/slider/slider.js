var yo = require('yo-yo');

module.exports = function slider(mobile,tablet,desktop){
// <a href="#" class="brand-logo center" style="font-weight: 700;">${name}</a>
    return yo`
	  <div>
	  	<img class="responsive-img hide-on-med-and-up" src=${mobile} style="height: 70%vh;" alt="Space">
        <img class="responsive-img hide-on-med-and-down" src=${desktop} style="height: 70%vh;" alt="Space"> 
        <img class="responsive-img hide-on-small-only hide-on-large-only" src=${tablet} style="height: 70%vh;" alt="Space">   
 	  </div>
	 
    `;
}




