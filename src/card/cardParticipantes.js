var yo = require('yo-yo');

module.exports = function card(key,rut,codigo,urlImage,urlImageThumb,category){
 var  aux = key + "favorite";
 var  aux2 = key + "favorite_border";

 var aux3 = key + "card";

     if(category == "cat_1"){
        return yo`
            <div class="col s6 m3 curso"  id=${aux3} >
                <div class="card hoverable">
                  <div class="card-image "> 
                    <a target="_blank" href=${urlImage}>  
                      <img style="min-height=300px;" src=${urlImageThumb}>
                    </a>
                    <a class="btn-floating halfway-fab waves-effect waves-light orange" style="right: 5px;">
                      <i id=${aux} class="btnFavorite material-icons">favorite</i>
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

     }else if(category == "false"){
        return yo`
            <div class="col s6 m3 curso"  id=${aux3} >
                <div class="card hoverable">
                  <div class="card-image "> 
                    <a target="_blank" href=${urlImage}>  
                      <img style="min-height=300px;" src=${urlImageThumb}>
                    </a>
                    <a class="btn-floating halfway-fab waves-effect waves-light orange" style="right: 5px;">
                      <i id=${aux2} class="btnFavorite material-icons">favorite_border</i>
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

}

      