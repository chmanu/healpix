/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var healpix = __webpack_require__(2);
var simple_canvas_1 = __webpack_require__(3);
var PI = Math.PI;
var nside = 64;
var radius = Math.PI / 8;
window.addEventListener('load', function (e) {
    var gridCanvas = new simple_canvas_1.SimpleCanvas(setupCanvas(document.getElementById('grid')), -PI, PI, PI, 0, 0.05);
    var overlayCanvas = new simple_canvas_1.SimpleCanvas(setupCanvas(document.getElementById('overlay')), -PI, PI, PI, 0, 0.05);
    drawGrid(gridCanvas, nside);
    overlayCanvas.onmousemove(function (phi, theta) {
        phi = (phi + 2 * PI) % (2 * PI);
        overlayCanvas.clear();
        var v = healpix.ang2vec(theta, phi);
        healpix.query_disc_inclusive_nest(nside, v, radius, function (ipix) {
            fillPixel(overlayCanvas, nside, ipix);
        });
    });
});
function drawGrid(canvas, nside) {
    var npix = healpix.nside2npix(nside);
    var ctx = canvas.ctx;
    ctx.strokeStyle = 'rgba(0, 0, 127, 0.25)';
    for (var ipix = 0; ipix < npix; ++ipix) {
        ctx.beginPath();
        pixelPath(canvas, nside, ipix);
        canvas.ctx.closePath();
        ctx.stroke();
    }
}
function fillPixel(canvas, nside, ipix) {
    var ctx = canvas.ctx;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    pixelPath(canvas, nside, ipix, 8);
    ctx.fill();
}
function pixelPath(canvas, nside, ipix, nstep) {
    if (nstep === void 0) { nstep = 4; }
    var v0 = healpix.pixcoord2vec_nest(nside, ipix, 0, 0);
    var phi0 = Math.atan2(v0[1], v0[0]);
    var lineTo = function (x, y) {
        var _a = canvas.world2screen(x, y), x1 = _a[0], y1 = _a[1];
        canvas.ctx.lineTo(x1, y1);
    };
    function clamp(x, a, b) {
        return x < a ? a : (x > b ? b : x);
    }
    function safe(x) {
        return clamp(x, 1.e-9, 1 - 1.e-9);
    }
    for (var i = 0; i < nstep; ++i) {
        var ne = i / nstep;
        var _a = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(ne), safe(0)), v0), x = _a[0], y = _a[1], z = _a[2];
        var phi = Math.atan2(y, x) + phi0;
        lineTo(phi, Math.acos(z));
    }
    for (var i = 0; i < nstep; ++i) {
        var nw = i / nstep;
        var _b = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(1), safe(nw)), v0), x = _b[0], y = _b[1], z = _b[2];
        var phi = Math.atan2(y, x) + phi0;
        lineTo(phi, Math.acos(z));
    }
    for (var i = 0; i < nstep; ++i) {
        var ne = 1 - i / nstep;
        var _c = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(ne), safe(1)), v0), x = _c[0], y = _c[1], z = _c[2];
        var phi = Math.atan2(y, x) + phi0;
        lineTo(phi, Math.acos(z));
    }
    for (var i = 0; i < nstep; ++i) {
        var nw = 1 - i / nstep;
        var _d = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(0), safe(nw)), v0), x = _d[0], y = _d[1], z = _d[2];
        var phi = Math.atan2(y, x) + phi0;
        lineTo(phi, Math.acos(z));
    }
}
function rotateZ(_a, _b) {
    var x = _a[0], y = _a[1], z = _a[2];
    var x0 = _b[0], y0 = _b[1], z0 = _b[2];
    return [
        x * x0 + y * y0,
        y * x0 - x * y0,
        z,
    ];
}
function setupCanvas(canvas) {
    var _a = canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    return canvas;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// js implementation of healpix
// http://iopscience.iop.org/article/10.1086/427976/pdf
//
// notations
// ---------
// theta :  colatitude (pi/2 - delta)                [0 , pi]
// phi   :  longitutde (alpha)                       [0, 2 pi)
// t     :  coord. of x-axis in spherical projection [0, 2 pi)
// u     :  coord. of y-axis in spherical projection [-1/2, 1/2]
// z     :  cos(theta)                               [-1, 1]
// X     :  sin(theta) * cos(phi)                    [-1, 1]
// Y     :  sin(theta) * sin(phi)                    [-1, 1]
// a     :  phi                                      [0, 2 pi)
// f     :  base pixel index                         {0 .. 11}
// x     :  north-east index in base pixel           [0, nside)
// y     :  north-west index in base pixel           [0, nside)
// p     :  north-east axis in base pixel            [0, 1)
// q     :  north-west axis in base pixel            [0, 1)
// i     :  ring index                               {1 .. 4 nside - 1}
// j     :  pixel-in-ring index                      polar cap: {1 .. 4 i} ; equatorial belt: {1 .. 4 nside}
Object.defineProperty(exports, "__esModule", { value: true });
function order2nside(order) {
    return 1 << order;
}
exports.order2nside = order2nside;
function nside2npix(nside) {
    return 12 * nside * nside;
}
exports.nside2npix = nside2npix;
function vec2pix_nest(nside, v) {
    var _a = vec2za(v[0], v[1], v[2]), z = _a.z, a = _a.a;
    return za2pix_nest(nside, z, a);
}
exports.vec2pix_nest = vec2pix_nest;
function vec2pix_ring(nside, v) {
    var _a = vec2za(v[0], v[1], v[2]), z = _a.z, a = _a.a;
    return nest2ring(nside, za2pix_nest(nside, z, a));
}
exports.vec2pix_ring = vec2pix_ring;
function ang2pix_nest(nside, theta, phi) {
    var z = Math.cos(theta);
    return za2pix_nest(nside, z, phi);
}
exports.ang2pix_nest = ang2pix_nest;
function ang2pix_ring(nside, theta, phi) {
    var z = Math.cos(theta);
    return nest2ring(nside, za2pix_nest(nside, z, phi));
}
exports.ang2pix_ring = ang2pix_ring;
function nest2ring(nside, ipix) {
    var _a = nest2fxy(nside, ipix), f = _a.f, x = _a.x, y = _a.y;
    return fxy2ring(nside, f, x, y);
}
exports.nest2ring = nest2ring;
function ring2nest(nside, ipix) {
    if (nside == 1) {
        return ipix;
    }
    var _a = ring2fxy(nside, ipix), f = _a.f, x = _a.x, y = _a.y;
    return fxy2nest(nside, f, x, y);
}
exports.ring2nest = ring2nest;
function ring2fxy(nside, ipix) {
    var polar_lim = 2 * nside * (nside - 1);
    if (ipix < polar_lim) {
        var i = Math.floor((Math.sqrt(1 + 2 * ipix) + 1) / 2);
        var j = ipix - 2 * i * (i - 1);
        var f = Math.floor(j / i);
        var k = j % i;
        var x = nside - i + k;
        var y = nside - 1 - k;
        return { f: f, x: x, y: y };
    }
    if (ipix < polar_lim + 8 * nside * nside) {
        var k = ipix - polar_lim;
        var ring = 4 * nside;
        var i = nside - Math.floor(k / ring);
        var s = i % 2 == 0 ? 1 : 0;
        var j = 2 * (k % ring) + s;
        var jj = j - 4 * nside;
        var ii = i + 5 * nside - 1;
        var pp = (ii + jj) / 2;
        var qq = (ii - jj) / 2;
        var PP = Math.floor(pp / nside);
        var QQ = Math.floor(qq / nside);
        var V = 5 - (PP + QQ);
        var H = PP - QQ + 4;
        var f = 4 * V + (H >> 1) % 4;
        var x = pp % nside;
        var y = qq % nside;
        return { f: f, x: x, y: y };
    }
    else {
        var p = 12 * nside * nside - ipix - 1;
        var i = Math.floor((Math.sqrt(1 + 2 * p) + 1) / 2);
        var j = p - 2 * i * (i - 1);
        var f = 11 - Math.floor(j / i);
        var k = j % i;
        var x = i - k - 1;
        var y = k;
        return { f: f, x: x, y: y };
    }
}
function pix2vec_nest(nside, ipix) {
    var _a = nest2fxy(nside, ipix), f = _a.f, x = _a.x, y = _a.y;
    var _b = fxy2tu(nside, f, x, y), t = _b.t, u = _b.u;
    var _c = tu2za(t, u), z = _c.z, a = _c.a;
    return za2vec(z, a);
}
exports.pix2vec_nest = pix2vec_nest;
function pix2ang_nest(nside, ipix) {
    var _a = nest2fxy(nside, ipix), f = _a.f, x = _a.x, y = _a.y;
    var _b = fxy2tu(nside, f, x, y), t = _b.t, u = _b.u;
    var _c = tu2za(t, u), z = _c.z, a = _c.a;
    return { theta: Math.acos(z), phi: a };
}
exports.pix2ang_nest = pix2ang_nest;
function pix2vec_ring(nside, ipix) {
    return pix2vec_nest(nside, ring2nest(nside, ipix));
}
exports.pix2vec_ring = pix2vec_ring;
function pix2ang_ring(nside, ipix) {
    return pix2ang_nest(nside, ring2nest(nside, ipix));
}
exports.pix2ang_ring = pix2ang_ring;
// TODO: cleanup
function query_disc_inclusive_nest(nside, v, radius, cb) {
    if (radius > PI_2) {
        throw new Error("query_disc: radius must < PI/2");
    }
    var pixrad = max_pixrad(nside);
    var d = PI_4 / nside;
    var _a = vec2za(v[0], v[1], v[2]), z0 = _a.z, a0 = _a.a; // z0 = cos(theta)
    var sin_t = Math.sqrt(1 - z0 * z0);
    var cos_r = Math.cos(radius); // r := radius
    var sin_r = Math.sin(radius);
    var z1 = z0 * cos_r + sin_t * sin_r; // cos(theta - r)
    var z2 = z0 * cos_r - sin_t * sin_r; // cos(theta + r)
    var u1 = za2tu(z1, 0).u;
    var u2 = za2tu(z2, 0).u;
    var cover_north_pole = sin_t * cos_r - z0 * sin_r < 0; // sin(theta - r) < 0
    var cover_south_pole = sin_t * cos_r + z0 * sin_r < 0; // sin(theta - r) < 0
    var i1 = Math.floor((PI_2 - u1) / d);
    var i2 = Math.floor((PI_2 - u2) / d + 1);
    if (cover_north_pole) {
        ++i1;
        for (var i = 1; i <= i1; ++i)
            walk_ring(nside, i, cb);
        ++i1;
    }
    if (i1 == 0) {
        walk_ring(nside, 1, cb);
        i1 = 2;
    }
    if (cover_south_pole) {
        --i2;
        for (var i = i2; i <= 4 * nside - 1; ++i)
            walk_ring(nside, i, cb);
        --i2;
    }
    if (i2 == 4 * nside) {
        walk_ring(nside, 4 * nside - 1, cb);
        i2 = 4 * nside - 2;
    }
    var theta = Math.acos(z0);
    for (var i = i1; i <= i2; ++i)
        walk_ring_around(nside, i, a0, theta, radius + pixrad, function (ipix) {
            if (angle(pix2vec_nest(nside, ipix), v) <= radius + pixrad)
                cb(ipix);
        });
}
exports.query_disc_inclusive_nest = query_disc_inclusive_nest;
function query_disc_inclusive_ring(nside, v, radius, cb_ring) {
    return query_disc_inclusive_nest(nside, v, radius, function (ipix) {
        cb_ring(nest2ring(nside, ipix));
    });
}
exports.query_disc_inclusive_ring = query_disc_inclusive_ring;
function max_pixrad(nside) {
    var unit = PI_4 / nside;
    return angle(tu2vec(unit, nside * unit), tu2vec(unit, (nside + 1) * unit));
}
exports.max_pixrad = max_pixrad;
function angle(a, b) {
    return 2 * Math.asin(Math.sqrt(distance2(a, b)) / 2);
}
function tu2vec(t, u) {
    var _a = tu2za(t, u), z = _a.z, a = _a.a;
    return za2vec(z, a);
}
function distance2(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
}
function walk_ring_around(nside, i, a0, theta, r, cb) {
    if (theta < r || theta + r > PI)
        return walk_ring(nside, i, cb);
    var u = PI_4 * (2 - i / nside);
    var z = tu2za(PI_4, u).z;
    var st = Math.sin(theta);
    var ct = Math.cos(theta);
    var sr = Math.sin(r);
    var cr = Math.cos(r);
    var w = Math.atan2(Math.sqrt(-square(z - ct * cr) / (square(st) * sr * sr) + 1) * sr, (-z * ct + cr) / st);
    if (w >= PI)
        return walk_ring(nside, i, cb);
    var t1 = center_t(nside, i, za2tu(z, wrap(a0 - w, PI2)).t);
    var t2 = center_t(nside, i, za2tu(z, wrap(a0 + w, PI2)).t);
    var begin = tu2fxy(nside, t1, u);
    var end = right_next_pixel(nside, tu2fxy(nside, t2, u));
    for (var s = begin; !fxy_compare(s, end); s = right_next_pixel(nside, s)) {
        cb(fxy2nest(nside, s.f, s.x, s.y));
    }
}
function center_t(nside, i, t) {
    var d = PI_4 / nside;
    t /= d;
    t = (((t + i % 2) >> 1) << 1) + 1 - i % 2;
    t *= d;
    return t;
}
function walk_ring(nside, i, cb) {
    var u = PI_4 * (2 - i / nside);
    var t = PI_4 * (1 + (1 - i % 2) / nside);
    var begin = tu2fxy(nside, t, u);
    var s = begin;
    do {
        cb(fxy2nest(nside, s.f, s.x, s.y));
        s = right_next_pixel(nside, s);
    } while (!fxy_compare(s, begin));
}
function fxy_compare(a, b) {
    return a.x == b.x && a.y == b.y && a.f == b.f;
}
function right_next_pixel(nside, _a) {
    var f = _a.f, x = _a.x, y = _a.y;
    ++x;
    if (x == nside) {
        switch (Math.floor(f / 4)) {
            case 0:
                f = (f + 1) % 4;
                x = y;
                y = nside;
                break;
            case 1:
                f = f - 4;
                x = 0;
                break;
            case 2:
                f = 4 + (f + 1) % 4;
                x = 0;
                break;
        }
    }
    --y;
    if (y == -1) {
        switch (Math.floor(f / 4)) {
            case 0:
                f = 4 + (f + 1) % 4;
                y = nside - 1;
                break;
            case 1:
                f = f + 4;
                y = nside - 1;
                break;
            case 2: {
                f = 8 + (f + 1) % 4;
                y = x - 1;
                x = 0;
                break;
            }
        }
    }
    return { f: f, x: x, y: y };
}
function corners_nest(nside, ipix) {
    var _a = nest2fxy(nside, ipix), f = _a.f, x = _a.x, y = _a.y;
    var _b = fxy2tu(nside, f, x, y), t = _b.t, u = _b.u;
    var d = PI_4 / nside;
    var xyzs = [];
    for (var _i = 0, _c = [
        [0, d],
        [-d, 0],
        [0, -d],
        [d, 0],
    ]; _i < _c.length; _i++) {
        var _d = _c[_i], tt = _d[0], uu = _d[1];
        var _e = tu2za(t + tt, u + uu), z = _e.z, a = _e.a;
        xyzs.push(za2vec(z, a));
    }
    return xyzs;
}
exports.corners_nest = corners_nest;
function corners_ring(nside, ipix) {
    return corners_nest(nside, ring2nest(nside, ipix));
}
exports.corners_ring = corners_ring;
// pixel area
function nside2pixarea(nside) {
    return PI / (3 * nside * nside);
}
exports.nside2pixarea = nside2pixarea;
// average pixel size
function nside2resol(nside) {
    return Math.sqrt(PI / 3) / nside;
}
exports.nside2resol = nside2resol;
function pixcoord2vec_nest(nside, ipix, ne, nw) {
    var _a = nest2fxy(nside, ipix), f = _a.f, x = _a.x, y = _a.y;
    var _b = fxy2tu(nside, f, x, y), t = _b.t, u = _b.u;
    var d = PI_4 / nside;
    var _c = tu2za(t + d * (ne - nw), u + d * (ne + nw - 1)), z = _c.z, a = _c.a;
    return za2vec(z, a);
}
exports.pixcoord2vec_nest = pixcoord2vec_nest;
function pixcoord2vec_ring(nside, ipix, ne, nw) {
    return pixcoord2vec_nest(nside, ring2nest(nside, ipix), ne, nw);
}
exports.pixcoord2vec_ring = pixcoord2vec_ring;
function za2pix_nest(nside, z, a) {
    var _a = za2tu(z, a), t = _a.t, u = _a.u;
    var _b = tu2fxy(nside, t, u), f = _b.f, x = _b.x, y = _b.y;
    return fxy2nest(nside, f, x, y);
}
function tu2fxy(nside, t, u) {
    var _a = tu2fpq(t, u), f = _a.f, p = _a.p, q = _a.q;
    var x = clamp(Math.floor(nside * p), 0, nside - 1);
    var y = clamp(Math.floor(nside * q), 0, nside - 1);
    return { f: f, x: x, y: y };
}
function wrap(A, B) {
    return A < 0 ? B - (-A % B) : A % B;
}
var PI2 = 2 * Math.PI;
var PI = Math.PI;
var PI_2 = Math.PI / 2;
var PI_4 = Math.PI / 4;
var PI_8 = Math.PI / 8;
function sigma(z) {
    if (z < 0)
        return -sigma(-z);
    else
        return 2 - Math.sqrt(3 * (1 - z));
}
// (z, phi) -> spherical projection
function za2tu(z, a) {
    if (Math.abs(z) <= 2. / 3.) {
        var t = a;
        var u = 3 * PI_8 * z;
        return { t: t, u: u };
    }
    else {
        var p_t = a % (PI_2);
        var sigma_z = sigma(z);
        var t = a - (Math.abs(sigma_z) - 1) * (p_t - PI_4);
        var u = PI_4 * sigma_z;
        return { t: t, u: u };
    }
}
// spherical projection -> (z, phi)
function tu2za(t, u) {
    var abs_u = Math.abs(u);
    if (abs_u >= PI_2) {
        return { z: sign(u), a: 0 };
    }
    if (abs_u <= Math.PI / 4) {
        var z = 8 / (3 * PI) * u;
        var a = t;
        return { z: z, a: a };
    }
    else {
        var t_t = t % (Math.PI / 2);
        var a = t - (abs_u - PI_4) / (abs_u - PI_2) * (t_t - PI_4);
        var z = sign(u) * (1 - 1 / 3 * square(2 - 4 * abs_u / PI));
        return { z: z, a: a };
    }
}
// (x, y, z) -> (z = cos(theta), phi)
function vec2za(X, Y, z) {
    var r2 = X * X + Y * Y;
    if (r2 == 0)
        return { z: z < 0 ? -1 : 1, a: 0 };
    else {
        var a = (Math.atan2(Y, X) + PI2) % PI2;
        z /= Math.sqrt(z * z + r2);
        return { z: z, a: a };
    }
}
// (z = cos(theta), phi) -> (x, y, z)
function za2vec(z, a) {
    var sin_theta = Math.sqrt(1 - z * z);
    var X = sin_theta * Math.cos(a);
    var Y = sin_theta * Math.sin(a);
    return [X, Y, z];
}
function ang2vec(theta, phi) {
    var z = Math.cos(theta);
    return za2vec(z, phi);
}
exports.ang2vec = ang2vec;
function vec2ang(v) {
    var _a = vec2za(v[0], v[1], v[2]), z = _a.z, a = _a.a;
    return { theta: Math.acos(z), phi: a };
}
exports.vec2ang = vec2ang;
// spherical projection -> f, p, q
// f: base pixel index
// p: coord in north east axis of base pixel
// q: coord in north west axis of base pixel
function tu2fpq(t, u) {
    t /= PI_4;
    u /= PI_4;
    t = wrap(t, 8);
    t += -4;
    u += 5;
    var pp = clamp((u + t) / 2, 0, 5);
    var PP = Math.floor(pp);
    var qq = clamp((u - t) / 2, 3 - PP, 6 - PP);
    var QQ = Math.floor(qq);
    var V = 5 - (PP + QQ);
    if (V < 0) {
        return { f: 0, p: 1, q: 1 };
    }
    var H = PP - QQ + 4;
    var f = 4 * V + (H >> 1) % 4;
    var p = pp % 1;
    var q = qq % 1;
    return { f: f, p: p, q: q };
}
// f, p, q -> nest index
function fxy2nest(nside, f, x, y) {
    return f * nside * nside + bit_combine(x, y);
}
// x = (...x2 x1 x0)_2 <- in binary
// y = (...y2 y1 y0)_2
// p = (...y2 x2 y1 x1 y0 x0)_2
// returns p
function bit_combine(x, y) {
    assert(x < (1 << 16));
    assert(y < (1 << 15));
    return (
    // (python)
    // n = 14
    // ' | '.join(['x & 1'] + [f'(x & 0x{2 ** (i+1):x} | y & 0x{2 ** i:x}) << {i + 1}' for i in range(n)] + [f'y & 0x{2**n:x} << {n+1}'])
    x & 1 | (x & 0x2 | y & 0x1) << 1 | (x & 0x4 | y & 0x2) << 2 |
        (x & 0x8 | y & 0x4) << 3 | (x & 0x10 | y & 0x8) << 4 | (x & 0x20 | y & 0x10) << 5 |
        (x & 0x40 | y & 0x20) << 6 | (x & 0x80 | y & 0x40) << 7 | (x & 0x100 | y & 0x80) << 8 |
        (x & 0x200 | y & 0x100) << 9 | (x & 0x400 | y & 0x200) << 10 | (x & 0x800 | y & 0x400) << 11 |
        (x & 0x1000 | y & 0x800) << 12 | (x & 0x2000 | y & 0x1000) << 13 | (x & 0x4000 | y & 0x2000) << 14 |
        (x & 0x8000 | y & 0x4000) << 15 | y & 0x8000 << 16);
}
exports.bit_combine = bit_combine;
// x = (...x2 x1 x0)_2 <- in binary
// y = (...y2 y1 y0)_2
// p = (...y2 x2 y1 x1 y0 x0)_2
// returns x, y
function bit_decombine(p) {
    assert(p <= 0x7fffffff);
    // (python)
    // ' | '.join(f'(p & 0x{2**(2*i):x}) >> {i}' for i in range(16))
    var x = (p & 0x1) >> 0 | (p & 0x4) >> 1 | (p & 0x10) >> 2 |
        (p & 0x40) >> 3 | (p & 0x100) >> 4 | (p & 0x400) >> 5 |
        (p & 0x1000) >> 6 | (p & 0x4000) >> 7 | (p & 0x10000) >> 8 |
        (p & 0x40000) >> 9 | (p & 0x100000) >> 10 | (p & 0x400000) >> 11 |
        (p & 0x1000000) >> 12 | (p & 0x4000000) >> 13 | (p & 0x10000000) >> 14 | (p & 0x40000000) >> 15;
    // (python)
    // ' | '.join(f'(p & 0x{2**(2*i + 1):x}) >> {i+1}' for i in range(15))
    var y = (p & 0x2) >> 1 | (p & 0x8) >> 2 | (p & 0x20) >> 3 |
        (p & 0x80) >> 4 | (p & 0x200) >> 5 | (p & 0x800) >> 6 |
        (p & 0x2000) >> 7 | (p & 0x8000) >> 8 | (p & 0x20000) >> 9 |
        (p & 0x80000) >> 10 | (p & 0x200000) >> 11 | (p & 0x800000) >> 12 |
        (p & 0x2000000) >> 13 | (p & 0x8000000) >> 14 | (p & 0x20000000) >> 15;
    return { x: x, y: y };
}
exports.bit_decombine = bit_decombine;
// f: base pixel index
// x: north east index in base pixel
// y: north west index in base pixel
function nest2fxy(nside, ipix) {
    var nside2 = nside * nside;
    var f = Math.floor(ipix / nside2); // base pixel index
    var k = ipix % nside2; // nested pixel index in base pixel
    var _a = bit_decombine(k), x = _a.x, y = _a.y;
    return { f: f, x: x, y: y };
}
function fxy2ring(nside, f, x, y) {
    var f_row = Math.floor(f / 4); // {0 .. 2}
    var f1 = f_row + 2; // {2 .. 4}
    var v = x + y;
    var i = f1 * nside - v - 1;
    if (i < nside) {
        var f_col = f % 4;
        var ipix = 2 * i * (i - 1) + (i * f_col) + nside - y - 1;
        return ipix;
    }
    if (i < 3 * nside) {
        var h = x - y;
        var f2 = 2 * (f % 4) - (f_row % 2) + 1; // {0 .. 7}
        var k = (f2 * nside + h + (8 * nside)) % (8 * nside);
        var offset = 2 * nside * (nside - 1);
        var ipix = offset + (i - nside) * 4 * nside + (k >> 1);
        return ipix;
    }
    else {
        var i_i = 4 * nside - i;
        var i_f_col = 3 - (f % 4);
        var j = 4 * i_i - (i_i * i_f_col) - y;
        var i_j = 4 * i_i - j + 1;
        var ipix = 12 * nside * nside - 2 * i_i * (i_i - 1) - i_j;
        return ipix;
    }
}
// f, x, y -> spherical projection
function fxy2tu(nside, f, x, y) {
    var f_row = Math.floor(f / 4);
    var f1 = f_row + 2;
    var f2 = 2 * (f % 4) - (f_row % 2) + 1;
    var v = x + y;
    var h = x - y;
    var i = f1 * nside - v - 1;
    var k = (f2 * nside + h + (8 * nside));
    var t = k / nside * PI_4;
    var u = PI_2 - i / nside * PI_4;
    return { t: t, u: u };
}
function encode_id(order, index) {
    return 4 * ((1 << (2 * order)) - 1) + index;
}
exports.encode_id = encode_id;
function decode_id(id) {
    assert(id <= 0x7fffffff);
    var order = 0;
    var l = (id >> 2) + 1;
    while (l >= 4) {
        l >>= 2;
        ++order;
    }
    var index = id - (((1 << (2 * order)) - 1) << 2);
    return { order: order, index: index };
}
exports.decode_id = decode_id;
var sign = Math.sign || function (A) {
    return A > 0 ? 1 : (A < 0 ? -1 : 0);
};
function square(A) {
    return A * A;
}
function clamp(Z, A, B) {
    return Z < A ? A : (Z > B ? B : Z);
}
function assert(condition) {
    console.assert(condition);
    if (!condition) {
        debugger;
    }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SimpleCanvas = /** @class */ (function () {
    function SimpleCanvas(el, minX, maxX, minY, maxY, margin) {
        if (margin === void 0) { margin = 0; }
        this.el = el;
        this.ctx = el.getContext('2d');
        var w = maxX - minX;
        var h = maxY - minY;
        this.minX = minX - w * margin;
        this.maxX = maxX + w * margin;
        this.minY = minY - h * margin;
        this.maxY = maxY + h * margin;
    }
    SimpleCanvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    };
    SimpleCanvas.prototype.world2screen = function (x, y) {
        var sx = this.ctx.canvas.width;
        var sy = this.ctx.canvas.height;
        var x1 = (x - this.minX) / (this.maxX - this.minX);
        var x2 = sx * x1;
        var y1 = (y - this.minY) / (this.maxY - this.minY);
        var y2 = sy * (1 - y1);
        return [x2, y2];
    };
    SimpleCanvas.prototype.onmousemove = function (cb) {
        var _this = this;
        this.el.addEventListener('mousemove', function (e) {
            var _a = _this.el.getBoundingClientRect(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
            var x0 = (e.clientX - left) / width;
            var x = x0 * (_this.maxX - _this.minX) + _this.minX;
            var y0 = 1 - (e.clientY - top) / height;
            var y = y0 * (_this.maxY - _this.minY) + _this.minY;
            cb(x, y);
        });
    };
    return SimpleCanvas;
}());
exports.SimpleCanvas = SimpleCanvas;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "query_disc.html";

/***/ })
/******/ ]);