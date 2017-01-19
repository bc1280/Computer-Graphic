var grobjects = grobjects || [];

var turntable = undefined;
(function () { "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for turntable
    turntable = function turntable(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
    }


    function normalize(point) {
        var norm = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
        if (norm != 0) { // as3 return 0,0 for a point of zero length
            point.x = point.x / norm;
            point.y = point.y / norm;
            point.z = point.z / norm;
        }
    }

    function cross(A, B, C) {
        var returnvec = [rx, ry, rz];
        var rx = (B.y - A.y) * (C.z - B.z) - (B.z - A.z) * (C.y - B.y);
        var ry = (B.z - A.z) * (C.x - B.x) - (B.x - A.x) * (C.z - B.z);
        var rz = (B.x - A.x) * (C.y - B.y) - (B.y - A.y) * (C.x - B.x);
        return returnvec;
    }

    var radius = Math.sqrt(3);

    var i = 0, p = [];

    for (var u = 0; u < 2*Math.PI; u = u + (1/6)*Math.PI) {
        p[i] = [radius*Math.cos(u), 0.5, radius*Math.sin(u)];
        i++;
        p[i] = [radius*Math.cos(u), -0.5, radius*Math.sin(u)];
        i++;
    }
    p[24] = [0,0,0];

    turntable.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        // create the shaders once
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["turntable-vs", "turntable-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
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
                    ]
                },
                vnormal: {
                    numComponents: 3,
                    data: [
                        normalize(cross(p[0], p[1], p[3])).x, normalize(cross(p[0], p[1], p[3])).y, normalize(cross(p[0], p[1], p[3])).z,
                        normalize(cross(p[0], p[3], p[2])).x, normalize(cross(p[0], p[3], p[2])).y, normalize(cross(p[0], p[3], p[2])).z,
                        normalize(cross(p[2], p[3], p[5])).x, normalize(cross(p[2], p[3], p[5])).y, normalize(cross(p[2], p[3], p[5])).z,
                        normalize(cross(p[2], p[5], p[4])).x, normalize(cross(p[2], p[5], p[4])).y, normalize(cross(p[2], p[5], p[4])).z,
                        normalize(cross(p[4], p[5], p[7])).x, normalize(cross(p[4], p[5], p[7])).y, normalize(cross(p[4], p[5], p[7])).z,
                        normalize(cross(p[4], p[7], p[6])).x, normalize(cross(p[4], p[7], p[6])).y, normalize(cross(p[4], p[7], p[6])).z,
                        normalize(cross(p[6], p[7], p[9])).x, normalize(cross(p[6], p[7], p[9])).y, normalize(cross(p[6], p[7], p[9])).z,
                        normalize(cross(p[6], p[9], p[8])).x, normalize(cross(p[6], p[9], p[8])).y, normalize(cross(p[6], p[9], p[8])).z,
                        normalize(cross(p[8], p[9], p[11])).x, normalize(cross(p[8], p[9], p[11])).y, normalize(cross(p[8], p[9], p[11])).z,
                        normalize(cross(p[8], p[11], p[10])).x, normalize(cross(p[8], p[11], p[10])).y, normalize(cross(p[8], p[11], p[10])).z,
                        normalize(cross(p[10], p[11], p[13])).x, normalize(cross(p[10], p[11], p[13])).y, normalize(cross(p[10], p[11], p[13])).z,
                        normalize(cross(p[10], p[13], p[12])).x, normalize(cross(p[10], p[13], p[12])).y, normalize(cross(p[10], p[13], p[12])).z,
                        normalize(cross(p[12], p[13], p[15])).x, normalize(cross(p[12], p[13], p[15])).y, normalize(cross(p[12], p[13], p[15])).z,
                        normalize(cross(p[12], p[15], p[14])).x, normalize(cross(p[12], p[15], p[14])).y, normalize(cross(p[12], p[15], p[14])).z,
                        normalize(cross(p[14], p[15], p[17])).x, normalize(cross(p[14], p[15], p[17])).y, normalize(cross(p[14], p[15], p[17])).z,
                        normalize(cross(p[14], p[17], p[16])).x, normalize(cross(p[14], p[17], p[16])).y, normalize(cross(p[14], p[17], p[16])).z,
                        normalize(cross(p[16], p[17], p[19])).x, normalize(cross(p[16], p[17], p[19])).y, normalize(cross(p[16], p[17], p[19])).z,
                        normalize(cross(p[16], p[19], p[18])).x, normalize(cross(p[16], p[19], p[18])).y, normalize(cross(p[16], p[19], p[18])).z,
                        normalize(cross(p[18], p[19], p[21])).x, normalize(cross(p[18], p[19], p[21])).y, normalize(cross(p[18], p[19], p[21])).z,
                        normalize(cross(p[18], p[21], p[20])).x, normalize(cross(p[18], p[21], p[20])).y, normalize(cross(p[18], p[21], p[20])).z,
                        normalize(cross(p[20], p[21], p[23])).x, normalize(cross(p[20], p[21], p[23])).y, normalize(cross(p[20], p[21], p[23])).z,
                        normalize(cross(p[20], p[23], p[22])).x, normalize(cross(p[20], p[23], p[22])).y, normalize(cross(p[20], p[23], p[22])).z,
                        normalize(cross(p[22], p[23], p[1])).x, normalize(cross(p[22], p[23], p[1])).y, normalize(cross(p[22], p[23], p[1])).z,
                        normalize(cross(p[22], p[1], p[0])).x, normalize(cross(p[22], p[1], p[0])).y, normalize(cross(p[22], p[1], p[0])).z,
                        normalize(cross(p[24], p[0], p[2])).x, normalize(cross(p[24], p[0], p[2])).y, normalize(cross(p[24], p[0], p[2])).z,
                        normalize(cross(p[24], p[2], p[4])).x, normalize(cross(p[24], p[2], p[4])).y, normalize(cross(p[24], p[2], p[4])).z,
                        normalize(cross(p[24], p[4], p[6])).x, normalize(cross(p[24], p[4], p[6])).y, normalize(cross(p[24], p[4], p[6])).z,
                        normalize(cross(p[24], p[6], p[8])).x, normalize(cross(p[24], p[6], p[8])).y, normalize(cross(p[24], p[6], p[8])).z,
                        normalize(cross(p[24], p[8], p[10])).x, normalize(cross(p[24], p[8], p[10])).y, normalize(cross(p[24], p[8], p[10])).z,
                        normalize(cross(p[24], p[10], p[12])).x, normalize(cross(p[24], p[10], p[12])).y, normalize(cross(p[24], p[10], p[12])).z,
                        normalize(cross(p[24], p[12], p[14])).x, normalize(cross(p[24], p[12], p[14])).y, normalize(cross(p[24], p[12], p[14])).z,
                        normalize(cross(p[24], p[14], p[16])).x, normalize(cross(p[24], p[14], p[16])).y, normalize(cross(p[24], p[14], p[16])).z,
                        normalize(cross(p[24], p[16], p[18])).x, normalize(cross(p[24], p[16], p[18])).y, normalize(cross(p[24], p[16], p[18])).z,
                        normalize(cross(p[24], p[18], p[20])).x, normalize(cross(p[24], p[18], p[20])).y, normalize(cross(p[24], p[18], p[20])).z,
                        normalize(cross(p[24], p[20], p[22])).x, normalize(cross(p[24], p[20], p[22])).y, normalize(cross(p[24], p[20], p[22])).z,
                        normalize(cross(p[24], p[22], p[0])).x, normalize(cross(p[24], p[22], p[0])).y, normalize(cross(p[24], p[22], p[0])).z,
                        normalize(cross(p[24], p[3], p[1])).x, normalize(cross(p[24], p[3], p[1])).y, normalize(cross(p[24], p[3], p[1])).z,
                        normalize(cross(p[24], p[5], p[3])).x, normalize(cross(p[24], p[5], p[3])).y, normalize(cross(p[24], p[5], p[3])).z,
                        normalize(cross(p[24], p[7], p[5])).x, normalize(cross(p[24], p[7], p[5])).y, normalize(cross(p[24], p[7], p[5])).z,
                        normalize(cross(p[24], p[9], p[7])).x, normalize(cross(p[24], p[9], p[7])).y, normalize(cross(p[24], p[9], p[7])).z,
                        normalize(cross(p[24], p[11], p[9])).x, normalize(cross(p[24], p[11], p[9])).y, normalize(cross(p[24], p[11], p[9])).z,
                        normalize(cross(p[24], p[13], p[11])).x, normalize(cross(p[24], p[13], p[11])).y, normalize(cross(p[24], p[13], p[11])).z,
                        normalize(cross(p[24], p[15], p[13])).x, normalize(cross(p[24], p[15], p[13])).y, normalize(cross(p[24], p[15], p[13])).z,
                        normalize(cross(p[24], p[17], p[15])).x, normalize(cross(p[24], p[17], p[15])).y, normalize(cross(p[24], p[17], p[15])).z,
                        normalize(cross(p[24], p[19], p[17])).x, normalize(cross(p[24], p[19], p[17])).y, normalize(cross(p[24], p[19], p[17])).z,
                        normalize(cross(p[24], p[21], p[19])).x, normalize(cross(p[24], p[21], p[19])).y, normalize(cross(p[24], p[21], p[19])).z,
                        normalize(cross(p[24], p[23], p[21])).x, normalize(cross(p[24], p[23], p[21])).y, normalize(cross(p[24], p[23], p[21])).z,
                        normalize(cross(p[24], p[1], p[23])).x, normalize(cross(p[24], p[1], p[23])).y, normalize(cross(p[24], p[1], p[23])).z
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
    };
    turntable.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var normalMatrix = modelM;
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    turntable.prototype.center = function(drawingState) {
        return this.position;
    }
})();

grobjects.push(new turntable("turntable",[0, 0.5, 0], 1, [0.25,0.25,0.25]));
