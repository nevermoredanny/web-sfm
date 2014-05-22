'use strict';

App.SiftView = Ember.View.extend({

    loadng: true,

    canvas: null,

    didInsertElement: function(){
        var _self = this;
        IDBAdapter.promiseData('fullimages', this.controller.get('_id')).then(function(data){
            var img = document.createElement('img');
            img.onload = function(e){
                _self.onImageLoaded(img);
            };
            img.src = data;
        });
        this.controller.addObserver('model', this, this.onNewImage);
    },

    onNewImage: function(){
        var _self = this;
        this.set('loading', true);
        IDBAdapter.promiseData('fullimages', this.controller.get('_id')).then(function(data){
            var img = document.createElement('img');
            img.onload = function(e){
                _self.onImageLoaded(img);
            };
            img.src = data;
        });
    },

    onImageLoaded: function(img){
        var _self = this;

        this.set('loading', false);
        var fixedWidth = this.$().width();
        var ratio = fixedWidth/img.width,
            height = img.height*ratio;
        var canvas;

        if (this.get('canvas')){
            canvas = this.get('canvas');
        }
        else {
            canvas = this.$('canvas')[0];
            this.set('canvas', canvas);
        }

        canvas.width = fixedWidth;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, fixedWidth, height);

        getSiftSample(this.controller.get('filename').split('.')[0], function(features){
            console.log('sift loaded');
            _self.drawFeatures(ctx, features.features, img.height, ratio);
        });
//        IDBAdapter.promiseData('features', this.controller.get('_id')).then(_.bind(this, function(features){
//            this.drawFeatures(ctx, features, height, ratio);
//        }));
    },

    drawFeatures: function(ctx, features, height, scale, options){
        options = options || {};
        _.defaults(options, {
            color: 'red',
            markSize: 3
        });

        ctx.beginPath();
        ctx.strokeStyle = options.color;
        ctx.lineWidth = options.markSize/2;
        _.each(features, function(feature){
            var x = scale*feature.col,
                y = scale*feature.row;
            ctx.moveTo(x-options.markSize, y);
            ctx.lineTo(x+options.markSize, y);
            ctx.moveTo(x, y-options.markSize);
            ctx.lineTo(x, y+options.markSize);
        });
        ctx.stroke();
    }

});