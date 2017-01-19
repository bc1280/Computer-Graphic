function start() { "use strict";

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");
    var m4 = twgl.m4;

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    // Read shader source
    var vertexSource = document.getElementById("vs").text;
    var fragmentSource = document.getElementById("fs").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader)); return null; }

    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null; }

    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);

    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);

    // this gives us access to the matrix uniform
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    // Data ...
    var Point = function (coordinates) {
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2];
    };

    Point.prototype.set = function (coordinates) {
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2];
    };

    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.prototype.getZ = function () {
        return this.z;
    };

    var startingPoint = new Point([0, 0, 0]);
    var radius = Math.sqrt(3);

    var i = 0, p = [];

    for (var u = 0; u < 2*Math.PI; u = u + (1/6)*Math.PI) {
        p[i] = new Point([startingPoint.x + radius*Math.cos(u), 0.5, startingPoint.z + radius*Math.sin(u)]);
        i++;
        p[i] = new Point([startingPoint.x + radius*Math.cos(u), -0.5, startingPoint.z + radius*Math.sin(u)]);
        i++;
    }
    p[24] = new Point([0,-0.5,0]);
    p[25] = new Point([0,0.75,0]);

    // vertex positions
    var vertexPos = new Float32Array(
        [   p[0].x, p[0].y, p[0].z, p[1].x, p[1].y, p[1].z, p[2].x, p[2].y, p[2].z, p[3].x, p[3].y, p[3].z,
            p[2].x, p[2].y, p[2].z, p[3].x, p[3].y, p[3].z, p[4].x, p[4].y, p[4].z, p[5].x, p[5].y, p[5].z,
            p[4].x, p[4].y, p[4].z, p[5].x, p[5].y, p[5].z, p[6].x, p[6].y, p[6].z, p[7].x, p[7].y, p[7].z,
            p[6].x, p[6].y, p[6].z, p[7].x, p[7].y, p[7].z, p[8].x, p[8].y, p[8].z, p[9].x, p[9].y, p[9].z,
            p[8].x, p[8].y, p[8].z, p[9].x, p[9].y, p[9].z, p[10].x, p[10].y, p[10].z, p[11].x, p[11].y, p[11].z,
            p[10].x, p[10].y, p[10].z, p[11].x, p[11].y, p[11].z, p[12].x, p[12].y, p[12].z, p[13].x, p[13].y, p[13].z,
            p[12].x, p[12].y, p[12].z, p[13].x, p[13].y, p[13].z, p[14].x, p[14].y, p[14].z, p[15].x, p[15].y, p[15].z,
            p[14].x, p[14].y, p[14].z, p[15].x, p[15].y, p[15].z, p[16].x, p[16].y, p[16].z, p[17].x, p[17].y, p[17].z,
            p[16].x, p[16].y, p[16].z, p[17].x, p[17].y, p[17].z, p[18].x, p[18].y, p[18].z, p[19].x, p[19].y, p[19].z,
            p[18].x, p[18].y, p[18].z, p[19].x, p[19].y, p[19].z, p[20].x, p[20].y, p[20].z, p[21].x, p[21].y, p[21].z,
            p[20].x, p[20].y, p[20].z, p[21].x, p[21].y, p[21].z, p[22].x, p[22].y, p[22].z, p[23].x, p[23].y, p[23].z,
            p[22].x, p[22].y, p[22].z, p[23].x, p[23].y, p[23].z, p[0].x, p[0].y, p[0].z, p[1].x, p[1].y, p[1].z,

            p[0].x, p[0].y, p[0].z, p[2].x, p[2].y, p[2].z, p[25].x, p[25].y, p[25].z,
            p[1].x, p[1].y, p[1].z, p[3].x, p[3].y, p[3].z, p[24].x, p[24].y, p[24].z,
            p[2].x, p[2].y, p[2].z, p[4].x, p[4].y, p[4].z, p[25].x, p[25].y, p[25].z,
            p[3].x, p[3].y, p[3].z, p[5].x, p[5].y, p[5].z, p[24].x, p[24].y, p[24].z,
            p[4].x, p[4].y, p[4].z, p[6].x, p[6].y, p[6].z, p[25].x, p[25].y, p[25].z,
            p[5].x, p[5].y, p[5].z, p[7].x, p[7].y, p[7].z, p[24].x, p[24].y, p[24].z,
            p[6].x, p[6].y, p[6].z, p[8].x, p[8].y, p[8].z, p[25].x, p[25].y, p[25].z,
            p[7].x, p[7].y, p[7].z, p[9].x, p[9].y, p[9].z, p[24].x, p[24].y, p[24].z,
            p[8].x, p[8].y, p[8].z, p[10].x, p[10].y, p[10].z, p[25].x, p[25].y, p[25].z,
            p[9].x, p[9].y, p[9].z, p[11].x, p[11].y, p[11].z, p[24].x, p[24].y, p[24].z,
            p[10].x, p[10].y, p[10].z, p[12].x, p[12].y, p[12].z, p[25].x, p[25].y, p[25].z,
            p[11].x, p[11].y, p[11].z, p[13].x, p[13].y, p[13].z, p[24].x, p[24].y, p[24].z,
            p[12].x, p[12].y, p[12].z, p[14].x, p[14].y, p[14].z, p[25].x, p[25].y, p[25].z,
            p[13].x, p[13].y, p[13].z, p[15].x, p[15].y, p[15].z, p[24].x, p[24].y, p[24].z,
            p[14].x, p[14].y, p[14].z, p[16].x, p[16].y, p[16].z, p[25].x, p[25].y, p[25].z,
            p[15].x, p[15].y, p[15].z, p[17].x, p[17].y, p[17].z, p[24].x, p[24].y, p[24].z,
            p[16].x, p[16].y, p[16].z, p[18].x, p[18].y, p[18].z, p[25].x, p[25].y, p[25].z,
            p[17].x, p[17].y, p[17].z, p[19].x, p[19].y, p[19].z, p[24].x, p[24].y, p[24].z,
            p[18].x, p[18].y, p[18].z, p[20].x, p[20].y, p[20].z, p[25].x, p[25].y, p[25].z,
            p[19].x, p[19].y, p[19].z, p[21].x, p[21].y, p[21].z, p[24].x, p[24].y, p[24].z,
            p[20].x, p[20].y, p[20].z, p[22].x, p[22].y, p[22].z, p[25].x, p[25].y, p[25].z,
            p[21].x, p[21].y, p[21].z, p[23].x, p[23].y, p[23].z, p[24].x, p[24].y, p[24].z,
            p[22].x, p[22].y, p[22].z, p[0].x, p[0].y, p[0].z, p[25].x, p[25].y, p[25].z,
            p[23].x, p[23].y, p[23].z, p[1].x, p[1].y, p[1].z, p[24].x, p[24].y, p[24].z
        ]);

    // vertex colors
    var vertexColors = new Float32Array(
        [
            0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,
            0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,

            0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,
            0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,
            0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1,
            0, 0, 1,   0, 0, 1,   0, 0, 1,
            1, 0, 0,   1, 0, 0,   1, 0, 0,
            0, 1, 0,   0, 1, 0,   0, 1, 0,
            1, 1, 0,   1, 1, 0,   1, 1, 0,
            1, 0, 1,   1, 0, 1,   1, 0, 1,
            0, 1, 1,   0, 1, 1,   0, 1, 1
        ]);

    // element index array
    var triangleIndices = new Uint8Array(
        [   0, 1, 2,   1, 2, 3,
            4, 5, 6,   5, 6, 7,
            8, 9,10,   9,10,11,
            12,13,14,  13,14,15,
            16,17,18,  17,18,19,
            20,21,22,  21,22,23,
            24,25,26,  25,26,27,
            28,29,30,  29,30,31,
            32,33,34,  33,34,35,
            36,37,38,  37,38,39,
            40,41,42,  41,42,43,
            44,45,46,  45,46,47,

            48,49,50,  51,52,53,
            54,55,56,  57,58,59,
            60,61,62,  63,64,65,
            66,67,68,  69,70,71,
            72,73,74,  75,76,77,
            78,79,80,  81,82,83,
            84,85,86,  87,88,89,
            90,91,92,  93,94,95,
            96,97,98,  99,100,101,
            102,103,104,  105,106,107,
            108,109,110,  111,112,113,
            114,115,116,  117,118,119
        ]);

    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 120;

    // a buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 120;

    // a buffer for indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);

    // Scene (re-)draw routine
    function draw() {

        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;

        // Circle around the y-axis
        var eye = [400*Math.sin(angle1),150.0,400.0*Math.cos(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];

        var tModel = m4.multiply(m4.scaling([100,100,100]),m4.axisRotation([1,1,1],angle2));
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
        var tProjection = m4.perspective(Math.PI/4,1,10,1000);

        var tMVP=m4.multiply(m4.multiply(tModel,tCamera),tProjection);

        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
            gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
            gl.FLOAT, false, 0, 0);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);

    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    draw();
}
