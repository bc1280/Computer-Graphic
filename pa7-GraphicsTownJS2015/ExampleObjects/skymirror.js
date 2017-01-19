
var grobjects = grobjects || [];
var mirror = undefined;

(function () {
    "use strict";

    // since there will be one of these, just keep info in the closure
    var shaderProgram = undefined;
    var fb = undefined;
    var buffers = undefined;

    var index = 0;
    var prevMirror = undefined;

    mirror = function (position, front, up) {
        this.name = "mirror" + index++;
        this.position = position || [0, 1, 0];
        this.front = twgl.v3.normalize(front) || [1, 0, 0];
        this.up = up || [0, 1, 0];
        this.doubleRender = true;
    };
    var transform = function (n) {
        return [1 - 2 * n[0] * n[0], -2 * n[0] * n[1], -2 * n[0] * n[2], 0, -2 * n[0] * n[1], 1 - 2 * n[1] * n[1], -2 * n[1] * n[2], 0, -2 * n[0] * n[2], -2 * n[1] * n[2], 1 - 2 * n[2] * n[2], 0, 0, 0, 0, 1];
    };

    mirror.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skymirror-vs", "skymirror-fs"]);
        }
        if (!buffers) {
            var arrays = twgl.primitives.createPlaneVertices(3, 3);
            var mirror = {vpos: arrays.position, indices: arrays.indices};
            buffers = twgl.createBufferInfoFromArrays(gl, mirror);
        }
        if (!fb) {
            fb = twgl.createFramebufferInfo(gl);
        }
        this.pair = prevMirror;
        if (!prevMirror) {
            prevMirror = this;
        } else {
            prevMirror.pair = this;
            prevMirror = undefined;
            this.updatePos();
        }
    };

    mirror.prototype.updatePos = function () {
        var selfAt = twgl.v3.add(this.position, this.front);
        this.trans = twgl.m4.lookAt(this.position, selfAt, this.up);
        var pairAt = twgl.v3.add(this.pair.position, this.pair.front);
        this.pair.trans = twgl.m4.lookAt(this.pair.position, pairAt, this.pair.up);

        var mirror = transform(this.front);
        this.toPair = twgl.m4.multiply(twgl.m4.inverse(this.trans), mirror);
        twgl.m4.multiply(this.toPair, this.pair.trans, this.toPair);
        var pairMirror = transform(this.pair.front);
        this.pair.toPair = twgl.m4.multiply(twgl.m4.inverse(this.pair.trans), pairMirror);
        twgl.m4.multiply(this.pair.toPair, this.trans, this.pair.toPair);
    };

    mirror.prototype.draw = function (drawingState) {
        if (Math.random() < 0.0005) {
            for (var i = 0; i < 3; i++) {
                this.position[i] = (Math.random() - 0.5) * 10;
                this.front[i] += (Math.random() - 0.5);
                this.up[i] += (Math.random() - 0.5);
            }
            this.position[1] = Math.abs(this.position[1]);
            twgl.v3.normalize(this.front, this.front);
            //this.updatePos();
        }
        var gl = drawingState.gl;
        var storeV = drawingState.view;
        var pairV = twgl.m4.inverse(drawingState.view);
        twgl.m4.multiply(pairV, this.toPair, pairV);
        twgl.m4.inverse(pairV, pairV);
        drawingState.view = pairV;
        drawingState.toFramebuffer = true;

        gl.bindFramebuffer(gl.FRAMEBUFFER, fb.framebuffer);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        grobjects.forEach(function (obj) {
            if (!obj.doubleRender) {
                obj.draw(drawingState);
            }
        });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        drawingState.view = storeV;
        drawingState.toFramebuffer = false;

        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,
            {
                model: this.trans,
                view: drawingState.view,
                proj: drawingState.proj,
                uTexture: fb.attachments[0]
            });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };

    mirror.prototype.center = function (drawingState) {
        return this.position;
    };

})();
grobjects.push(new mirror([2, 3, 2], [1, -1, 1], [0, 1, 0]));
grobjects.push(new mirror([2, 3, -2], [-1, 1, 1], [0, 1, 0]));
grobjects.push(new mirror([-2, 3, 2], [-1, -1, 1], [0, 1, 0]));
grobjects.push(new mirror([-2, 3, -2], [1, 1, 1], [0, 1, 0]));


