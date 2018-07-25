

var page = require('page');
var yo = require('yo-yo');

const lblTitle1 =  'Elige tu Categoría';
const lblTitle2 =  'Casting La Araucana';


var datos = [{category:'Pensionado Hombre', img:'pensionadoHombre.jpg',  id:'btnCategory1'},
             {category:'Pensionado Mujer', img:'pensionadoMujer.jpg', id:'btnCategory2'},
             {category:'Trabajador Hombre 45 ', img:'trabajadorHombre45.jpg',  id:'btnCategory3'},
             {category:'Trabajador Hombre 25 ', img:'trabajadorHombre25.jpg',  id:'btnCategory4'},
             {category:'Trabajador Mujer 40 ', img:'trabajadorMujer40.jpg',  id:'btnCategory5'},
             {category:'Trabajador Mujer 20 ', img:'trabajadorMujer20.jpg',  id:'btnCategory6'},
             {category:'Niño 15 ', img:'kidHombre15.jpg',  id:'btnCategory7'},
             {category:'Niño 10 ', img:'kidHombre10.jpg',  id:'btnCategory8'},
             {category:'Niña 15 ', img:'kidMujer15.jpg',  id:'btnCategory9'},
             {category:'Niña 6 ', img:'kidMujer6.jpg',  id:'btnCategory10'}
];
page('/home', function(ctx,next){ 
  load();
});

function load(ctx,next){

  var user = firebase.auth().currentUser;

  if (user) {
    console.log('----------Home page--------');
    loadHeader(); 
    loadPage();

    loadFooter();
    loadImages();
    btnActios();
    $('.dropdown-button').dropdown();  // iniciar menu escuchador

  }else {
    page.redirect('/');
  }
}

function btnActios(){
  $('#btnCategory1').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "pensionadoHombre");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory2').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "pensionadoMujer");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory3').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "trabajadorHombre45");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory4').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "trabajadorHombre25");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory5').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "trabajadorMujer40");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory6').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "trabajadorMujer20");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory7').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "kidHombre15");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory8').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "kidHombre10");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });
  $('#btnCategory9').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "kidMujer15");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
  });

  $('#btnCategory10').click(function(){ 
   console.log('btnCategory1');
   sessionStorage.setItem("category", "kidMujer6");
   sessionStorage.setItem("key",true);
   page('/porAprobar');
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
  const headerTemplate= require('../header/headerHome');
  const header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","tablet.png","desktopHd.png"));

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



function loadImages(){
  const content = document.getElementById('addPhoto');
  const card = require('../card/cardCategory');
  var i =0;
  for (var key in datos){   
    content.appendChild(card(datos[key].category,datos[key].img, datos[key].id));
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



