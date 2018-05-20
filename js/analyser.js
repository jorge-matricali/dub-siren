/*
Copyright (c) 2018 Jorge Matricali <jorgematricali@gmail.com>
All rights reserved.

This code is licensed under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function Analyser (context, opt) {
    'use strict';

    console.log('Creating new analyzer...');

    if (!context) {
        console.log('ERROR: Siren cannot be started.');
        return -1;
    }

    context.resume().then(function () {
        console.log('Audio context playback resumed successfully');
    });

    var defaults = {
        'width': '100%',
        'height': '100px'
    };

    var options = Object.assign({}, defaults, opt);

    // Analiser
    var analyser = context.createAnalyser();

    // Creating UI elements
    var container = document.createElement('div');
    container.classList.add('analyser');

    var canvas = document.createElement('canvas');
    canvas.style.width = options.width;
    canvas.style.height = options.height;

    var an = {
        '_context': context,
        '_container': container,
        '_analyser': analyser,
        '_analyserCanvas': canvas,
        '_analyserCanvasCtx': canvas.getContext('2d'),

        /*
		 * Properties of this oscillator.
		 */
		'_properties': options,

        /*
		 * Returns the value of a property of this pad.
		 */
		'getProperty': function(key) {
			return this._properties[key];
		},

        /*
		 * Sets the value of a property of this pad.
		 */
		'setProperty': function(key, value) {
			this._properties[key] = value;
			this.redraw();
		},

        'node': function () {
            return this._container;
        },

        'connect': function (source) {
            return this._analyser.connect(source);
        },

        /*
		 * Update the view.
		 */
        'redraw': function () {
            var properties = this._properties;
            var analyser = this._analyser;
            var canvas = this._analyserCanvas;
            var canvasCtx = this._analyserCanvasCtx;

            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;
            analyser.fftSize = 2048;
            var bufferLength = analyser.fftSize;
            var dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            var draw = function() {
                var grad = canvasCtx.createLinearGradient(50, 50, 150, 150);
                grad.addColorStop(0, 'red');
                grad.addColorStop(0.5, 'yellow');
                grad.addColorStop(1, 'green');

                var drawVisual = requestAnimationFrame(draw);
                analyser.getByteTimeDomainData(dataArray);
                canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = grad;
                canvasCtx.beginPath();

                var sliceWidth = WIDTH * 1.0 / bufferLength;
                var x = 0;

                for(var i = 0; i < bufferLength; i++) {
                    var v = dataArray[i] / 128.0;
                    var y = v * HEIGHT/2;

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height/2);
                canvasCtx.stroke();
            };

            draw();
        }
    };

    container.appendChild(canvas);

    // Finish initialize
    an.redraw();

    return an;
}
