var yo = require('yo-yo');    

var login = yo`

<div class="valign-wrapper" id="loginBody">
  <div class="row">
    
      <form class="col s12 ">
        <div class="row center-align">
          <img src="mobile.png" width="100%" height="auto">
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="txtEmail" type="text" class="validate" autocomplete="off">
            <label for="txtEmail">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="txtPassword" type="password" class="validate" autocomplete="off">
            <label for="txtPassword">Password</label>
          </div>
        </div>
        <div class="row">
            <a id="btnLogin" class="waves-effect waves-light btn">Entrar</a>
        </div>
      </form>
  </div>
</div>  

`;

module.exports = login;