var canvasDiv = document.getElementById('canvasDiv');
var widthScroll = document.getElementById('strokeSlider');
canvas = document.createElement('canvas');
canvas.setAttribute('width', '280px');
canvas.setAttribute('height', '280px');
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas)
canvas.style.backgroundColor  = "#000";

const label = document.getElementById("lfs");
widthScroll.onchange = function() { 
    redraw()
    label.innerHTML = widthScroll.value
 };


if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

$('#canvas').mousedown(function(e){
    var mouseX = e.pageX - $('#canvas').offset().left;
    var mouseY = e.pageY - $('#canvas').offset().top;
    paint = true;
    addClick(mouseX, mouseY);
    redraw();
    });

$('#canvas').mousemove(function(e){
    if(paint){
        addClick(e.pageX - $('#canvas').offset().left, e.pageY - $('#canvas').offset().top, true);
        redraw();
    }
    });

$('#canvas').mouseup(function(e){
    paint = false;
    });

$('#canvas').mouseleave(function(e){
    paint = false;
    });

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#fff";
    context.lineJoin = "round";
    context.lineWidth = widthScroll.value;
                
    for(var i=0; i < clickX.length; i++) {		
        context.beginPath();
        if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}

var button = document.getElementById('btn');
var clear = document.getElementById('clear');
button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png')
    jd = {'url':dataURL}
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/predict",
        data: JSON.stringify(jd),
        dataType: 'json'
    }).done(function (data){
        console.log(data);
        document.getElementById("output").innerHTML = data;
        var ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, 280, 280);
        clickX.length = 0;
        clickDrag.length = 0;
        clickY.length = 0;
        paint = false;
    })
});
clear.addEventListener('click', function (e) {
    var ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, 280, 280);
    clickX.length = 0;
    clickDrag.length = 0;
    clickY.length = 0;
    paint = false;
})
