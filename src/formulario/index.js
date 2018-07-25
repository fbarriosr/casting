var page = require('page');

var imagesFBRef = firebase.database().ref().child('registroConcursante/porAprobar');

var imagenName = "";
var downloadURL ="";
var envio = false;
var file = null;

var edadAux= false;
var categoriaTipo = null;


page('/formulario', function(ctx,next){ 
  load();
});



function load(ctx,next){
  console.log('----------Home page--------');
  loadHeader(); 
  loadPage();

  loadFooter();
  paginaUno();
  btnSexo();
  $('select').material_select();
  $('.dropdown-button').dropdown(); // dropdown abrir

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
  const headerTemplate= require('../header/headerLogin');
  const header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  const sliderTemplate= require('../slider/slider');
  const slider = document.getElementById('slider-container');
  empty(slider).appendChild(sliderTemplate('mobile.png','tablet.png','desktopHd.png'));

  const titleTemplate= require('../title/title');
  const title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate('Ingresa tus Datos', 'Casting La Araucana'));

  console.log('************loadHeader() ************');
}

function loadPage(){
  console.log('------------loadPage() ------------');
  const aux = require('./template');
  const main = document.getElementById('main-container');
  const empty = require('empty-element'); 
  empty(main).appendChild(aux);
  
  console.log('************loadPage() ************');
}


function paginaUno() {

    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('exampleFileUpload');

    // Listen for file selection

    fileButton.addEventListener('change', function(e){

      // get file

      file = e.target.files[0];

      var nameRand = Math.floor((Math.random() * 100000000) + 1);

      imagenName = nameRand+'_'+file.name;
      console.log('file',file);
      console.log('image',imagenName);

    });


    $('#fieldGood').find('#close-modal').click(function(event){
        event.preventDefault();
        location.reload();
        console.log('hola');
    });

    $('#btnSend').click(function(){

        var name = $('#name').val();
        var lastName = $('#lastName').val();  
        var rut = $('#rut').val();
        var email = $('#email').val();
        var phone = $('#phone').val();

        var id = Math.floor((Math.random() * 100000000) + 1);

        if(file == null){
           $('#fotoNone').modal('open');

        }else if(file != null){

          console.log("DATA ");
          console.log("name: ",name);
          console.log("lastName: ",lastName);
          console.log("rut: ",rut);
          console.log("email: ",email);
          console.log("phone: ",phone);
          categoriaTipo = getCategoria();

          if (name == "" || lastName == "" || rut == "" || email == "" || phone == "" || categoriaTipo == null ){
             console.log("vacio ");  
            // alert("Debes Completar los campos pedidos");
             $('#fotoNone').modal('open');

          }else {
              
              var aux = $.rut.formatear(rut) 
              var es_valido = $.rut.validar(aux);
              var es_mail = validateEmail(email);

              if (es_valido && es_mail){
                 //alert('rut  y email valido');

                 //console.log("rut  y email valido");

                 checkRutBaseDatos(name, lastName,rut,email,phone,imagenName,downloadURL,categoriaTipo);

              }else if (es_valido && !es_mail){
                 $('#fieldMailMalo').modal('open');

              }else if (!es_valido && es_mail){
                 $('#fieldRutMalo').modal('open');
              }else if (!es_valido && !es_mail){
                $('#fieldRutMailMalo').modal('open');

              }
          }
        }
    });

    $(document).on($.modal.CLOSE,function(){
     console.log('cerrar modal');
     if (envio) {
        location.reload(true);
     }
    })


    function checkRut(rut) {
        // Despejar Puntos
        var valor = rut.value.replace('.','');
        // Despejar Guión
        valor = valor.replace('-','');
        
        // Aislar Cuerpo y Dígito Verificador
        cuerpo = valor.slice(0,-1);
        dv = valor.slice(-1).toUpperCase();
        
        // Formatear RUN
        rut.value = cuerpo + '-'+ dv
        
        // Si no cumple con el mínimo ej. (n.nnn.nnn)
        if(cuerpo.length < 7) { rut.setCustomValidity("RUT Incompleto"); return false;}
        
        // Calcular Dígito Verificador
        suma = 0;
        multiplo = 2;
        
        // Para cada dígito del Cuerpo
        for(i=1;i<=cuerpo.length;i++) {
        
            // Obtener su Producto con el Múltiplo Correspondiente
            index = multiplo * valor.charAt(cuerpo.length - i);
            
            // Sumar al Contador General
            suma = suma + index;
            
            // Consolidar Múltiplo dentro del rango [2,7]
            if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
      
        }
        
        // Calcular Dígito Verificador en base al Módulo 11
        dvEsperado = 11 - (suma % 11);
        
        // Casos Especiales (0 y K)
        dv = (dv == 'K')?10:dv;
        dv = (dv == 0)?11:dv;
        
        // Validar que el Cuerpo coincide con su Dígito Verificador
        if(dvEsperado != dv) { rut.setCustomValidity("RUT Inválido"); return false; }
        
        // Si todo sale bien, eliminar errores (decretar que es válido)
        rut.setCustomValidity('');
        return true;
    }

    function validateEmail($email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailReg.test( $email );
    }

    function guardarInfoImagenes(name, lastName,rut,email,phone,imagenName,downloadURL,categoriaTipo){ 
        imagesFBRef.push({
        name: name,
        lastName: lastName,
        rut: rut,
        email: email,
        phone: phone,
        nameImagen: imagenName,
        urlImagen:"null",
        urlImagen_thumb:"null",
        score: "0",
        category: categoriaTipo
        });

//. aqui kede hay k agregar subir imagen y luego ir a programar el servidor
        var storageRef = firebase.storage().ref('fotos/' + categoriaTipo+'/'+imagenName);

        // upload file

        var task = storageRef.put(file);

        task.on('state_changed',

            function progress(snapshot){
                var porcentaje = (snapshot.bytesTransferred/snapshot.totalBytes ) * 100;
                uploader.value = porcentaje;
            },

            function error(err){

            },

            function complete(){ 
              envio = true;
              console.log("envio:",envio);
              $('#fieldGood').modal('open');
            }
        );
    }
    function checkRutBaseDatos(name, lastName,rut,email,phone,imagenName,downloadURL,categoriaTipo){ 
      rut = rut.replace('-', '');
      var path = "registroConcursante/"+ categoriaTipo+ "/aprobada/participantes";
      var aux = firebase.database().ref().child(path).orderByChild("rut").equalTo(rut);
      var datos;
      aux.once("value",function(snapshot){
        datos = snapshot.val();
        if (datos!= null){
          for (var key in datos){
            console.log('rut Exite name', datos[key].name);
          }
          $('#fieldRutMailDoble').modal('open');
  
          return true;
        }else{
          console.log('rut no Exite ');
          path = "registroConcursante/"+ categoriaTipo+ "/porAprobar";
          imagesFBRef = firebase.database().ref().child(path);
          guardarInfoImagenes(name, lastName,rut,email,phone,imagenName,downloadURL,categoriaTipo)
          return false;
        }   
      })
      return true;
    }
}

function cleanBoxEdad(){
  $('#edad')
        .find('option')
        .remove()
        .end()
        .append('<option value="" disabled selected>Edad</option>')
        .val('')
      ;
  $('select').material_select();
}

function btnSexo(){
    $('#sexo').on('change', function() {
      const sexo = $("#sexo option:selected").text();
      const cat = $("#cat option:selected").text();
      
      console.log(cat);
      console.log(sexo);

      if(cat == "Pensionado" && (sexo =="Hombre" || sexo =="Mujer")) {
        pensionadoHombreMujer();
      }else if (cat == "Trabajador" && sexo =="Hombre"){
        trabajadorHombre()
      }else if (cat == "Trabajador" && sexo =="Mujer"){
        trabajadorMujer();
      }else if (cat == "Niños" && sexo == "Hombre"){
        kidHombre();
      }else if (cat == "Niños" && sexo == "Mujer"){
        kidMujer();
      }
  })
}


function getCategoria(){
  const sexo = $("#sexo option:selected").text();
  const cat = $("#cat option:selected").text();
  const edad = $("#edad option:selected").text();

  if(cat == "Pensionado" && sexo == "Hombre") {
    categoriaTipo="pensionado/hombre";
  }else if(cat == "Pensionado" && sexo == "Mujer") {
    categoriaTipo="pensionado/mujer";
  }else if(cat == "Trabajador" && sexo == "Hombre" && edad =="45 Años") {
    categoriaTipo="trabajador/hombre/45";
  }else if(cat == "Trabajador" && sexo == "Hombre" && edad =="25 Años") {
    categoriaTipo="trabajador/hombre/25";
  }else if(cat == "Trabajador" && sexo == "Mujer" && edad =="40 Años") {
    categoriaTipo="trabajador/mujer/40";
  }else if(cat == "Trabajador" && sexo == "Mujer" && edad =="20 Años") {
    categoriaTipo="trabajador/mujer/20";
  }else if(cat == "Niños" && sexo == "Hombre" && edad =="15 Años") {
    categoriaTipo="kid/hombre/15";
  }else if(cat == "Niños" && sexo == "Hombre" && edad =="10 Años") {
    categoriaTipo="kid/hombre/10";
  }else if(cat == "Niños" && sexo == "Mujer" && edad =="15 Años") {
    categoriaTipo="kid/mujer/15";
  }else if(cat == "Niños" && sexo == "Mujer" && edad =="6 Años") {
    categoriaTipo="kid/mujer/6";
  }    
  console.log(categoriaTipo);
  return categoriaTipo;
}

function pensionadoHombreMujer(){
  $('#edadParent').hide();
  edadAux = true;

}

function trabajadorHombre(){

  if(edadAux){
      $('#edadParent').show();
  }

  $('#edad')
        .find('option')
        .remove()
        .end()
        .append('<option value="" disabled selected>Edad</option>')
        .val('')
        .append('<option value="1" selected>25 Años</option>')
        .val('')
        .append('<option value="2" selected>45 Años</option>')
        .val('')
      ;
  $('select').material_select();
}
function trabajadorMujer(){

  if(edadAux){
      $('#edadParent').show();
  }
  $('#edad')
        .find('option')
        .remove()
        .end()
        .append('<option value="" disabled selected>Edad</option>')
        .val('')
        .append('<option value="1" selected>20 Años</option>')
        .val('')
        .append('<option value="2" selected>40 Años</option>')
        .val('')
      ;
  $('select').material_select();
}


function kidMujer(){

  if(edadAux){
      $('#edadParent').show();
  }

  $('#edad')
        .find('option')
        .remove()
        .end()
        .append('<option value="" disabled selected>Edad</option>')
        .val('')
        .append('<option value="1" selected>6 Años</option>')
        .val('')
        .append('<option value="2" selected>15 Años</option>')
        .val('')
      ;
  $('select').material_select();
}
function kidHombre(){

  if(edadAux){
      $('#edadParent').show();
  }
  $('#edad')
        .find('option')
        .remove()
        .end()
        .append('<option value="" disabled selected>Edad</option>')
        .val('')
        .append('<option value="1" selected>10 Años</option>')
        .val('')
        .append('<option value="2" selected>15 Años</option>')
        .val('')
      ;
  $('select').material_select();
}




