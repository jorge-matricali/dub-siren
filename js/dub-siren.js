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

    while (container.firstChild){
        container.removeChild(container.firstChild);
    }

    context.resume().then(function () {
        console.log('Audio context playback resumed successfully');
    });

    // Master
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    gainNode.gain.value = 0;
    gainNode.connect(context.destination);

    // Oscillator
    var oscillatorNodeA = new Oscillator(context);
    oscillatorNodeA.connect(gainNode);

    var oscillatorNodeB = new Oscillator(context);
    oscillatorNodeB.connect(gainNode);

    var oscillatorNodeC = new Oscillator(context);
    oscillatorNodeC.connect(gainNode);

    // Creating UI elements
    var analyser = new Analyser(context, {
        'width': '100%',
        'height': '100px',
        'display': 'block'
    });
    gainNode.connect(analyser._analyser);

    var triggerButton = document.createElement('button');
    triggerButton.classList.add('trigger');

    var siren = {
        '_context': context,
        '_gainNode': gainNode,
        '_container': container,
        '_analyser': analyser,
        '_oscillators': [
            oscillatorNodeA,
            oscillatorNodeB,
            oscillatorNodeC
        ],

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

    var components = document.createElement('div');
    [].forEach.call(siren._oscillators, function (o) {
        var div = document.createElement('div');
        div.classList.add('component');
        div.appendChild(o.node());
        components.appendChild(div);
    });

    container.appendChild(analyser.node());
    container.appendChild(triggerButton);
    container.appendChild(components);

    // Finish initialize
    siren.setVolume(0);

    return siren;
}
