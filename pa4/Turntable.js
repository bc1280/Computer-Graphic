/**
 * Created by Bill Chang on 10/7/2016.
 */
"use strict";

/**
 * Define Point Object
 * @param coordinates
 * @constructor
 */

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

/**
 * Define Triangle Object
 * @param threePoints
 * @constructor
 */

var Triangle = function (threePoints) {
    this.v1 = threePoints[0];
    this.v2 = threePoints[1];
    this.v3 = threePoints[2];
};

Triangle.prototype.set = function (threePoints) {
    this.v1 = threePoints[0];
    this.v2 = threePoints[1];
    this.v3 = threePoints[2];
};

Triangle.prototype.draw = function (context, wf, camera, projection, viewport) {
    if (wf) {
        line(this.v1, this.v2, camera, projection, viewport);
        line(this.v2, this.v3, camera, projection, viewport);
        line(this.v3, this.v1, camera, projection, viewport);
    } else {
        var c1 = to2d(this.v1, camera, projection, viewport);
        var c2 = to2d(this.v2, camera, projection, viewport);
        var c3 = to2d(this.v3, camera, projection, viewport);
        context.beginPath();
        context.moveTo(c1.x, c1.y);
        context.lineTo(c2.x, c2.y);
        context.lineTo(c3.x, c3.y);
        context.lineTo(c1.x, c1.y);
        context.fill();
        context.stroke();
    }
};

Triangle.prototype.getV1 = function () {
    return this.v1;
};

Triangle.prototype.getV2 = function () {
    return this.v2;
};

Triangle.prototype.getV3 = function () {
    return this.v3;
};

/**
 * Define Turntable Object
 * @param startingPoint
 * @param stripRadius
 * @constructor
 */


var Turntable = function (startingPoint, radius) {
    this.startingPoint = startingPoint;
    this.radius = radius;
};

Turntable.prototype.set = function (startingPoint, radius) {
    this.startingPoint = startingPoint;
    this.radius = radius;
};

Turntable.prototype.draw = function (ctx, sort, wireFrame, camera_matrix, projection_matrix, viewport_matrix) {


    var i = 0, p = [];

    for (var u = 0; u < 2*Math.PI; u = u + (1/6)*Math.PI) {
        p[i] = new Point([startingPoint.x + radius*Math.cos(u), 0.5, startingPoint.z + radius*Math.sin(u)]);
        i++;
        p[i] = new Point([startingPoint.x + radius*Math.cos(u), -0.5, startingPoint.z + radius*Math.sin(u)]);
        i++;
    }
    p[24] = new Point([0,0,0]);

    var triangles = [
        new Triangle([p[0], p[1], p[3]]),
        new Triangle([p[0], p[3], p[2]]),
        new Triangle([p[2], p[3], p[5]]),
        new Triangle([p[2], p[5], p[4]]),
        new Triangle([p[4], p[5], p[7]]),
        new Triangle([p[4], p[7], p[6]]),
        new Triangle([p[6], p[7], p[9]]),
        new Triangle([p[6], p[9], p[8]]),
        new Triangle([p[8], p[9], p[11]]),
        new Triangle([p[8], p[11], p[10]]),
        new Triangle([p[10], p[11], p[13]]),
        new Triangle([p[10], p[13], p[12]]),
        new Triangle([p[12], p[13], p[15]]),
        new Triangle([p[12], p[15], p[14]]),
        new Triangle([p[14], p[15], p[17]]),
        new Triangle([p[14], p[17], p[16]]),
        new Triangle([p[16], p[17], p[19]]),
        new Triangle([p[16], p[19], p[18]]),
        new Triangle([p[18], p[19], p[21]]),
        new Triangle([p[18], p[21], p[20]]),
        new Triangle([p[20], p[21], p[23]]),
        new Triangle([p[20], p[23], p[22]]),
        new Triangle([p[22], p[23], p[1]]),
        new Triangle([p[22], p[1], p[0]]),
        new Triangle([p[24], p[0], p[2]]),
        new Triangle([p[24], p[2], p[4]]),
        new Triangle([p[24], p[4], p[6]]),
        new Triangle([p[24], p[6], p[8]]),
        new Triangle([p[24], p[8], p[10]]),
        new Triangle([p[24], p[10], p[12]]),
        new Triangle([p[24], p[12], p[14]]),
        new Triangle([p[24], p[14], p[16]]),
        new Triangle([p[24], p[16], p[18]]),
        new Triangle([p[24], p[18], p[20]]),
        new Triangle([p[24], p[20], p[22]]),
        new Triangle([p[24], p[22], p[0]]),
        new Triangle([p[24], p[3], p[1]]),
        new Triangle([p[24], p[5], p[3]]),
        new Triangle([p[24], p[7], p[5]]),
        new Triangle([p[24], p[9], p[7]]),
        new Triangle([p[24], p[11], p[9]]),
        new Triangle([p[24], p[13], p[11]]),
        new Triangle([p[24], p[15], p[13]]),
        new Triangle([p[24], p[17], p[15]]),
        new Triangle([p[24], p[19], p[17]]),
        new Triangle([p[24], p[21], p[19]]),
        new Triangle([p[24], p[23], p[21]]),
        new Triangle([p[24], p[1], p[23]]),
    ];

    var origin = [0, 0, 0];
    var dists = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var totVtx = 48;
    var centers = [];
    for (var i = 0; i < totVtx; i++) {
        centers.push(origin);
    }

    for (var i = 0; i < triangles.length; i++) {
        var P1 = to2d(triangles[i].getV1(), camera_matrix, projection_matrix, viewport_matrix);
        var P2 = to2d(triangles[i].getV2(), camera_matrix, projection_matrix, viewport_matrix);
        var P3 = to2d(triangles[i].getV3(), camera_matrix, projection_matrix, viewport_matrix);
        centers[i] = new Point([
                (P1.getX() + P2.getX() + P3.getX()) / 3,
                (P1.getY() + P2.getY() + P3.getY()) / 3,
                (P1.getZ() + P2.getZ() + P3.getZ()) / 3
            ]
        );
        dists[i] = centers[i].getZ();
    }

    if (sort) {
        for (var i = 0; i < dists.length; i++) {
            var maxDist = -9999999;
            var maxIndex = 0;
            for (var j = i; j < dists.length; j++) {
                if (dists[j] > maxDist) {
                    maxDist = dists[j];
                    maxIndex = j;
                }
            }
            var tmp_dist = dists[i];
            var tmp_center = centers[i];
            var tmp_tri = triangles[i];
            dists[i] = dists[maxIndex];
            centers[i] = centers[maxIndex];
            triangles[i] = triangles[maxIndex];
            dists[maxIndex] = tmp_dist;
            centers[maxIndex] = tmp_center;
            triangles[maxIndex] = tmp_tri;
        }
    }
    for (var i = 0; i < triangles.length; i++) {

        ctx.fillStyle = 'rgb(' + i*49%256 + ','+ 250 + ',' + 250 + ')';

        triangles[i].draw(ctx, wireFrame, camera_matrix, projection_matrix, viewport_matrix);
    }

};