
var grobjects = grobjects || [];

var scoreboard = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = undefined;

    scoreboard = function scoreboard(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
    }
    scoreboard.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["scoreboard-vs", "scoreboard-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
                        //body
                        //backBottom Triangle
                        -0.35, -0.5, -0.5,
                        0.35, -0.5, -0.5,
                        0.35, 0.5, -0.5,
                        -0.35, -0.5, -0.5,

                        //backTop Triangle
                        0.35, 0.5, -0.5,
                        -0.35, 0.5, -0.5,
                        -0.35, -0.5, 0.5,
                        0.35, -0.5, 0.5,

                        0.35, 0.5, 0.5,
                        -0.35, -0.5, 0.5,
                        0.35, 0.5, 0.5,
                        -0.35, 0.5, 0.5,

                        -0.35, -0.5, -0.5,
                        0.35, -0.5, -0.5,
                        0.35, -0.5, 0.5,
                        -0.35, -0.5, -0.5,

                        0.35, -0.5, 0.5,
                        -0.35, -0.5, 0.5,
                        -0.35, 0.5, -0.5,
                        0.35, 0.5, -0.5,

                        0.35, 0.5, 0.5,
                        -0.35, 0.5, -0.5,
                        0.35, 0.5, 0.5,
                        -0.35, 0.5, 0.5,

                        -0.35, -0.5, -0.5,
                        -0.35, 0.5, -0.5,
                        -0.35, 0.5, 0.5,
                        -0.35, -0.5, -0.5,

                        -0.35, 0.5, 0.5,
                        -0.35, -0.5, 0.5,
                        0.35, -0.5, -0.5,
                        0.35, 0.5, -0.5,

                        0.35, 0.5, 0.5,
                        0.35, -0.5, -0.5,
                        0.35, 0.5, 0.5,
                        0.35, -0.5, 0.5,

                        -0.35, -1.0, .5,
                        -0.35, -0.5, 0.5,
                        -0.35, -0.5, 0.1,

                        -0.35, -1.0, 0.2,
                        -0.35, -1.0, 0.5,
                        -0.35, -0.5, 0.2,


                        -0.35, -1.0, -.5,
                        -0.35, -0.5, -0.5,
                        -0.35, -0.5, -0.2,

                        -0.35, -1.0, -0.2,
                        -0.35, -1.0, -0.5,
                        -0.35, -0.5, -0.2
                    ]
                },
                vnormal: {
                    numComponents: 3,
                    data: [
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, -1,
                        0, 0, -1,
                        0, 0, 1,
                        0, 0, 1,

                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,

                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,

                        0, -1, 0,
                        0, -1, 0,
                        0, 1, 0,
                        0, 1, 0,

                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,

                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

                        -1, 0, 0,
                        -1, 0, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

                    ]
                },
                vTex: {
                    numComponents: 3,
                    data:
                        [
                            0, 0,
                            1, 0,
                            1, 1,
                            0, 1
                        ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
        if (!texture) {
            texture = twgl.createTextures(gl, {
                scb: {src: "data:image/png;base64,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"

        }
            });
        }
    };
    scoreboard.prototype.draw = function (drawingState) {

        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        modelM = twgl.m4.rotationY(Math.PI / 2);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var normalMatrix = [1, 1, 0, 0, 1, 1, 1, 0, 1];
        window.gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram,
            {
                view: drawingState.view,
                proj: drawingState.proj,
                lightdir: drawingState.sunDirection,
                cubecolor: this.color,
                model: modelM,
                normalMatrix: normalMatrix,
                u_texture: texture.scb
            });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    scoreboard.prototype.center = function (drawingState) {
        return this.position;
    }

})();

grobjects.push(new scoreboard("Scoreboard CF", [0, 1, 3], 1, [1.0, 1.0, 1.0]));
grobjects.push(new scoreboard("Scoreboard LF", [2, 1, 2], 1, [1.0, 1.0, 1.0]));
grobjects.push(new scoreboard("Scoreboard RF", [-2, 1, 2], 1, [1.0, 1.0, 1.0]));


