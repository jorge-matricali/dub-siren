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

function DubSiren (container, options) {
    'use strict';

    console.log('Loading siren...');

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    if (!context) {
        console.log('ERROR: Siren cannot be started.');
        return -1;
    }

    context.resume().then(function () {
        console.log('Audio context playback resumed successfully');
    });

    // Analizer
    var analyser = context.createAnalyser();

    // Master
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    gainNode.connect(context.destination);
    gainNode.connect(analyser);

    // Oscillator
    var oscillatorNode = context.createOscillator();
    oscillatorNode.type = 'sine';
    oscillatorNode.frequency.setValueAtTime(100, context.currentTime); // value in hertz
    oscillatorNode.connect(gainNode);
    oscillatorNode.start();

    while (container.firstChild){
        container.removeChild(container.firstChild);
    }

    // Creating UI elements
    var visualizer = document.createElement('canvas');
    visualizer.id = 'visualizer';
    visualizer.style.width = '100%';
    visualizer.style.height = '100px';
    visualizer.style.display = 'block';

    var triggerButton = document.createElement('button');

    var oscillatorTypes = [
        'sine',
        'square',
        'sawtooth',
        'triangle'
    ];

    var oscillatorTypeSelector = document.createElement('div');

    [].forEach.call(oscillatorTypes, function (e) {
        var rad = document.createElement('input');
        rad.type = 'radio';
        rad.name = 'oscillatorType';
        rad.value = e;
        if (e === 'sine') {
            rad.checked = true;
        }
        rad.classList.add('option-' + e);
        rad.onclick = function () {
            siren._oscillator.type = this.value;
        };
        oscillatorTypeSelector.appendChild(rad);
    });

    var frequencySelector = document.createElement('input');
    frequencySelector.type = 'number';
    frequencySelector.min = 0;
    frequencySelector.max = 1000;
    frequencySelector.value = 100;
    var onchangeFrequency = function () {
        siren._oscillator.frequency.setValueAtTime(this.value, siren._context.currentTime);
    };
    frequencySelector.addEventListener('input', onchangeFrequency);
    frequencySelector.addEventListener('click', onchangeFrequency);

    var siren = {
        '_context': context,
        '_gainNode': gainNode,
        '_container': container,
        '_analyser': analyser,
        '_analyserCanvas': visualizer,
        '_analyserCanvasCtx': visualizer.getContext('2d'),
        '_oscillator': oscillatorNode,

        /*
		 * Properties of this siren.
		 */
		'_properties': {
			'volume': 70
		},

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

        /*
		 * Update the view.
		 */
		'redraw': function() {
			// :D
		},

        'setVolume': function (value) {
            this._properties.volume = value;
            this._gainNode.gain.value = value / 100;
        },

        'visualize': function () {
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
        },

        'up': function (e) {
            siren.setVolume(0);
        },

        'down': function (e) {
            siren.setVolume(40);
        },
    };

    // :D
    triggerButton.addEventListener('mousedown', siren.down);
    triggerButton.addEventListener('mouseup', siren.up);

    container.appendChild(visualizer);
    container.appendChild(triggerButton);
    container.appendChild(oscillatorTypeSelector);
    container.appendChild(frequencySelector);

    // Finish initialize
    siren.setVolume(0);
    siren.visualize();

    return siren;
}
