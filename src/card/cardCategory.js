var yo = require('yo-yo');

module.exports = function card(category,urlImageThumb, btnId){

  	return yo`
	        <div class="col s6 m4 curso" id= ${btnId} >
              <div class="card hoverable">
                <div class="card-image "> 
                  <a >  
                    <img style="min-height=300px;" src=${urlImageThumb}>
                  </a>
               
                </div>
                <div class="card-content">
                  <div class="divId" >
                    <span class="card-title center" >${category}</span>
                  </div>
                </div>
              </div>
            </div>
		`;
}
