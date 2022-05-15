var min = 99;
var max = 999999;
var polygonMode = false;
var pointArray = new Array();
var lineArray = new Array();
var activeLine;
var activeShape = false;
var canvas

window.onload = function(){
    prototypefabric.initCanvas();
    window.document.getElementById('create-polygon').addEventListener('click',prototypefabric.polygon.drawPolygon);
    window.document.getElementById('create-label').addEventListener('click',prototypefabric.text.insertText);
    window.document.getElementById('clear-canvas').addEventListener('click',prototypefabric.clearCanvas);
}

function getid() {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Date().getTime() + random;
}

var prototypefabric = new function () {
    this.initCanvas = function () {
        canvas = window._canvas = new fabric.Canvas('c');
        canvas.setWidth(window.innerWidth-window.document.getElementById('sidebar').offsetWidth);
        canvas.setHeight(window.innerHeight);

        canvas.on('mouse:down', function (options) {
            if(options.target){
                if(options.target.hasOwnProperty('id') && options.target.id == pointArray[0].id) {
                    prototypefabric.polygon.generatePolygon(pointArray);
                }
            }
            if(polygonMode){
                prototypefabric.polygon.addPoint(options);
            }
        });

        canvas.on('mouse:move', function (options) {
            if(activeLine && activeLine.class == "line"){
                var pointer = canvas.getPointer(options.e);
                activeLine.set({ x2: pointer.x, y2: pointer.y });
                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x:pointer.x,
                    y:pointer.y
                }
                activeShape.set({
                    points: points
                });
            }
            canvas.renderAll();
        });
    };
    this.clearCanvas = function () {
        canvas.clear();
        pointArray = new Array();
        lineArray = new Array();
        activeLine;
        activeShape = false;
        polygonMode = false;
        window.document.getElementById('create-polygon').style.removeProperty('background-color');
    };
};

prototypefabric.polygon = {
    drawPolygon : function() {
        polygonMode = true;
        window.document.getElementById('create-polygon').style.backgroundColor = "#68d388";
        pointArray = new Array();
        lineArray = new Array();
        activeLine;
    },
    addPoint : function(options) {
        var id = getid();
        var circle = new fabric.Circle({
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: (options.e.layerX/canvas.getZoom()),
            top: (options.e.layerY/canvas.getZoom()),
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX:'center',
            originY:'center',
            id:id
        });
        if(pointArray.length == 0){
            circle.set({
                fill:'red'
            })
        }
        var points = [(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom()),(options.e.layerX/canvas.getZoom()),(options.e.layerY/canvas.getZoom())];
        line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: '#999999',
            stroke: '#999999',
            class:'line',
            originX:'center',
            originY:'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false
        });
        if(activeShape){
            var pos = canvas.getPointer(options.e);
            var points = activeShape.get("points");
            points.push({
                x: pos.x,
                y: pos.y
            });
            var polygon = new fabric.Polygon(points,{
                stroke:'#333333',
                strokeWidth:1,
                fill: '#cccccc',
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            canvas.remove(activeShape);
            canvas.add(polygon);
            activeShape = polygon;
            canvas.renderAll();
        }
        else{
            var polyPoint = [{x:(options.e.layerX/canvas.getZoom()),y:(options.e.layerY/canvas.getZoom())}];
            var polygon = new fabric.Polygon(polyPoint,{
                stroke:'#333333',
                strokeWidth:1,
                fill: '#cccccc',
                opacity: 0.1,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false
            });
            activeShape = polygon;
            canvas.add(polygon);
        }
        activeLine = line;

        pointArray.push(circle);
        lineArray.push(line);

        canvas.add(line);
        canvas.add(circle);
        canvas.selection = false;
    },
    generatePolygon : function(pointArray){
        var points = new Array();

        pointArray.forEach(point => {
            points.push({
                x:point.left,
                y:point.top
            });
            canvas.remove(point);
        });

        lineArray.forEach(line => {
            canvas.remove(line);
        });

        canvas.remove(activeShape).remove(activeLine);
        var color = window.document.getElementById('polygon-color').value
        var polygon = new fabric.Polygon(points,{
            stroke:'#333333',
            strokeWidth:0.5,
            fill: color,
            opacity: 1,
            label: 'polygon',
            hasBorders: false,
            hasControls: false
        });
        canvas.add(polygon);

        activeLine = null;
        activeShape = null;
        polygonMode = false;
        canvas.selection = true;
        window.document.getElementById('create-polygon').style.removeProperty('background-color');
    }
};

prototypefabric.text = {
    insertText : function(options) {
        var txt = window.prompt("Enter Text: ");
        var color = window.document.getElementById('text-color').value;
        var text = new fabric.Text(txt, {
            fill: color,
        });
        canvas.add(text);
        canvas.selection = false;
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
   
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('click', ()=>{
    // show navbar
    nav.classList.toggle('show')
    // change icon
    toggle.classList.toggle('bx-x')
    // add padding to body
    bodypd.classList.toggle('body-pd')
    // add padding to header
    headerpd.classList.toggle('body-pd')
    })
    }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink(){
    if(linkColor){
    linkColor.forEach(l=> l.classList.remove('active'))
    this.classList.add('active')
    }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    
     // Your code to run since DOM is loaded and ready
    });