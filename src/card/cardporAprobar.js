var yo = require('yo-yo');

module.exports = function card(key,rut,codigo,urlImage,urlImageThumb){

  var aux3= key+"card";

  var aux1= key+"btnCheck";
  var aux2= key+"btnDelete";

  	return yo`
	        <div class="col s6 m3 curso" id=${aux3}>
              <div class="card hoverable">
                <div class="card-image "> 
                  <a target="_blank" href=${urlImage}>  
                    <img style="min-height=300px;" src=${urlImageThumb}>
                  </a>
                  <a class="btn-floating halfway-fab waves-effect waves-light blue" style="right: 50px;">
                    <i id=${aux1} class="btnCheck material-icons">check</i>
                  </a>
                  <a class="btn-floating halfway-fab waves-effect waves-light red" style="right: 5px;">
                    <i id=${aux2} class="btnDelete material-icons">clear</i>
                  </a>
                </div>
                <div class="card-content">
                  <div class="divId" >
                    <p style="text-align:left; font-weight:bolder;">RUT</p>
                    <p class="rut" style="text-align:center">${rut}</p>
                    <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
                    <p class="key1" style="text-align:center">${key}</p>
                  </div>
                </div>
              </div>
            </div>
		`;
}

			