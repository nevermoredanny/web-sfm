'use strict';

App.Router.map(function() {
    this.resource('input', function(){
        this.route('index');
//        this.resource('images', { path: '/images/:id' });
    });
});


App.InputRoute = Ember.Route.extend({

    model: function(){
        return App.Data.images;
    }

});


App.InputIndexRoute = Ember.Route.extend({

    model: function(){
        return App.Data.images;
    }

});


App.InputImagesRoute = Ember.Route.extend({

    model: function(params){

    }

});