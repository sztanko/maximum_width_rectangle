(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Graham's Scan Convex Hull Algorithm
 * @desc An implementation of the Graham's Scan Convex Hull algorithm in Javascript.
 * @author Brian Barnett, brian@3kb.co.uk, http://brianbar.net/ || http://3kb.co.uk/
 * @version 1.0.2
 */
function ConvexHullGrahamScan() {
    this.anchorPoint = undefined;
    this.reverse = false;
    this.points = [];
}

ConvexHullGrahamScan.prototype = {

    constructor: ConvexHullGrahamScan,

    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },

    _findPolarAngle: function (a, b) {
        var ONE_RADIAN = 57.295779513082;
        var deltaX = (b.x - a.x);
        var deltaY = (b.y - a.y);

        if (deltaX == 0 && deltaY == 0) {
            return 0;
        }

        var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        if (this.reverse){
            if (angle <= 0) {
                angle += 360;
            }
        }else{
            if (angle >= 0) {
                angle += 360;
            }
        }

        return angle;
    },

    addPoint: function (x, y) {
        //Check to see if anchorPoint has been defined yet.
        if (this.anchorPoint === undefined) {
            //Create new anchorPoint.
            this.anchorPoint = new this.Point(x, y);

            // Sets anchorPoint if point being added is further left.
        } else if (this.anchorPoint.y > y || (this.anchorPoint.y == y && this.anchorPoint.x > x)) {
            this.anchorPoint.y = y;
            this.anchorPoint.x = x;
            this.points.unshift(new this.Point(x, y));
            return;
        }

        this.points.push(new this.Point(x, y));
    },

    _sortPoints: function () {
        var self = this;

        return this.points.sort(function (a, b) {
            var polarA = self._findPolarAngle(self.anchorPoint, a);
            var polarB = self._findPolarAngle(self.anchorPoint, b);

            if (polarA < polarB) {
                return -1;
            }
            if (polarA > polarB) {
                return 1;
            }

            return 0;
        });
    },

    _checkPoints: function (p0, p1, p2) {
        var difAngle;
        var cwAngle = this._findPolarAngle(p0, p1);
        var ccwAngle = this._findPolarAngle(p0, p2);

        if (cwAngle > ccwAngle) {

            difAngle = cwAngle - ccwAngle;

            return !(difAngle > 180);

        } else if (cwAngle < ccwAngle) {

            difAngle = ccwAngle - cwAngle;

            return (difAngle > 180);

        }

        return false;
    },

    getHull: function () {
        var hullPoints = [],
            points,
            pointsLength;

        this.reverse = this.points.every(function(point){
            return (point.x < 0 && point.y < 0);
        });

        points = this._sortPoints();
        pointsLength = points.length;

        //If there are less than 4 points, joining these points creates a correct hull.
        if (pointsLength < 4) {
            return points;
        }

        //move first two points to output array
        hullPoints.push(points.shift(), points.shift());

        //scan is repeated until no concave points are present.
        while (true) {
            var p0,
                p1,
                p2;

            hullPoints.push(points.shift());

            p0 = hullPoints[hullPoints.length - 3];
            p1 = hullPoints[hullPoints.length - 2];
            p2 = hullPoints[hullPoints.length - 1];

            if (this._checkPoints(p0, p1, p2)) {
                hullPoints.splice(hullPoints.length - 2, 1);
            }

            if (points.length == 0) {
                if (pointsLength == hullPoints.length) {
                    return hullPoints;
                }
                points = hullPoints;
                pointsLength = points.length;
                hullPoints = [];
                hullPoints.push(points.shift(), points.shift());
            }
        }
    }
};

// EXPORTS

if (typeof define === 'function' && define.amd) {
    define(function() {
        return ConvexHullGrahamScan;
    });
}
if (typeof module !== 'undefined') {
    module.exports = ConvexHullGrahamScan;
}

},{}],2:[function(require,module,exports){
var Mbr, getRect, test;

Mbr = require('./convexhull');

getRect = function(points) {
  var angle, bb, bboxPoints, convexHull, getAngle, getBounds, hullPoints, i, maxObj, p, rotatePoints, rp, rpb, side, _i, _j, _len, _ref;
  getAngle = function(p1, p2) {
    var angle, height, width;
    width = p2[0] - p1[0];
    height = p2[1] - p1[1];
    angle = Math.atan2(height, width);
    return angle;
  };
  rotatePoints = function(points, angle, p0) {
    var p, rPoints, rp, sp, _i, _len;
    if (!p0) {
      p0 = points[0];
    }
    rPoints = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      p = points[_i];
      sp = [p[0] - p0[0], p[1] - p0[1]];
      rp = [sp[0] * Math.cos(angle) - sp[1] * Math.sin(angle) + p0[0], sp[0] * Math.sin(angle) + sp[1] * Math.cos(angle) + p0[1]];
      rPoints.push(rp);
    }
    return rPoints;
  };
  getBounds = function(points) {
    var maxX, maxY, minX, minY, p, _i, _len;
    minX = points[0][0];
    minY = points[0][1];
    maxX = minX;
    maxY = minY;
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      p = points[_i];
      if (p[0] < minX) {
        minX = p[0];
      }
      if (p[0] > maxX) {
        maxX = p[0];
      }
      if (p[1] < minY) {
        minY = p[1];
      }
      if (p[1] > maxY) {
        maxY = p[1];
      }
    }
    return [[minX, minY], [maxX, maxY]];
  };
  convexHull = new Mbr();
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    p = points[_i];
    convexHull.addPoint(p[0], p[1]);
  }
  hullPoints = [
    (function() {
      var _j, _len1, _ref, _results;
      _ref = convexHull.getHull();
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        p = _ref[_j];
        _results.push([p.x, p.y]);
      }
      return _results;
    })()
  ][0];
  maxObj = {
    angle: 0,
    side: 0,
    p: []
  };
  for (i = _j = 0, _ref = hullPoints.length - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
    angle = getAngle(hullPoints[i], hullPoints[(i + 1) % hullPoints.length]);
    rp = rotatePoints(hullPoints, angle);
    bb = getBounds(rp);
    side = Math.max(bb[1][0] - bb[0][0], bb[1][1] - bb[0][1]);
    if (side >= maxObj.side) {
      maxObj.angle = angle;
      maxObj.side = side;
      maxObj.p = hullPoints[i];
    }
  }
  rpb = getBounds(rotatePoints(points, maxObj.angle, maxObj.p));
  bboxPoints = [[rpb[0][0], rpb[0][1]], [rpb[1][0], rpb[0][1]], [rpb[1][0], rpb[1][1]], [rpb[0][0], rpb[1][1]], [rpb[0][0], rpb[0][1]]];
  return {
    polygon: rotatePoints(bboxPoints, -maxObj.angle, maxObj.p),
    meta: maxObj
  };
};

test = function() {
  var points;
  points = [[0.0, 0.0], [1.5, 0.0], [4.5, 3.0], [1.0, 0.1], [0.0, 0.0]];
  console.log(points);
  return console.log(getRect(points));
};

// ---------- Mapping Example ---------- //
var map = L.map('map', {
    center:[49.283259, -123.122659] , //[49.2503, -123.062]
    zoom:17,
    maxZoom:20,
    attributionControl:true,
    zoomControl: true
});
// add toner labels
var Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20
}).addTo(map);

test2 = function(){
  d3.json("data/example_vancouver_buildings.geojson", function(data) {
    var svgstyle = function style(feature) {
        return {
            fillColor: "#B2B2B2",
            weight: 1,
            opacity: 0.75,
            color: '#808080', //#fff
            // dashArray: '3',
            fillOpacity: 1
        };
    }
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 3,
            opacity: 0.85,
            color: '#CCCCFF', //#fff
            dashArray: '',
            fillOpacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        // info.update();
    }
    var geomangle = [];
    function zoomToFeature(e) {
      // map.fitBounds(e.target.getBounds());
      geomangle = getRect(e.target.feature.geometry.coordinates[0])
      console.log(geomangle);
      var geobounds = [{
        "type": "Feature",
        "properties": {"boundingbox": "yes"},
        "geometry":{
          "type": "Polygon",
          "coordinates":[[]]
        }
      }];
      geomangle.polygon.forEach(function(i){
        geobounds[0].geometry.coordinates[0].push(i);
      })
     L.geoJson(geobounds[0]).addTo(map);
     
    }

    var info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Polygon Examples</h4>' +  (props ?
            '<b>' + 'Angle from true north: ' + geomangle.meta.angle 
            : 'Click on a polygon');
    };
    info.addTo(map);

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });

    }
    geojson = L.geoJson(data, {
        style: svgstyle,
        onEachFeature: onEachFeature
    }).addTo(map);
  });

  
};
test2();

module["export"] = getRect;


},{"./convexhull":1}]},{},[2])



