var express= require('express');   // busca en node_module express y
        //  asignan en express lo que exporta 
        //  el main 
var app= express();
app.set('view engine','pug');     //maneja las vistas en view
app.use(express.static('public'));  // busca el css y los assests en public


app.get(['/'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting La Araucana'
	});
})

app.get(['/curso'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})

app.get(['/porAprobar'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})
app.get(['/rechazadas'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})
app.get(['/aprobadas'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})

app.get(['/participantes'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})
app.get(['/seleccionadas'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})
app.get(['/ganadores'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})

app.get(['/home'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})

app.get(['/formulario'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})

app.get(['/*'],function(req,res){   // busca index en view (pug)
	res.render('index', {
		title: 'Casting'
	});
})


// // init server
app.listen(80,function(err){
	if (err) return console.log('Hubo error'), process.exit(1);
console.log('Escuchando en el Puerto 8080');
})


// app.listen(8080,function(err){
// 	if (err) return console.log('Hubo error'), process.exit(1);
// console.log('Escuchando en el Puerto 8080');
// })

