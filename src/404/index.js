var page = require('page');

page('/*', function(ctx,next){ 
  page.redirect('/');
});
