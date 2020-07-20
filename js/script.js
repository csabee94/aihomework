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
let selected = "0";
let selectedColor = ["#007bff","#28a745","#dc3545","#ffc107"];
let selectedImg = "images/1.jpg";

let jsonObj = [];
let actJsonObj = [];

$(document).ready(function () {   
    ctx.canvas.width = $('#editor').width();
    ctx.canvas.height = $('#editor').height();
    clearScreen();
    // Load from JSON
    loadSelections();
    
});

$('.box').click(function() {
    $('.full-image').html($(this).html());
    selectedImg = $("img", this).attr("src");
    clearScreen();
    drawSelections(jsonObj);
    deleteNewSelections();
});

$('.btn-group').click(function() {
    console.log(this);
});

$('#save').click(function() {
    save();
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
    
    let actObj = {
        imageName: selectedImg,
        category: selected,
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    }
    drawSelections(jsonObj);
    addToActJsonObj(actObj);
    drawSelections(actJsonObj);
});

// Mousemove
$(canvas).on('mousemove', function(e) {
    mouseX = parseInt(e.clientX-canvasX);
	mouseY = parseInt(e.clientY-canvasY);
    width = mouseX-x2;
    height = mouseY-y2;
    
    if(pressed) {
        clearScreen();
        drawRectangel(x2, y2, width, height, selectedColor[selected]);
    }
});

function getCategoryValue() {
    selected = $('#category').val();
}

function loadSelections() {
    $.getJSON('https://csabee94.github.io/projects/datas.json',
    function(data) {
        $(data).each(function(key, value) {
            jsonObj.push(data[key]);
            drawSelections(jsonObj);
        });
    });   
}

function addToActJsonObj(obj){
    actJsonObj.push(obj);
}

function clearScreen() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawSelections(obj) {
    $(obj).each(function(key, value) {
        if(selectedImg === obj[key].imageName){
            x1 = obj[key].x1;
            y1 = obj[key].y1;
            width = parseInt(obj[key].x2 - obj[key].x1);
            height = parseInt(obj[key].y2 - obj[key].y1);
            let color = selectedColor[parseInt(obj[key].category)];
            drawRectangel(x1, y1, width, height, color);
        }
    });
}

// Draw rectangle
function drawRectangel(x, y, w, h, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.strokeRect(x,y,w,h);
}

function save() {
    $(actJsonObj).each(function(key, value) {
        jsonObj.push(actJsonObj[key]);
    });
    deleteNewSelections();
    console.log(jsonObj);
}

function deleteNewSelections() {
    actJsonObj = [];
}