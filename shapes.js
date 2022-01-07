//npm install http-server -g
var shapes =[];
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startX = 0;
var startY = 0;
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;
var primaryColor ='#ddd';
var secondaryColor ='#222';
var selectedColor='#03cffc';

ctx.fillStyle = secondaryColor;
ctx.strokeStyle = primaryColor;
ctx.lineWidth = 3;
const pointSize=20;
let curvepoints=[];


//KLASA PUNKTU
class Point {
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.selected=false;
    this.size = pointSize;
    this.radius = 0.5 * this.size;
    this.pointX = Math.round(this.x - this.radius);
    this.pointY = Math.round(this.y - this.radius);
    this.point = new Path2D();
    this.point.rect(this.pointX, this.pointY , this.size, this.size);
  }
  create = function(ctx,color) {
    ctx.beginPath();
    this.radius = 0.5 * this.size;
    this.pointX = Math.round(this.x - this.radius);
    this.pointY = Math.round(this.y - this.radius);
    this.point = new Path2D();
    this.point.rect(this.pointX, this.pointY , this.size, this.size);
      ctx.fill(this.point);
    ctx.stroke();
  }
}

//KRZYWA BEZIERA - WYLICZANIE
//silnia
function factorial(n) {
  if(n<0)    
      return(-1);    
  if(n==0)    
      return(1);    
  else    
  {    
      return(n*factorial(n-1));        
  }
}

function nCr(n,r) {
  return( factorial(n) / ( factorial(r) * factorial(n-r) ) );
}


function BezierCurve(points) {
  curvepoints=[];
  //stopień
  let n=points.length;
  for(let u=0; u <= 1 ; u += 0.001
     ){

      let p={x:0,y:0};

      for(let i=0 ; i<n ; i++){
          let B=nCr(n-1,i)*Math.pow((1-u),(n-1)-i)*Math.pow(u,i);
          let px=points[i].x*B;
          let py=points[i].y*B;
          
          p.x+=px;
          p.y+=py;
      }

      curvepoints.push(p);
  }
  DrawPoints(curvepoints)
  // console.log(curvepoints)

  // return curvepoints;
}
function DrawPoints(points){
  
  
  points.forEach(p=>
  {
    ctx.strokeRect(p.x, p.y,0.1,0.1); 
  }
  );
}

//PODSTAWOWE POLECENIA
function clearCanva(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.onmousedown = ()=>{} 
  canvas.onmouseup = ()=>{} 
}
function deleteCanva(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes=[];
  canvas.onmousedown = ()=>{} 
  canvas.onmouseup = ()=>{} 
  canvas.onmousemove = ()=>{} 
}
//rysowanie krzywej od początku
function drawAllShapes(){
  clearCanva();
  shapes.forEach((shape) =>{
     shape.create(ctx);
     console.log(shape);
    });
    BezierCurve(shapes);

}


//TWORZENIE KSZTAŁTU Z AUTOMATYCZNYM TWORZENIEM KRZYWEJ
function drawCurve() {
  console.log(shapes.length)
 
  var shape=null;
  let X,Y;
  canvas.onmousemove = ()=>{} 
  canvas.onmousedown = function (ev) {
    X = ev.pageX - offsetX;
    Y = ev.pageY - offsetY;
    console.log(X,Y);

  };
  canvas.onmouseup = function (ev) {
    shape=new Point(X,Y);
        shapes.push(shape);
        shape.create(ctx);
        delete shape;
        if(shapes.length>=2) 
        {
          drawAllShapes();
          drawCurve();
        }
  };

 
}

//TWORZENIE KSZTAŁTU
function draw () {
  var shape=null;
  let X,Y;
  canvas.onmousemove = ()=>{} 
  canvas.onmousedown = function (ev) {
    X = ev.pageX - offsetX;
    Y = ev.pageY - offsetY;
    console.log(X,Y);

  };
  canvas.onmouseup = function (ev) {
    shape=new Point(X,Y);
        shapes.push(shape);
        shape.create(ctx);
    delete shape;
};
}

//WYKRYCIE ZETKNIĘCIA PUNKTU
function isHit(shape, x, y) {
  if (shape.constructor.name === 'Point') 
  {
    if(ctx.isPointInPath(shape.point, x, y))
      {
        console.log(shape.constructor.name);
        return true;
      
      }
  }
  return false;
}
//PRZESUWANIE PUNKTU
const mouseDrag = function()
  {
  
    //SPRAWDZENIE OBIEKTU
    canvas.onmousedown = function (evt) {
      startX = evt.pageX - offsetX;
      startY = evt.pageY - offsetY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape =>{
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (isHit(shape, startX, startY)) 
        {
            shape.selected = true;
            ctx.fillStyle = selectedColor;
        }
        else{
          ctx.fillStyle = secondaryColor;
        }
        shape.create(ctx);
      });
      BezierCurve(shapes);

    }


    canvas.onmousemove = function (evt){
      x = evt.pageX - offsetX;
      y = evt.pageY - offsetY;
      var dx = x - startX;
      var dy = y - startY;
      startX = x;
      startY = y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(shape =>{
        if(shape.selected) {
        shape.x += dx;
        shape.y += dy;
        ctx.fillStyle = selectedColor;
      }
      else{
        ctx.fillStyle = secondaryColor;
      }
      shape.create(ctx);
    });
    BezierCurve(shapes);
    }
    //reset wszystkich wartości na FALSE
    canvas.onmouseup = function (evt) {
      shapes.forEach(shape =>{
        shape.selected=false;
        shape.create(ctx);
      });
      ctx.fillStyle = secondaryColor;

      BezierCurve(shapes);

      }
  }


  //formularz...
  const movePointForm = document.querySelectorAll('form')[0];
  movePointForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var data = new FormData(movePointForm);

    let x_pos = parseInt(data.get("x"));
    let y_pos = parseInt(data.get("y"));

  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    shapes.forEach(shape =>{
      if(shape.selected) 
      {
        shape.x = x_pos;
        shape.y = y_pos;
        shape.selected = false;
        ctx.fillStyle = secondaryColor;
      }
      ctx.strokeStyle=primaryColor;
      shape.create(ctx);
    }
    );
    BezierCurve(shapes);
  }
  );

  //formularz...
  const createPointForm = document.querySelectorAll('form')[1];
  createPointForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var data = new FormData(createPointForm);

    let x_pos = parseInt(data.get("x"));
    let y_pos = parseInt(data.get("y"));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape=new Point(x_pos,y_pos);
        shapes.push(shape);
        shape.create(ctx);
    delete shape;

    shapes.forEach(shape =>{
      shape.create(ctx);
    }
    );
    if(shapes.length>1)
    BezierCurve(shapes);
  }
  );

  var selectPoint =function(){
    canvas.onmouseup={};
    canvas.onmousemove={};
    canvas.onmousedown={};

    canvas.onmousedown = function (evt) {
        
      startX = evt.pageX - offsetX;
      startY = evt.pageY - offsetY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      shapes.forEach(shape =>{
        if (isHit(shape, startX, startY)) 
        {
          ctx.fillStyle = selectedColor;
          shape.selected = true;
          shape.create(ctx);
        }
        else{
          shape.selected = false;
          ctx.fillStyle = secondaryColor;
          shape.create(ctx);
        }
      });  
      BezierCurve(shapes);
    }

  }

//WCZYTYWANIE PLIKÓW I POBIERANIE
function download( ) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
  } else {alert('File Api nie jest wspierany przez tą przeglądarke'); }
 
  var a = document.createElement("a");
  var jsonShapes= shapes;
  jsonShapes.forEach(shape =>{
    shape.type = shape.constructor.name;
  })

  var file = new Blob([JSON.stringify(jsonShapes)], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = 'shapes.json';
  a.click();
}

var rawFile;
function readFile(e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) 
    { 
      rawFile=evt.target.result;
    }
  };
  console.log(file.size);
  reader.readAsText(file);
  accessFileContents();
}

document.getElementById('file').addEventListener('change', readFile, false);
var fileLoadTime = 1000;

function accessFileContents(){
  setTimeout(function(){
    console.log(rawFile);
    jsonFile= JSON.parse(rawFile);
    shapes =[];
    jsonFile.forEach(e=>{
      shapes.push(new Point(e.x,e.y));
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();
  }, fileLoadTime);
}