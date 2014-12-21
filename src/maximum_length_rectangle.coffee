#Mbr = require 'graham_scan' //TODO find out why the hell this thing is not working
Mbr = require './convexhull.js'

getRect = (points) ->
    getAngle = (p1, p2) ->
        #console.log("inside getAngle")
        #console.log(p1)
        #console.log(p2)
        width = p2[0] - p1[0]
        height = p2[1] - p1[1]
        angle = Math.atan2(height, width)
        #console.log("Angle is "+angle/Math.PI*180)
        return angle
    rotatePoints = (points, angle, p0) ->
        if not p0
            p0 = points[0]
        rPoints = []
        for p in points
            sp = [
                p[0] - p0[0],
                p[1] - p0[1]
            ]
            rp = [
                sp[0]*Math.cos(angle) - sp[1]*Math.sin(angle) + p0[0],
                sp[0]*Math.sin(angle) + sp[1]*Math.cos(angle) + p0[1]
            ]
            rPoints.push(rp)
        return rPoints
    getBounds = (points) ->
        minX = points[0][0]
        minY = points[0][1]
        maxX = minX
        maxY = minY
        for p in points
            if p[0] < minX
                minX = p[0]
            if p[0] > maxX
                maxX = p[0]
            if p[1] < minY
                minY = p[1]
            if p[1] > maxY
                maxY = p[1]
        return [[minX, minY], [maxX, maxY]]

    convexHull = new Mbr()
    for p in points
        convexHull.addPoint(p[0], p[1])
    hullPoints = [[p.x, p.y] for p in convexHull.getHull()][0]
    #console.log("Hull Points are")
    #console.log(hullPoints)
    maxObj = { angle: 0, side: 0, p: []}
    for i in [0..(hullPoints.length - 1)]
        angle = getAngle(hullPoints[i], hullPoints[(i+1) % (hullPoints.length)])
        #console.log("Angle is "+angle*180/Math.PI)
        rp = rotatePoints(hullPoints, angle)
        #console.log("Rotated poly is "+rp)
        bb = getBounds rp
        #console.log("New bounds is "+bb)
        side = Math.max(bb[1][0] -  bb[0][0], bb[1][1] - bb[0][1])
        #console.log("Got side: "+side)
        if side>=maxObj.side
            maxObj.angle = angle
            maxObj.side = side
            maxObj.p = hullPoints[i]
    rpb = getBounds(rotatePoints(points, maxObj.angle, maxObj.p))
    
    bboxPoints = [
        [ rpb[0][0], rpb[0][1] ]
        [ rpb[1][0], rpb[0][1] ]
        [ rpb[1][0], rpb[1][1] ]
        [ rpb[0][0], rpb[1][1] ]
        [ rpb[0][0], rpb[0][1] ]
    ]
    #console.log(bboxPoints)
    return { polygon: rotatePoints(bboxPoints, -maxObj.angle, maxObj.p), meta: maxObj}

test = () ->
    points = [ [0.0, 0.0], [1.5, 0.0], [4.5, 3.0], [1.0, 0.1], 
               [0.0, 0.0]
             ]
    console.log(points)
    console.log(getRect(points))

#test()
module.export = getRect
