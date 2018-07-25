

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDPorAprobar ="";
var urlBDAprobada ="";  
var urlBDRechazada =""; 

var lblTitle1 ="";
var lblTitle2 ="";

var category ="";

var pathPageLocal ="/rechazadas";

page('/rechazadas', function(ctx,next){ 

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre"){
      urlBDPorAprobar = "registroConcursante/pensionado/hombre/porAprobar";
      urlBDAprobada   = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/pensionado/hombre/rechazado";

      lblTitle1 =  'Categoria Pensionados Hombre';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "pensionadoMujer"){
      urlBDPorAprobar = "registroConcursante/pensionado/mujer/porAprobar";
      urlBDAprobada   = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/pensionado/mujer/rechazado";

      lblTitle1 =  'Categoria Pensionados Mujer';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "trabajadorHombre45"){
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/45/porAprobar";
      urlBDAprobada   = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/trabajador/hombre/45/rechazado";

      lblTitle1 =  'Categoria Trabajador Hombre 45';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "trabajadorHombre25"){
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/25/porAprobar";
      urlBDAprobada   = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/trabajador/hombre/25/rechazado";

      lblTitle1 =  'Categoria Trabajador Hombre 25';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "trabajadorMujer40"){
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/40/porAprobar";
      urlBDAprobada   = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/trabajador/mujer/40/rechazado";

      lblTitle1 =  'Categoria Trabajador Mujer 40';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "trabajadorMujer20"){
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/20/porAprobar";
      urlBDAprobada   = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/trabajador/mujer/20/rechazado";

      lblTitle1 =  'Categoria Trabajador Mujer 20';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "kidHombre15"){
      urlBDPorAprobar = "registroConcursante/kid/hombre/15/porAprobar";
      urlBDAprobada   = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/kid/hombre/15/rechazado";

      lblTitle1 =  'Categoria Trabajador Hombre 15';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "kidHombre10"){
      urlBDPorAprobar = "registroConcursante/kid/hombre/10/porAprobar";
      urlBDAprobada   = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/kid/hombre/10/rechazado";

      lblTitle1 =  'Categoria Trabajador Hombre 10';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "kidMujer15"){
      urlBDPorAprobar = "registroConcursante/kid/mujer/15/porAprobar";
      urlBDAprobada   = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/kid/mujer/15/rechazado";

      lblTitle1 =  'Categoria Trabajador Mujer 15';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else if(category == "kidMujer6"){
      urlBDPorAprobar = "registroConcursante/kid/mujer/6/porAprobar";
      urlBDAprobada   = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDRechazada  = "registroConcursante/kid/mujer/6/rechazado";

      lblTitle1 =  'Categoria Trabajador Mujer 6';
      lblTitle2 =  'Imágenes Rechazadas';

      load();

    }else {

      page.redirect('/home');

    }
    
  } else {
     page.redirect('/');
  }

  

  
});


function load(ctx,next){
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader(); 
  loadPage();

  loadFooter();
  loadImages(itemPorPagina,referenceToOldestKey);

  $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() >= getDocHeight()) {
         //alert("bottom! ok");
        console.log("bottom! ok");
        referenceToOldestKey = sessionStorage.getItem("key");
        loadImages(itemPorPagina,referenceToOldestKey);
       }
  }); 

  $('.dropdown-button').dropdown(); 
}

function btnActios(){

  $('.btnDelete').click(function(){
    rechazar($(this));
  });
  menubtns();
  menuLateral();
}


function menuLateral(){
  $('#itemMenuCategorias').click(function(){ 
   console.log('itemMenuCategorias');
   sessionStorage.setItem("key",true);
   page('/home');
  });

  $('#itemMenuParticipantes').click(function(){ 
   console.log('itemMenuParticipantes');
   sessionStorage.setItem("key",true);
   page('/participantes');
  });

   $('#itemMenuSeleccionadas').click(function(){ 
   console.log('itemMenuSeleccionadas');
   sessionStorage.setItem("key",true);
   page('/seleccionadas');
  });


  $('#itemMenuGanadores').click(function(){ 
   console.log('itemMenuGanadores');
   sessionStorage.setItem("key",true);
   page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function(){ 
   console.log('itemMenuRechazadas');
   sessionStorage.setItem("key",true);
   page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function(){ 
   console.log('itemMenuAprobar');
   sessionStorage.setItem("key",true);
   page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function(){ 
   console.log('itemMenuPorAprobar');
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });

  $('#itemMenulogOut').click(function(){ 
   console.log('itemMenulogOut');
   sessionStorage.setItem("category", "true");
   sessionStorage.setItem("key",true);
   firebase.auth().signOut();
   page('/');
  });
}   


function menubtns(){
         
  $('#btnParticipantes').click(function(){ 
   console.log('btnParticipantes');
   sessionStorage.setItem("key",true);
   page('/participantes');
  });

   $('#btnSeleccionadas').click(function(){ 
   console.log('btnSeleccionadas');
   sessionStorage.setItem("key",true);
   page('/seleccionadas');
  });


  $('#btnGanadores').click(function(){ 
   console.log('btnGanadores');
   sessionStorage.setItem("key",true);
   page('/ganadores');
  });

  $('#btnRechazar').click(function(){ 
   console.log('btnRechazar');
   sessionStorage.setItem("key",true);
   page('/rechazadas');
  });

  $('#btnAprobar').click(function(){ 
   console.log('btnAprobar');
   sessionStorage.setItem("key",true);
   page('/aprobadas');
  });

  $('#btnporAprobar').click(function(){ 
   console.log('btnporAprobar');
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });


  $('#btnKidMujer6').click(function(){
   if (category == "kidMujer6"){
      console.log('btnKidMujer6');
   }else{
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }   
  });

  $('#btnKidMujer15').click(function(){ 
   if (category == "kidMujer15"){
      console.log('btnKidMujer15');
   }else{
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }  
  });

  $('#btnKidHombre15').click(function(){ 
   if (category == "kidHombre15"){
      console.log('btnKidHombre15');
   }else{
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }

  });

  $('#btnKidHombre10').click(function(){ 
   if (category == "kidHombre10"){
      console.log('btnKidHombre10');
   }else{
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#btnTrabajadorHombre45').click(function(){ 
   if (category == "trabajadorHombre45"){
      console.log('btnTrabajadorHombre45');
   }else{
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#btnTrabajadorHombre25').click(function(){ 
   if (category == "trabajadorHombre25"){
      console.log('btnTrabajadorHombre25');
   }else{
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#btnTrabajadorMujer40').click(function(){ 
   if (category == "trabajadorMujer40"){
      console.log('btnTrabajadorMujer40');
   }else{
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#btnTrabajadorMujer20').click(function(){ 
   if (category == "trabajadorMujer20"){
      console.log('btnTrabajadorMujer20');
   }else{
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#btnPensionadosHombre').click(function(){ 
   if (category == "pensionadoHombre"){
      console.log('btnPensionadosHombre');
   }else{
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#btnPensionadosMujer').click(function(){ 
   if (category == "pensionadoMujer"){
      console.log('pensionadoMujer');
   }else{
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key",true);
      page(pathPageLocal);
   }
  });

  $('#logOut').click(function(){ 
   console.log('btnLogOut');
   sessionStorage.setItem("category", "true");
   sessionStorage.setItem("key",true);
   firebase.auth().signOut();
   page('/');
  });

}
function loadFooter(){
  console.log('------------loadFooter() ------------');
  const empty = require('empty-element');
  const footer = document.getElementById('footer-container');
  const footerTemplate= require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader(){
  console.log('------------loadHeader() ------------');
  const empty = require('empty-element'); 
  const headerTemplate= require('../header/header');
  const header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  const sliderTemplate= require('../slider/slider');
  const slider = document.getElementById('slider-container');
  empty(slider);

  const titleTemplate= require('../title/title');
  const title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1,lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage(){
  console.log('------------loadPage() ------------');
  const aux = yo`
    <div class="container" >
    <div class="row">
          <div class="row" id="addPhoto" >
        
          </div>
      </div> 
    </div>
  `;
  const main = document.getElementById('main-container');
  const empty = require('empty-element'); 
  empty(main).appendChild(aux);
  
  console.log('************loadPage() ************');
}


function loadImages(item,referenceToOldestKey){
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ",item);
  console.log("referenceToOldestKey If: ",referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDRechazada)
                            .orderByKey()
                            .limitToLast(item)
                            .once('value')
                            .then(function(result){
                              var datos = result.val();
                              if (datos == null){
                                console.log('No hay datos');
                                btnActios();
                                return [null, null,null];
                              }else {
                                console.log('Datos then:',datos);
                                var arrayOfKeys = Object.keys(datos)
                                     .sort()
                                     .reverse();
                                // transforming to array
                                var results = arrayOfKeys
                                   .map((key) => datos[key]);
                          
                                console.log('arrayOfKeys then1:',arrayOfKeys); 
                                console.log('results then1:',results );  

                                // storing reference
                                referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];

                                console.log("referenceToOldestKey Inside: then1",referenceToOldestKey);
                                datos = results;  
                                return [datos, arrayOfKeys, referenceToOldestKey];
                              }
                            })
                            .then(function(datos){
                              const content = document.getElementById('addPhoto');
                              const templateEmpty = require('../empty/templateEmpty');
                              if (datos[0] == null){
                               empty(content).appendChild(templateEmpty);
                               console.log('Datos then2:vacio'); 
                               sessionStorage.setItem("key","null");
                             
                              }else {
                             
                                const referenceToOldestKey = datos[2];
                                const datosRef = datos[0];
                                const arrayOfKeys = datos[1];
                  
                                console.log('Datos then2:',datosRef);
                                console.log('arrayOfKeys then2:',arrayOfKeys);
                                console.log('referenceToOldestKey then2:',referenceToOldestKey);

                                writeImage(datosRef, arrayOfKeys);

                                sessionStorage.setItem("key",referenceToOldestKey);
              
                              }            
                            })
                            .then(function()  {
                               btnActios();
                              
                            })
                            .catch(function(err){
                              console.log('Error', err.code);
                            })


  }else if (referenceToOldestKey == "null"){
    console.log('------------load Images !referenceToOldestKey ------------');

  }else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDRechazada)
                            .orderByKey()
                            .endAt(referenceToOldestKey)
                            .limitToLast(item)
                            .once('value')
                            .then(function(result){
                              var datos = result.val();
                              if (datos == null){
                                console.log('No hay datos');
                                btnActios();
                                return null;
                              }else {
                                console.log('Datos then:',datos);
                                var arrayOfKeys = Object.keys(datos)
                                     .sort()
                                     .reverse();
                                // changing to reverse chronological order (latest first)
                                // & removing duplicate
                                var arrayOfKeys = Object.keys(datos)
                                   .sort()
                                   .reverse()
                                   .slice(1);
                                // transforming to array
                                var results = arrayOfKeys
                                   .map((key) => datos[key]);
                                // updating reference

                                // console.log('arrayOfKeys:',arrayOfKeys); 
                                console.log('loadData results:',results ); 

                                referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
                                datos = results;  
                                return [datos, arrayOfKeys, referenceToOldestKey];
                               }
                            })
                            .then(function(datos){
                              const content = document.getElementById('addPhoto');
                              const templateEmpty = require('../empty/templateEmpty');
                              if (datos == null){
                               empty(content).appendChild(templateEmpty); 
                               sessionStorage.setItem("key","null");
                              }else {
                                const referenceToOldestKey = datos[2];
                                const datosRef = datos[0];
                                const arrayOfKeys = datos[1];
                  
                                console.log('Datos then2:',datosRef);
                                console.log('arrayOfKeys then2:',arrayOfKeys);
                                console.log('referenceToOldestKey then2:',referenceToOldestKey);
              
                                if (referenceToOldestKey == null){
                                  sessionStorage.setItem("key","null");
                                }else{
                                  writeImage(datosRef, arrayOfKeys);
                                  sessionStorage.setItem("key",referenceToOldestKey);
                                }
                              
                              }            
                            })
                            .then(function(){
                               btnActios();
                            })
                            .catch(function(err){
                              console.log('Error', err.code);
                            })
  }
}

function writeImage(datos, keys){
  const content = document.getElementById('addPhoto');
  const card = require('../card/cardRechazadas');
  var i =0;
  for (var key in datos){   
    content.appendChild(card(keys[i],datos[key].rut,keys[i],datos[key].urlImagen,datos[key].urlImagen_thumb));
    console.log("url",keys[key]);
    i++;
  } 
}

function getDocHeight() {
  var D = document;
  return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
  );
}


function rechazar(thisObj){
  var key = thisObj.attr('id');
  var idCard = key+"card";
  console.log("idCard:", idCard);

  var updateRefFB = firebase.database().ref().child(urlBDRechazada+'/'+key);
  updateRefFB.once("value",function(snapshot){
    var datos = snapshot.val();
    if (datos == null){
      console.log('error en codigo y tabla');
    }else {
      var updateRefFB2 = firebase.database().ref().child(urlBDAprobada +'/'+key);
        console.log('ok ref2: ',updateRefFB2);
        //console.log('datos:',datos);
        //console.log('name:',datos.name);
      updateRefFB2.set({
        name: datos.name,
        lastName: datos.lastName,
        rut: datos.rut,
        email: datos.email,
        phone: datos.phone,
        nameImagen: datos.nameImagen,
        urlImagen: datos.urlImagen,
        urlImagen_thumb: datos.urlImagen_thumb,
        category: "false",
        status: "false",
        score: "0"
        })
      }
      updateRefFB.remove();
      const a= document.getElementById(idCard);
      a.remove();
  });
  console.log("codigo:",key);
}

