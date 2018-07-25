var yo = require('yo-yo');    

var login = yo`
<div class="container" >
 
          <div class="row" id="addPhoto" >
  
              <div class="row">
              <form class="col s12">
                <div class="input-field col s12">
                    <i class="material-icons prefix">account_circle</i>
                    <input id="name" type="text" class="validate">
                    <label for="name">Nombres</label>
                </div>
                <div class="input-field col s12">
                    <i class="material-icons prefix">account_circle</i>
                    <input id="lastName" type="text" class="validate">
                    <label for="lastName">Apellidos</label>
                </div>
                <div class="input-field col s12">
                    <i class="material-icons prefix">folder_shared</i>
                    <input id="rut" type="text" class="validate">
                    <label for="rut">Rut</label>
                </div>  
                <div class="input-field col s12">
                    <i class="material-icons prefix">mail</i>
                    <input id="email" type="email" class="validate">
                    <label for="email">E-mail</label>
                </div>
                <div class="input-field col s12">
                    <i class="material-icons prefix">phone</i>
                    <input id="phone" type="tel" class="validate">
                    <label for="phone">Telephone</label>
                </div>

                <div class="input-field col s4">
                  <select id="cat">
                    <option value="" disabled selected>Categoría</option>
                    <option value="1">Pensionado</option>
                    <option value="2">Trabajador</option>
                    <option value="3">Niños</option>
                  </select>
                </div>
                <div class="input-field col s4">
                  <select id="sexo">
                    <option value="" disabled selected>Sexo</option>
                    <option value="1">Hombre</option>
                    <option value="2">Mujer</option>
                  </select>
                </div>
                <div class="input-field col s4" id="edadParent">
                  <select id="edad">
                    <option value="" disabled selected>Edad</option>
                    <option value="1">10 años</option>
                    <option value="2">12 años</option>
                  </select>
                </div>

              </form> 
              <div id="fieldNone" class="modal">
                  <p style="text-align: center;">Estimado Debes Ingresar Todos los Campos.</p>
              </div>
              <div id="fotoNone" class="modal">
                  <p style="text-align: center;">Estimado Debes Adjuntar una Foto.</p>
              </div>
              <div id="fieldGood" class="modal">
                  <p style="font-weight: bolder; text-align: center;">Gracias por Participar. <br></p>
                  <p style="font-weight: bolder; text-align: center;">Tu foto será revisada antes de publicarse. <br></p>
                  <p style="font-weight: bolder; text-align: center;">Mira las Fotos que están participan en el Sitio</p>
              </div>
              <div id="fieldRutMalo" class="modal">
                  <p >Ingrese un rut válido</p>
              </div>

              <div id="fieldMailMalo" class="modal">
                  <p >Ingrese un mail válido.</p>
              </div>
              <div id="fieldRutMailMalo" class="modal">
                  <p >Ingrese un rut y un mail válidos</p>
              </div> 
              <div id="fieldRutMailDoble" class="modal">
                  <p >Solo puedes participar una vez. :)</p>
              </div>

            <div class="col s12 center-align">

            <div id="columnsInfo" class="col s12  text-center center-align"  style="height: auto; width: 100% ">  
                <label id="buttonFotosInside" for="exampleFileUpload" class="btn hoverable" style="height: auto; width: 100% ">SUBIR FOTO</label>
                <input type="file" id="exampleFileUpload" class="hide">
            </div> 
          
            <div id="butonCol" class="col s12  text-center center-align" style="margin-bottom: 20px; " >  
                  <label id="btnSend"  class="btn hoverable" style="width: 120px; font-size:22px; background:#EE9319; font-family: 'Open Sans', sans-serif;color: white">Participar</label>
            </div>

            <div id="columnsInfo" class="col s12  text-center center-align"  style="height: auto; width: 100% ">  
                <progress value="0" max="100" id="uploader">0% </progress>
            </div>

            <div class="row">
                <div class="col s12 m4" style=" text-align: center;">
                    <img src="logoBienestar.png" style="max-width: 200px; min-width: 150px">
                </div>

                <div class="col s12 m4"  style=" text-align: center;">
                    <a >
                    <h6 style="color: #EE9319; padding: 40px;font-family: 'Lato', sans-serif;font-weight:700; text-transform: uppercase;"><span style="font-weight:400"></span> Bases del Concurso </h6>
                  </a>
                </div>
                <div class="col s12 m4 "  style=" text-align: center; ">
                    <img src="logoCorbela.png" style="max-width: 200px; min-width: 150px">
                </div>
            </div>




          </div>
      
    </div> 
</div>

`;

module.exports = login;