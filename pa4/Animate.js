/**
 * Created by Bill Chang on 10/7/2016.
 */
"use strict";

//global variable
var m4, v3, canvas, w, h, context,
    x_slider, y_slider, z_slider,
    xRot_slider, yRot_slider, zRot_slider, speed_slider, fov_slider,
    perspective, ortho, wf, srt, p_or_r;


var to2d = function (point, camera_matrix, projection_matrix, viewport_matrix) {
    var proj = m4.multiply(camera_matrix, projection_matrix);
    var final_matrix = m4.multiply(viewport_matrix, proj);
    var vec = v3.create();
    vec[0] = point.x;
    vec[1] = point.y;
    vec[2] = point.z;
    return new Point(m4.transformPoint(final_matrix, vec));
};

var line = function (p1, p2, camera_matrix, projection_matrix, viewport_matrix) {
    p1 = to2d(p1, camera_matrix, projection_matrix, viewport_matrix);
    p2 = to2d(p2, camera_matrix, projection_matrix, viewport_matrix);

    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();
};


var startingPoint = new Point([0, 0, 0]);
var radius = Math.sqrt(3);
var turntable = new Turntable(startingPoint, radius);
var angle = 0;

canvas = document.getElementById('myCanvas');
context = canvas.getContext('2d');

x_slider = document.getElementById('x_slider');
y_slider = document.getElementById('y_slider');
z_slider = document.getElementById('z_slider');
xRot_slider = document.getElementById('xRot_slider');
yRot_slider = document.getElementById('yRot_slider');
zRot_slider = document.getElementById('zRot_slider');
speed_slider = document.getElementById('speed_slider');
perspective = document.getElementById("perspective");
ortho = document.getElementById("ortho");
wf = document.getElementById("wireFrame");
srt = document.getElementById("sort");
fov_slider = document.getElementById("fov_slider");

ortho.checked = true;
wf.checked = false;
srt.checked = true;

m4 = twgl.m4;
v3 = twgl.v3;
w = canvas.width = 500;
h = canvas.height = 500;

function radioHandler() {
    perspective = document.getElementById("perspective");
    ortho = document.getElementById("ortho");
    wf = document.getElementById("wireFrame");
    srt = document.getElementById("sort");
    p_or_r = perspective.checked && true;
}

function draw() {
    var speed = speed_slider.value;
    angle -= -speed;
    context.save();
    context.clearRect(0, 0, w, h);

    context.scale(100, 100);
    context.translate(2, 2);
    context.scale(1, -1);

    context.lineWidth = 0.01;

    var camera_matrix = m4.identity();
    var camera_translation = v3.create();
    camera_translation[0] = x_slider.value;
    camera_translation[1] = y_slider.value;
    camera_translation[2] = -z_slider.value;
    m4.rotateX(camera_matrix, xRot_slider.value, camera_matrix);
    m4.rotateY(camera_matrix, yRot_slider.value, camera_matrix);
    m4.rotateZ(camera_matrix, zRot_slider.value, camera_matrix);
    m4.translate(camera_matrix, camera_translation, camera_matrix);
    m4.rotateY(camera_matrix, angle, camera_matrix);
    var projection_matrix = m4.perspective(fov_slider.value * Math.PI, 1, -1, 1);
    var orthographic = m4.ortho(-2, 2, -2, 2, -8, 4);

    var toMultiply;

    if (!p_or_r) {
        toMultiply = orthographic;
    } else {
        toMultiply = projection_matrix;
    }
    var viewport_matrix = m4.identity();
    var viewport_translation = v3.create();
    viewport_translation[0] = 0;
    viewport_translation[1] = 0;

    m4.translate(viewport_matrix, viewport_translation, viewport_matrix);

    turntable.draw(context, srt.checked, wf.checked, camera_matrix, toMultiply, viewport_matrix);

    window.requestAnimationFrame(draw);
    context.restore();
}

draw();
