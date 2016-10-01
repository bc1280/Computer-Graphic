/**
 * Created by Bill Chang on 2016/9/29.
 * */
"use strict";

var m4, canvas, context, slider1, slider2, slider3, slider4, slider5;


function load() {
    slider1 = document.getElementById('slider1');
    slider1.value = 0;
    slider2 = document.getElementById('slider2');
    slider2.value = 0;
    slider3 = document.getElementById('slider3');
    slider3.value = 0;
    slider4 = document.getElementById('slider4');
    slider4.value = 0;
    slider5 = document.getElementById('slider5');
    slider5.value = 0;
    m4 = twgl.m4;
    canvas = document.getElementById('myCanvas');
    canvas.width = 500;
    canvas.height = 500;
    context = canvas.getContext('2d');

    var theta = 0;
    function draw() {
        "use strict";
        canvas.width = canvas.width;
        var angle1 = slider1.value * 0.01 * Math.PI;
        var angle2 = slider2.value * 0.01 * Math.PI;
        var stripRadius = slider3.value * 0.5 + 50;
        var headSize = slider4.value;
        var runnerHeightMultiplier = slider5.value * 0.005 + 1;

        var eye = [(canvas.width * .25 + 50) * Math.cos(angle1), 100, canvas.width * .25 * Math.sin(angle1)];
        var target = [0, 0, 0];
        var up = [0, 1, 0];
        var axis = [canvas.width * .25, 200, canvas.height * .25];

        var Tmodel = m4.axisRotation(axis, angle2);
        var Tcamera = m4.inverse(m4.lookAt(eye, target, up));
        var Tprojection = m4.ortho(-250, 250, -200, 400, -2, 2);
        var Tviewport = m4.multiply(m4.scaling([250, -250, 250]), m4.translation([250, 250, 0]));
        var Tmcpv = m4.multiply(Tmodel, m4.multiply(m4.multiply(Tcamera, Tprojection), Tviewport));

        var startingPoint = [125, 125, 125];

        function moveToTx(loc, Tx) {
            //var loc = [x,y,z];
            var locTx = m4.transformPoint(Tx, loc);
            context.moveTo(locTx[0], locTx[1]);
        }

        function lineToTx(loc, Tx) {
            //var loc = [x,y,z];
            var locTx = m4.transformPoint(Tx, loc);
            context.lineTo(locTx[0], locTx[1]);
        }

        function drawMobiusStrips(runnerHeightMultiplier, headSize, stripRadius, theta, Tx, startingPoint) {

            var u, v;

            context.beginPath();
            context.strokeStyle = "Black";
            context.lineWidth = 1;
            moveToTx([startingPoint[0] + stripRadius, startingPoint[1] + 0, startingPoint[2] + 0], Tx);
            for (v = 0; v <= 2*stripRadius; v = v + stripRadius/2.5) {
                moveToTx([startingPoint[0] + 2*stripRadius + v/2, startingPoint[1] + 0, startingPoint[2] + 0], Tx);
                for (u = 0; u <= 4*Math.PI; u = u + (1/32)*Math.PI) {
                    lineToTx([startingPoint[0] + (2*stripRadius + v*Math.cos(u/2)/2)*Math.cos(u), startingPoint[1] + (2*stripRadius + v*Math.cos(u/2)/2)*Math.sin(u), startingPoint[2] + v*Math.sin(u/2)/2], Tx);
                    context.stroke();
                }
            }
            v = 2*stripRadius;
            for (u = 0; u <= 2*Math.PI; u = u + (1/8)*Math.PI) {
                moveToTx([startingPoint[0] + (2*stripRadius + v*Math.cos(u/2)/2)*Math.cos(u), startingPoint[1] + (2*stripRadius + v*Math.cos(u/2)/2)*Math.sin(u), startingPoint[2] + v*Math.sin(u/2)/2], Tx);
                lineToTx([startingPoint[0] + (2*stripRadius + v*Math.cos((u+2*Math.PI)/2)/2)*Math.cos(u+2*Math.PI), startingPoint[1] + (2*stripRadius + v*Math.cos((u+2*Math.PI)/2)/2)*Math.sin(u+2*Math.PI), startingPoint[2] + v*Math.sin((u+2*Math.PI)/2)/2], Tx);
                context.stroke();
            }
            context.closePath();

            //normal vector (runner)
            context.beginPath();
            context.strokeStyle = "Red";
            context.lineWidth = 3;
            moveToTx([startingPoint[0] + 2*stripRadius*Math.cos(theta), startingPoint[1] + 2*stripRadius*Math.sin(theta), startingPoint[2] + 0], Tx);
            lineToTx([startingPoint[0] + 2*stripRadius*Math.cos(theta) - stripRadius*runnerHeightMultiplier*Math.cos(theta)*Math.sin(theta/2), startingPoint[1] + 2*stripRadius*Math.sin(theta) - stripRadius*runnerHeightMultiplier*Math.sin(theta)*Math.sin(theta/2), startingPoint[2] + stripRadius*runnerHeightMultiplier*Math.cos(theta/2)], Tx);
            context.stroke();
            context.closePath();
            context.beginPath();
            context.strokeStyle = "Blue";
            context.lineWidth = headSize;
            moveToTx([startingPoint[0] + 2*stripRadius*Math.cos(theta) - stripRadius*runnerHeightMultiplier*Math.cos(theta)*Math.sin(theta/2), startingPoint[1] + 2*stripRadius*Math.sin(theta) - stripRadius*runnerHeightMultiplier*Math.sin(theta)*Math.sin(theta/2), startingPoint[2] + stripRadius*runnerHeightMultiplier*Math.cos(theta/2)], Tx);
            lineToTx([startingPoint[0] + 2*stripRadius*Math.cos(theta) - 1.1*stripRadius*runnerHeightMultiplier*Math.cos(theta)*Math.sin(theta/2), startingPoint[1] + 2*stripRadius*Math.sin(theta) - 1.1*stripRadius*runnerHeightMultiplier*Math.sin(theta)*Math.sin(theta/2), startingPoint[2] + 1.1*stripRadius*runnerHeightMultiplier*Math.cos(theta/2)], Tx);
            context.stroke();
        }

        drawMobiusStrips(runnerHeightMultiplier, headSize, stripRadius, theta, Tmcpv, startingPoint);
        var value = 0;
        value = (value + 1) % 100;
        theta = theta + 4*Math.PI*value/100;
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}


window.onload = load;