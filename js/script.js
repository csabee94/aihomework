"use strict";

//Variables
let canvas = document.getElementById('worksheet');
let ctx = canvas.getContext('2d');
let canvasX = $(canvas).offset().left;
let canvasY = $(canvas).offset().top;
let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let mouseX = 0;
let mouseY = 0;
let width = 0;
let height = 0;
let pressed = false;
let selected = 0;
let selectedColor = ["#007bff","#28a745","#dc3545","#ffc107"];
let selectedImg = "images/1.jpg";

let jsonObj = [];

$(document).ready(function () {
    
    setImageTitle(selectedImg);
    
    ctx.canvas.width = $('#editor').width();
    ctx.canvas.height = $('#editor').height();
    
    // Load from JSON
    loadSelections();
    
});

$('.box').click(function() {
    $('.full-image').html($(this).html());
    selectedImg = $("img", this).attr("src");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    loadSelections();
    setImageTitle(selectedImg);
});

$('#save').click(function() {
    //save(JSON.stringify(jsonObj), "datas2.txt");
    save(JSON.stringify(jsonObj));
});

$('#category').change(function() {
    getCategoryValue();
})


// Mousedown
$(canvas).on('mousedown', function(e) {
    x1 = parseInt(e.clientX-canvasX);
	y1 = parseInt(e.clientY-canvasY);
    x2 = parseInt(e.clientX-canvasX);
	y2 = parseInt(e.clientY-canvasY);
    pressed = true;
});

// Mouseup
$(canvas).on('mouseup', function(e) {
    x2 = parseInt(e.clientX-canvasX);
    y2 = parseInt(e.clientY-canvasY);
    pressed = false;
    loadSelections();
});

// Mousemove
$(canvas).on('mousemove', function(e) {
    mouseX = parseInt(e.clientX-canvasX);
	mouseY = parseInt(e.clientY-canvasY);
    width = mouseX-x2;
    height = mouseY-y2;
    
    if(pressed) {
        ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
        drawRectangel(x2, y2, width, height, selectedColor[selected]);
    }
    
    //Output
    /*$('#img-title').html('X: ' + mouseX +
                        ' Y: ' + mouseY + "<br>" + 
                        'X1: ' + x1 +
                        ' Y1: ' + y1  + "<br>" + 
                        'X2: ' + x2 + 
                        ' Y2: ' + y2 + "<br>" + 
                        'Width: ' + width +
                        ' Height: ' + height);*/
});

function setImageTitle(name) {
    $('#img-title').html(name);
}

function getCategoryValue() {
    selected = $('#category').val();
}

function loadSelections() {
    jsonObj = [];
    $.getJSON('datas.json',
    function(data) {
        $(data).each(function(key, value) {
            jsonObj.push(data[key]);
            if(selectedImg === data[key].imageName){
                x1 = data[key].x1;
                y1 = data[key].y1;
                width = parseInt(data[key].x2 - data[key].x1);
                height = parseInt(data[key].y2 - data[key].y1);
                let color = selectedColor[parseInt(data[key].category)];
                drawRectangel(x1, y1, width, height, color);
            }
        });
        //$('#img-title').html(JSON.stringify(jsonObj));
        console.log(JSON.stringify(jsonObj));
    });
}

// Draw rectangle
function drawRectangel(x, y, w, h, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.strokeRect(x,y,w,h);
}

function save(object) {
    var blob = new Blob(object,
                { type: "text/plain;charset=utf-8" });
            saveAs(blob, "static.txt");
}