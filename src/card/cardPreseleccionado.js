var yo = require('yo-yo');
var yo2 = require('yo-yo');

module.exports = function card(key,rut,codigo,urlImage,urlImageThumb,status,score){
 var estrellas = starLoad(Number(score),key,rut);
 console.log('score: ',score);
 var  numberEstrellas = score;
 var  aux = key + "btnDelete";
 var  aux2 = key + "btnStar";
 var aux3= key+"card";

     if(status == "winner"){
        return yo`
            <div class="col s6 m3 curso" id=${aux3} >
                <div class="card hoverable">
                  <div class="card-image "> 
                    <a target="_blank" href=${urlImage}>  
                      <img style="min-height=300px;" src=${urlImageThumb}>
                    </a>
                    <a class="btn-floating halfway-fab waves-effect waves-light red" style="left: 24px; right: 0px;">
                      <i id=${aux} class="btnDelete material-icons">clear</i>
                    </a>
                     <a class="btn-floating halfway-fab waves-effect waves-light orange">
                      <i id=${aux2} class="btnWinner material-icons">star</i>
                    </a>
                    
                  </div>
                   ${estrellas}
                </div>
              </div>
      `;

     }else if(status == "false"){
        return yo`
            <div class="col s6 m3 curso" id=${aux3} >
                <div class="card hoverable">
                  <div class="card-image "> 
                    <a target="_blank" href=${urlImage}>  
                      <img style="min-height=300px;" src=${urlImageThumb}>
                    </a>
                     <a class="btn-floating halfway-fab waves-effect waves-light red" style="left: 24px; right: 0px;">
                        <i id=${aux} class="btnDelete material-icons">clear</i>
                      </a>
                      <a class="btn-floating halfway-fab waves-effect waves-light orange">
                        <i id=${aux2} class="btnWinner material-icons">star_border</i>
                      </a>
                  </div>
                   ${estrellas}
                </div>
              </div>
      `;
     }

}

function starLoad(numero, key,rut){
  const star1 = key + "star1";
  const star2 = key + "star2";
  const star3 = key + "star3";
  const star4 = key + "star4";
  const star5 = key + "star5";
  var resultado = "";
  if(numero == 0){
    return yo2 `
      <div class="card-content card-preseleccionado">
        <div class="divId" >
          <p style="text-align:left; font-weight:bolder;">RUT</p>
          <p class="rut" style="text-align:center">${rut}</p>
          <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
          <p class="key1" style="text-align:center">${key}</p>
          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntación</p>
          <i id=${star1} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>
          <i id=${star2} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> 
          <i id=${star3} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> 
          <i id=${star4} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  
          <i id=${star5} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>
        </div>
      </div>

    `;
  }else if(numero == 1){
    return yo2`
    <div class="card-content card-preseleccionado">
        <div class="divId" >
          <p style="text-align:left; font-weight:bolder;">RUT</p>
          <p class="rut" style="text-align:center">${rut}</p>
          <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
          <p class="key1" style="text-align:center">${key}</p>
          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntación</p>
          <i id=${star1} class="favoriteBtnStart  material-icons" style="color:orange">star</i>
          <i id=${star2} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> 
          <i id=${star3} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> 
          <i id=${star4} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  
          <i id=${star5} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>
        </div>
      </div>
    `;
  }else if(numero == 2){
    return yo2`
    <div class="card-content card-preseleccionado">
        <div class="divId" >
          <p style="text-align:left; font-weight:bolder;">RUT</p>
          <p class="rut" style="text-align:center">${rut}</p>
          <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
          <p class="key1" style="text-align:center">${key}</p>
          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntación</p>
          <i id=${star1} class="favoriteBtnStart  material-icons" style="color:orange">star</i>
          <i id=${star2} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> 
          <i id=${star3} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> 
          <i id=${star4} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  
          <i id=${star5} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>
        </div>
    </div>
    `;
  }else if(numero == 3){
    return yo2`
    <div class="card-content card-preseleccionado">
        <div class="divId" >
          <p style="text-align:left; font-weight:bolder;">RUT</p>
          <p class="rut" style="text-align:center">${rut}</p>
          <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
          <p class="key1" style="text-align:center">${key}</p>
          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntación</p>
          <i id=${star1} class="favoriteBtnStart  material-icons" style="color:orange">star</i>
          <i id=${star2} class="favoriteBtnStart  material-icons" style="color:orange">star</i> 
          <i id=${star3} class="favoriteBtnStart  material-icons" style="color:orange">star</i> 
          <i id=${star4} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  
          <i id=${star5} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>
        </div>
      </div>
    `;
  }else if(numero == 4){
    return yo2`
    <div class="card-content card-preseleccionado">
        <div class="divId" >
          <p style="text-align:left; font-weight:bolder;">RUT</p>
          <p class="rut" style="text-align:center">${rut}</p>
          <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
          <p class="key1" style="text-align:center">${key}</p>
          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntación</p>
          <i id=${star1} class="favoriteBtnStart  material-icons" style="color:orange">star</i>
          <i id=${star2} class="favoriteBtnStart  material-icons" style="color:orange">star</i> 
          <i id=${star3} class="favoriteBtnStart  material-icons" style="color:orange">star</i> 
          <i id=${star4} class="favoriteBtnStart  material-icons" style="color:orange">star</i>  
          <i id=${star5} class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>
        </div>
      </div>
    `;
  }else if(numero == 5){
    return yo2`
    <div class="card-content card-preseleccionado">
        <div class="divId" >
          <p style="text-align:left; font-weight:bolder;">RUT</p>
          <p class="rut" style="text-align:center">${rut}</p>
          <p style="text-align:left; font-weight:bolder;">CÓDIGO</p>
          <p class="key1" style="text-align:center">${key}</p>
          <p style="text-align:left; font-weight:bolder;" class="puntajeStar">Puntación</p>
          <i id=${star1} class="favoriteBtnStart  material-icons" style="color:orange">star</i>
          <i id=${star2} class="favoriteBtnStart  material-icons" style="color:orange">star</i> 
          <i id=${star3} class="favoriteBtnStart  material-icons" style="color:orange">star</i> 
          <i id=${star4} class="favoriteBtnStart  material-icons" style="color:orange">star</i>  
          <i id=${star5} class="favoriteBtnStart  material-icons" style="color:orange">star</i>
        </div>
      </div>
    `;
  }


}




			