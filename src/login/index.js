var page = require('page');

var yo = require('yo-yo');
var empty = require('empty-element');
var templateEmpty = require('./templateEmpty');



var imagesFBRef = firebase.database().ref().child('curso').orderByKey();
var paginaActual = 1;


page('/', function(ctx,next){	
	load();
});

function load(){
	var main = document.getElementById('main-container');
	empty(main).appendChild(templateEmpty);
	const headerTemplate= require('../header/headerLogin');
    const header = document.getElementById('header-container');
    empty(header).appendChild(headerTemplate());

	const footer = document.getElementById('footer-container');
	const footerTemplate= require('../footer/footer');
	empty(footer).appendChild(footerTemplate);

	const titleTemplate= require('../title/title');
    const title = document.getElementById('title-container');
    empty(title); 	

    $('#btnLogin').click(function(){
     	const txtEmail = $('#txtEmail').val();
     	const txtPassword = $('#txtPassword').val();
      	console.log("Enviar:", txtPassword , txtEmail);
      	const auth = firebase.auth();
      	const promise = auth.signInWithEmailAndPassword(txtEmail,txtPassword);
		promise.catch(e => console.log(e.message));
  
    });

 
    firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			console.log(firebaseUser);
			console.log('Ha sucedido');

			 page.redirect('/home');

		}else {
			console.log('Not logged in');
		}
	});

    $( "#txtPassword").keypress(function( event ) {
	  if ( event.which == 13 ) {
	     $('#btnLogin').click(function(){
	     	const txtEmail = $('#txtEmail').val();
	     	const txtPassword = $('#txtPassword').val();
	      	console.log("Enviar:", txtPassword , txtEmail);
	      	const auth = firebase.auth();
	      	const promise = auth.signInWithEmailAndPassword(txtEmail,txtPassword);
			promise.catch(e => console.log(e.message));
	  
    	});
	  }
	});

	
	console.log("login page");	

}



