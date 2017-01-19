// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// now, I make a function that adds an object to that list
// there's a funky thing here where I have to not only define the function, but also
// run it - so it has to be put in parenthesis
(function() {
    "use strict";

    // I am keeping the shader code here so it doesn't "leak" out - it's ugly, but it will
    // keep this example simple. i do not recommend this for future objects
    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 pos;" +
        "attribute vec3 inColor;" +
        "varying vec3 outColor;" +
        "uniform mat4 view;" +
        "uniform mat4 proj;" +
        "void main(void) {" +
        "  gl_Position = proj * view * vec4(pos, 1.0);" +
        "  outColor = inColor;" +
        "}";
    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec3 outColor;" +
        "void main(void) {" +
        "  gl_FragColor = vec4(outColor, 1.0);" +
        "}";
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
    p[24] = new Point([0,0,0]);

    // vertex positions
    // putting the arrays of object info here as well
    var vertexPos = [
        p[0].x, p[0].y, p[0].z, p[1].x, p[1].y, p[1].z, p[3].x, p[3].y, p[3].z,
        p[0].x, p[0].y, p[0].z, p[3].x, p[3].y, p[3].z, p[2].x, p[2].y, p[2].z,
        p[2].x, p[2].y, p[2].z, p[3].x, p[3].y, p[3].z, p[5].x, p[5].y, p[5].z,
        p[2].x, p[2].y, p[2].z, p[5].x, p[5].y, p[5].z, p[4].x, p[4].y, p[4].z,
        p[4].x, p[4].y, p[4].z, p[5].x, p[5].y, p[5].z, p[7].x, p[7].y, p[7].z,
        p[4].x, p[4].y, p[4].z, p[7].x, p[7].y, p[7].z, p[6].x, p[6].y, p[6].z,
        p[6].x, p[6].y, p[6].z, p[7].x, p[7].y, p[7].z, p[9].x, p[9].y, p[9].z,
        p[6].x, p[6].y, p[6].z, p[9].x, p[9].y, p[9].z, p[8].x, p[8].y, p[8].z,
        p[8].x, p[8].y, p[8].z, p[9].x, p[9].y, p[9].z, p[11].x, p[11].y, p[11].z,
        p[8].x, p[8].y, p[8].z, p[11].x, p[11].y, p[11].z, p[10].x, p[10].y, p[10].z,
        p[10].x, p[10].y, p[10].z, p[11].x, p[11].y, p[11].z, p[13].x, p[13].y, p[13].z,
        p[10].x, p[10].y, p[10].z, p[13].x, p[13].y, p[13].z, p[12].x, p[12].y, p[12].z,
        p[12].x, p[12].y, p[12].z, p[13].x, p[13].y, p[13].z, p[15].x, p[15].y, p[15].z,
        p[12].x, p[12].y, p[12].z, p[15].x, p[15].y, p[15].z, p[14].x, p[14].y, p[14].z,
        p[14].x, p[14].y, p[14].z, p[15].x, p[15].y, p[15].z, p[17].x, p[17].y, p[17].z,
        p[14].x, p[14].y, p[14].z, p[17].x, p[17].y, p[17].z, p[16].x, p[16].y, p[16].z,
        p[16].x, p[16].y, p[16].z, p[17].x, p[17].y, p[17].z, p[19].x, p[19].y, p[19].z,
        p[16].x, p[16].y, p[16].z, p[19].x, p[19].y, p[19].z, p[18].x, p[18].y, p[18].z,
        p[18].x, p[18].y, p[18].z, p[19].x, p[19].y, p[19].z, p[21].x, p[21].y, p[21].z,
        p[18].x, p[18].y, p[18].z, p[21].x, p[21].y, p[21].z, p[20].x, p[20].y, p[20].z,
        p[20].x, p[20].y, p[20].z, p[21].x, p[21].y, p[21].z, p[23].x, p[23].y, p[23].z,
        p[20].x, p[20].y, p[20].z, p[23].x, p[23].y, p[23].z, p[22].x, p[22].y, p[22].z,
        p[22].x, p[22].y, p[22].z, p[23].x, p[23].y, p[23].z, p[1].x, p[1].y, p[1].z,
        p[22].x, p[22].y, p[22].z, p[1].x, p[1].y, p[1].z, p[0].x, p[0].y, p[0].z,
        p[24].x, p[24].y, p[24].z, p[0].x, p[0].y, p[0].z, p[2].x, p[2].y, p[2].z,
        p[24].x, p[24].y, p[24].z, p[2].x, p[2].y, p[2].z, p[4].x, p[4].y, p[4].z,
        p[24].x, p[24].y, p[24].z, p[4].x, p[4].y, p[4].z, p[6].x, p[6].y, p[6].z,
        p[24].x, p[24].y, p[24].z, p[6].x, p[6].y, p[6].z, p[8].x, p[8].y, p[8].z,
        p[24].x, p[24].y, p[24].z, p[8].x, p[8].y, p[8].z, p[10].x, p[10].y, p[10].z,
        p[24].x, p[24].y, p[24].z, p[10].x, p[10].y, p[10].z, p[12].x, p[12].y, p[12].z,
        p[24].x, p[24].y, p[24].z, p[12].x, p[12].y, p[12].z, p[14].x, p[14].y, p[14].z,
        p[24].x, p[24].y, p[24].z, p[14].x, p[14].y, p[14].z, p[16].x, p[16].y, p[16].z,
        p[24].x, p[24].y, p[24].z, p[16].x, p[16].y, p[16].z, p[18].x, p[18].y, p[18].z,
        p[24].x, p[24].y, p[24].z, p[18].x, p[18].y, p[18].z, p[20].x, p[20].y, p[20].z,
        p[24].x, p[24].y, p[24].z, p[20].x, p[20].y, p[20].z, p[22].x, p[22].y, p[22].z,
        p[24].x, p[24].y, p[24].z, p[22].x, p[22].y, p[22].z, p[0].x, p[0].y, p[0].z,
        p[24].x, p[24].y, p[24].z, p[3].x, p[3].y, p[3].z, p[1].x, p[1].y, p[1].z,
        p[24].x, p[24].y, p[24].z, p[5].x, p[5].y, p[5].z, p[3].x, p[3].y, p[3].z,
        p[24].x, p[24].y, p[24].z, p[7].x, p[7].y, p[7].z, p[5].x, p[5].y, p[5].z,
        p[24].x, p[24].y, p[24].z, p[9].x, p[9].y, p[9].z, p[7].x, p[7].y, p[7].z,
        p[24].x, p[24].y, p[24].z, p[11].x, p[11].y, p[11].z, p[9].x, p[9].y, p[9].z,
        p[24].x, p[24].y, p[24].z, p[13].x, p[13].y, p[13].z, p[11].x, p[11].y, p[11].z,
        p[24].x, p[24].y, p[24].z, p[15].x, p[15].y, p[15].z, p[13].x, p[13].y, p[13].z,
        p[24].x, p[24].y, p[24].z, p[17].x, p[17].y, p[17].z, p[15].x, p[15].y, p[15].z,
        p[24].x, p[24].y, p[24].z, p[19].x, p[19].y, p[19].z, p[17].x, p[17].y, p[17].z,
        p[24].x, p[24].y, p[24].z, p[21].x, p[21].y, p[21].z, p[19].x, p[19].y, p[19].z,
        p[24].x, p[24].y, p[24].z, p[23].x, p[23].y, p[23].z, p[21].x, p[21].y, p[21].z,
        p[24].x, p[24].y, p[24].z, p[1].x, p[1].y, p[1].z, p[23].x, p[23].y, p[23].z
    ];

    // make each triangle be a slightly different color - but each triangle is a solid color
    var vertexColors = [
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,

        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9,
        0.9, 0.9, 0.5,   0.9, 0.9, 0.5,   0.9, 0.9, 0.5,
        0.9, 0.5, 0.9,   0.9, 0.5, 0.9,   0.9, 0.5, 0.9,
        0.5, 0.9, 0.9,   0.5, 0.9, 0.9,   0.5, 0.9, 0.9
    ];


    var turntable = {
        // first I will give this the required object stuff for it's interface
        // note that the init and draw functions can refer to the fields I define
        // below
        name : "Turntable Stadium",
        // the two workhorse functions - init and draw
        // init will be called when there is a GL context
        // this code gets really bulky since I am doing it all in place
        init : function(drawingState) {
            // an abbreviation...
            var gl = drawingState.gl;

            // compile the vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader,vertexSource);
            gl.compileShader(vertexShader);
              if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                      alert(gl.getShaderInfoLog(vertexShader));
                      return null;
                  }
            // now compile the fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader,fragmentSource);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                  alert(gl.getShaderInfoLog(fragmentShader));
                  return null;
            }
            // OK, we have a pair of shaders, we need to put them together
            // into a "shader program" object
            // notice that I am assuming that I can use "this"
            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);
            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                alert("Could not initialize shaders");
            }
            // get the locations for each of the shader's variables
            // attributes and uniforms
            // notice we don't do much with them yet
            this.posLoc = gl.getAttribLocation(this.shaderProgram, "pos");
            this.colorLoc = gl.getAttribLocation(this.shaderProgram, "inColor");
            this.projLoc = gl.getUniformLocation(this.shaderProgram,"proj");
            this.viewLoc = gl.getUniformLocation(this.shaderProgram,"view");

            // now to make the buffers for the 4 triangles
            this.posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
        },
        draw : function(drawingState) {
            var gl = drawingState.gl;
            // choose the shader program we have compiled
            gl.useProgram(this.shaderProgram);
            // enable the attributes we had set up
            gl.enableVertexAttribArray(this.posLoc);
            gl.enableVertexAttribArray(this.colorLoc);
            // set the uniforms
            gl.uniformMatrix4fv(this.viewLoc,false,drawingState.view);
            gl.uniformMatrix4fv(this.projLoc,false,drawingState.proj);
            // connect the attributes to the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(this.colorLoc, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 120);
        },
        center : function(drawingState) {
            return [0,.5,0];
        },

        // these are the internal methods / fields of this specific object
        // we want to keep the shaders and buffers - rather than rebuild them
        // every draw. we can't initialize them now, but rather we need to wait
        // until there is a GL context (when we call init)
        // technically, these don't need to be defined here - init can just
        // add fields to the object - but I am putting them here  since it feels
        // more like a normal "class" declaration
        shaderProgram : undefined,
        posBuffer : undefined,
        colorBuffer : undefined,
        posLoc : -1,
        colorLoc : -1,
        projLoc : -1,
        viewLoc : -1
    };

    // now that we've defined the object, add it to the global objects list
    grobjects.push(turntable);
})();