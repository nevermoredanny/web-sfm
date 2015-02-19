'use strict';

var _ = require('underscore');

var extremum = require('./subpixel-extremum.js'),
    settings = require('./settings.js'),
    CONTRAST_THRESHOLD = settings.CONTRAST_THRESHOLD,
    DETECTION_BORDER = settings.DETECTION_BORDER;

//================================================================


/**
 *
 * @param {DogPyramid} dogspace
 * @param {GuassianPyramid} scales
 * @param {function} callback
 */
module.exports = function(dogspace, scales, callback){

    _.range(1, dogspace.pyramid.length-1).forEach(function(layer){

        var scale = scales.pyramid[layer];

        module.exports.detect(dogspace, layer, function(row, col){
            var detectedF = { row: row, col: col, octave: scales.octave, layer: layer };
            callback(scale, detectedF);
        })

    });

};


/**
 * @param {DogPyramid} dogspace
 * @param {int} layer
 * @param {Function} callback
 */
module.exports.detect = function(dogspace, layer, callback){

    console.log('detecting feature points');

    var img = dogspace.pyramid[layer].img,
        width = img.shape[0],
        height = img.shape[1],
        contrastWindow = [-1,0,1];


    var row, col;

    for (row=DETECTION_BORDER; row<height-DETECTION_BORDER; row++) {
        for (col=DETECTION_BORDER; col<width-DETECTION_BORDER; col++) {

            (function(){

                var center = img.get(col, row),
                    max = -Infinity,
                    min = Infinity,
                    subpixel;

                if (Math.abs(center) < CONTRAST_THRESHOLD/2) {
                    return;
                }

                var isLimit = contrastWindow.every(function(x){
                    return contrastWindow.every(function(y){
                        return contrastWindow.every(function(z){
                            if(x===0 && y===0 && z===0) {
                                return true;
                            }
                            else {
                                var cursor = dogspace.get(row+y, col+x, layer+z);
                                if (cursor > max) {
                                    max = cursor;
                                }
                                if (cursor < min) {
                                    min = cursor;
                                }
                                return center < min || center > max;
                            }
                        });
                    });
                });

                if (isLimit) {
                    subpixel = extremum.subpixel(dogspace, row, col, layer);
                    if (subpixel && Math.abs(subpixel.value) > CONTRAST_THRESHOLD) {
                        callback(subpixel.row, subpixel.col);
                    }
                    //callback(row, col);
                }

            })();

        }
    }

};