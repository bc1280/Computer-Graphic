/**
 * Created by Bill Chang on 9/18/2016.
 */
function setup() { "use strict";
    var canvas = document.getElementById('myCanvas');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    var slider3 = document.getElementById('slider3');
    slider3.value = 0;
    var slider4 = document.getElementById('slider4');
    slider4.value = 0;
    var slider5 = document.getElementById('slider5');
    slider5.value = 0;
    var slider6 = document.getElementById('slider6');
    slider6.value = -100;
    var slider7 = document.getElementById('slider7');
    slider7.value = 0;
    var slider8 = document.getElementById('slider8');
    slider8.value = -100;
    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;
        // use the sliders to get the angles
        var theta1 = slider1.value*0.001*Math.PI;
        var theta2 = slider2.value*0.001*Math.PI;
        var theta3 = slider3.value*0.001*Math.PI;
        var theta4 = slider4.value*0.001*Math.PI;
        var theta5 = slider5.value*0.001*Math.PI;
        var theta6 = slider6.value*0.005*Math.PI;
        var theta7 = slider7.value*0.005*Math.PI;
        var length = slider8.value*0.025;

        // note that this only changes the y
        // X just stays the same
        // the coordinate systems will move
        function linkage(color) {
            context.beginPath();
            context.fillStyle = color;
            context.moveTo(0,0);
            context.lineTo(5,5);
            context.lineTo(45,5);
            context.lineTo(50,0);
            context.lineTo(45,-5);
            context.lineTo(5,-5);
            context.closePath();
            context.fill();
        }

        function semicircular(color, theta) {
            context.beginPath();
            context.fillStyle = color;
            context.arc(0, 0, 50, Math.PI + theta, theta);
            context.closePath();
            context.fill();
        }

        function eye(color, theta1, theta2) {
            context.beginPath();
            context.lineTo(0,-50);
            context.arc(0, -50, 50, theta1, theta2);
            context.lineTo(0,-50);
            context.fill();
            context.shadowBlur=10;
            context.shadowOffsetY=-3;
            context.shadowColor="brown";
            context.closePath();
            context.beginPath();
            context.arc(0, -50, 50, 0, Math.PI*2, false);
            context.stroke();
            context.shadowBlur=0;
            context.shadowOffsetY=0;
            context.shadowColor="black";
            context.closePath();
        }

        function mouth(color, length){
            context.beginPath();
            context.arc(length, -length, length, Math.PI, Math.PI/2);
            context.arc(length, length, length, Math.PI*3/2, Math.PI);
            context.lineTo(0,-length);
            context.strokeStyle = "Black";
            context.lineWidth = 4;
            context.stroke();
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }

        // Right-side of Face
        context.translate(500,500);
        context.save();
        context.rotate(theta1);
        context.beginPath();
        context.arc(0, 0, 170, Math.PI*11/6, Math.PI*1/6);
        context.stroke();
        //Right Eye
        context.save();
        context.translate(80,-10);
        eye("black", 0 + theta6, Math.PI + theta7);
        context.restore();
        //Right Hand
        context.translate(240,0);
        context.save();
        context.rotate(theta2);
        semicircular("brown", Math.PI/2);
        context.save();
        //Claws
        context.translate(50*Math.cos(Math.PI*5/3),50*Math.sin(Math.PI*5/3));
        context.rotate(theta3);
        linkage("blue");
        context.restore();
        context.save();
        context.translate(50*Math.cos(0),50*Math.sin(0));
        context.rotate(theta4);
        linkage("blue");
        context.restore();
        context.save();
        context.translate(50*Math.cos(Math.PI*1/3),50*Math.sin(Math.PI*1/3));
        context.rotate(theta5);
        linkage("blue");
        context.restore();
        context.restore();
        context.restore();

        // Left-side of Face
        context.rotate(-theta1);
        context.beginPath();
        context.arc(0, 0, 170, Math.PI*5/6, Math.PI*7/6);
        context.stroke();
        //Left Eye
        context.save();
        context.translate(-80,-10);
        eye("black", 0 - theta7, Math.PI - theta6);
        context.restore();
        //Left Hand
        context.translate(-240,0);
        context.save();
        context.rotate(-theta2);
        semicircular("brown", Math.PI*3/2);
        context.save();
        //Claws
        context.translate(50*Math.cos(Math.PI*4/3),50*Math.sin(Math.PI*4/3));
        context.rotate(Math.PI-theta3);
        linkage("blue");
        context.restore();
        context.save();
        context.translate(50*Math.cos(Math.PI),50*Math.sin(Math.PI));
        context.rotate(Math.PI-theta4);
        linkage("blue");
        context.restore();
        context.save();
        context.translate(50*Math.cos(Math.PI*2/3),50*Math.sin(Math.PI*2/3));
        context.rotate(Math.PI-theta5);
        linkage("blue");
        context.restore();
        context.restore();
        context.restore();


        //Mouth
        context.translate(220,50);
        mouth("red", 25+length);
        if (slider8.value >= 100) {
            slider8.value = -100;
        }
        slider8.value ++;

        window.requestAnimationFrame(draw);
    }
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    slider3.addEventListener("input",draw);
    slider4.addEventListener("input",draw);
    slider5.addEventListener("input",draw);
    slider6.addEventListener("input",draw);
    slider7.addEventListener("input",draw);
    slider8.addEventListener("input",draw);

    window.requestAnimationFrame(draw);
}
window.onload = setup;

