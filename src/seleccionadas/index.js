

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDParticipantes ="";
var urlBDpreSeleccionado1 ="";
var urlBDGanador1 ="";

var lblTitle1 ="";
var lblTitle2 ="";

var category ="";

var pathPageLocal ="/seleccionadas";

page('/seleccionadas', function(ctx,next){ 

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre"){
      urlBDParticipantes    = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/hombre/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/pensionado/hombre/aprobada/ganador1/";

      lblTitle1 =  'Categoria Pensionados Hombre';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "pensionadoMujer"){
      urlBDParticipantes    = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/mujer/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/pensionado/mujer/aprobada/ganador1/";

      lblTitle1 =  'Categoria Pensionados Mujer';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "trabajadorHombre45"){
      urlBDParticipantes    = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/45/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/trabajador/hombre/45/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Hombre 45';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "trabajadorHombre25"){
      urlBDParticipantes    = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/25/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/trabajador/hombre/25/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Hombre 25';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "trabajadorMujer40"){
      urlBDParticipantes    = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/40/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/trabajador/mujer/40/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Mujer 40';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "trabajadorMujer20"){
      urlBDParticipantes    = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/20/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/trabajador/mujer/20/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Mujer 20';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "kidHombre15"){
      urlBDParticipantes    = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/15/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/kid/hombre/15/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Hombre 15';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "kidHombre10"){
      urlBDParticipantes    = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/10/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/kid/hombre/10/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Hombre 10';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "kidMujer15"){
      urlBDParticipantes    = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/15/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/kid/mujer/15/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Mujer 15';
      lblTitle2 =  'Seleccionadas';

      load();

    }else if(category == "kidMujer6"){
      urlBDParticipantes    = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/6/aprobada/preSeleccionados1/";
      urlBDGanador1         = "registroConcursante/kid/mujer/6/aprobada/ganador1/";

      lblTitle1 =  'Categoria Trabajador Mujer 6';
      lblTitle2 =  'Seleccionadas';

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
 console.log("btnActios");
  $('.btnWinner').click(function(){
    winner($(this));
  });
   $('.btnDelete').click(function(){
    rechazar($(this));
  });
  $('.favoriteBtnStart').click( function(){
      starts($(this));
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

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","desktopHd.png","tablet.png"));

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
    return firebase.database().ref().child(urlBDpreSeleccionado1)
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
    return firebase.database().ref().child(urlBDpreSeleccionado1)
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
  const card = require('../card/cardPreseleccionado');
  var i =0;
  for (var key in datos){   
    content.appendChild(card(keys[i],datos[key].rut,keys[i],datos[key].urlImagen,datos[key].urlImagen_thumb,datos[key].status,datos[key].score));
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


function winner(thisObj){
  var codigoTotal = thisObj.attr('id');
  var auxAlt = "";
  var key ="";
  var updateRefFB;
  var updateRefFB2;
  var updateRefFB3;

  if (thisObj.text() == "star_border"){
    key = codigoTotal.replace("btnStar","");
    console.log("codigo:",key);

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

    thisObj.text('star');
    
    updateRefFB.update({status:"winner"});
    updateRefFB2.update({status:"winner"});
    updateRefFB2.once("value",function(snapshot){
      var datos = snapshot.val();
      if (datos == null){
        console.log('error en codigo y tabla');
      }else {
      updateRefFB3.set({
              name: datos.name,
              lastName: datos.lastName,
              rut: datos.rut,
              email: datos.email,
              phone: datos.phone,
              nameImagen: datos.nameImagen,
              urlImagen: datos.urlImagen,
              urlImagen_thumb: datos.urlImagen_thumb,
              category: datos.category,
              status: datos.status,
              score: datos.score
              })
      }
    });
  }else {
    key = codigoTotal.replace("btnStar","");

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

    thisObj.text('star_border');

    updateRefFB.update({status:"false"});
    updateRefFB2.update({status:"false"});
   
    updateRefFB3.remove();
  }      
  console.log("codigo:",key);
}


function starts(thisObj){
  var key = thisObj.attr('id');
  var auxAlt = "";

  var updateRefFB;
  var updateRefFB2; 
  var updateRefFB3;

  var starContent= thisObj.text();


  
  if (key.includes("star1")){
    key = key.replace("star1","");
    var keyBtnStart ="#"+key+"btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:" ,flagBtnStar);
    console.log("flagBtnStar:" ,flagBtnStar);

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    
    if (starContent == "star_border"){
        thisObj.text('star');
        updateRefFB.update({score: "1"});
        updateRefFB2.update({score: "1"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "1"});
        }

        const p2="#"+key+"star2" ;
        $(p2).text('star_border');
        const p3="#"+key+"star3" ;
        $(p3).text('star_border');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
       
    }else {
        thisObj.text('star_border');
        updateRefFB.update({score: "0"});
        updateRefFB2.update({score: "0"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "0"});
        }

        const p2="#"+key+"star2" ;
        $(p2).text('star_border');
        const p3="#"+key+"star3" ;
        $(p3).text('star_border');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
    }
    
  }else if (key.includes("star2")){
    key = key.replace("star2","");
    var keyBtnStart ="#"+key+"btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:" ,flagBtnStar);
    console.log("flagBtnStar:" ,flagBtnStar);

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    
    if (starContent == "star_border"){
        thisObj.text('star');
        updateRefFB.update({score: "2"});
        updateRefFB2.update({score: "2"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "2"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star');
        const p3="#"+key+"star3" ;
        $(p3).text('star_border');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
       
    }else {
        thisObj.text('star_border');
        updateRefFB.update({score: "0"});
        updateRefFB2.update({score: "0"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "0"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star_border');
        const p3="#"+key+"star3" ;
        $(p3).text('star_border');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
    }  
  }else if (key.includes("star3")){
    key = key.replace("star3","");
    var keyBtnStart ="#"+key+"btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:" ,flagBtnStar);
    console.log("flagBtnStar:" ,flagBtnStar);

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    
    if (starContent == "star_border"){
        thisObj.text('star');
        updateRefFB.update({score: "3"});
        updateRefFB2.update({score: "3"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "3"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star');
        const p2="#"+key+"star2" ;
        $(p2).text('star');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
       
    }else {
        thisObj.text('star_border');
        updateRefFB.update({score: "0"});
        updateRefFB2.update({score: "0"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "0"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star_border');
        const p2="#"+key+"star2" ;
        $(p2).text('star_border');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
    }
  
  }else if (key.includes("star4")){
    key = key.replace("star4","");
    var keyBtnStart ="#"+key+"btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:" ,flagBtnStar);
    console.log("flagBtnStar:" ,flagBtnStar);

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    
    if (starContent == "star_border"){
        thisObj.text('star');
        updateRefFB.update({score: "4"});
        updateRefFB2.update({score: "4"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "4"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star');
        const p2="#"+key+"star2" ;
        $(p2).text('star');
        const p3="#"+key+"star3" ;
        $(p3).text('star');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
       
    }else {
        thisObj.text('star_border');
        updateRefFB.update({score: "0"});
        updateRefFB2.update({score: "0"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "0"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star_border');
        const p2="#"+key+"star2" ;
        $(p2).text('star_border');
        const p3="#"+key+"star3" ;
        $(p3).text('star_border');
        const p5="#"+key+"star5" ;
        $(p5).text('star_border');
    }

  }else if (key.includes("star5")){
    key = key.replace("star5","");

    var keyBtnStart ="#"+key+"btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:" ,flagBtnStar);
    console.log("flagBtnStar:" ,flagBtnStar);

    updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    

    if (starContent == "star_border"){
        thisObj.text('star');
        updateRefFB.update({score: "5"});
        updateRefFB2.update({score: "5"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "5"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star');
        const p2="#"+key+"star2" ;
        $(p2).text('star');
        const p3="#"+key+"star3" ;
        $(p3).text('star');
        const p4="#"+key+"star4" ;
        $(p4).text('star');

    }else {
        thisObj.text('star_border');
        updateRefFB.update({score: "0"});
        updateRefFB2.update({score: "0"});

        if(flagBtnStar == "star"){
          updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
          updateRefFB3.update({score: "0"});
        }

        const p1="#"+key+"star1" ;
        $(p1).text('star_border');
        const p2="#"+key+"star2" ;
        $(p2).text('star_border');
        const p3="#"+key+"star3" ;
        $(p3).text('star_border');
        const p4="#"+key+"star4" ;
        $(p4).text('star_border');
    }  

  }
  console.log("codigo:",key);
}

function rechazar(thisObj){

  var codigoTotal = thisObj.attr('id');
  var auxAlt = "";
  var key = codigoTotal.replace("btnDelete","");
  var idBtnStart = "#"+key +"btnStar";
  var idCard = "#"+key +"card";

  var updateRefFB  = firebase.database().ref().child(urlBDParticipantes + key);
  var updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
  var updateRefFB3;  
  if ($(idBtnStart).text() == "star") {
      updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
      updateRefFB3.remove();
      updateRefFB2.remove();
      updateRefFB.update({category: "false", status: "false", score:"0"});
      $(idCard).remove();
  }else {
      updateRefFB2.remove();
      updateRefFB.update({category: "false", status: "false", score:"0"});
      $(idCard).remove();
  }

}

