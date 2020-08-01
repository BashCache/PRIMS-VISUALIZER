const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.height = 550; 
canvas.width = 550; 

canvas.addEventListener("click", getCoordinates, true);

let p = 0;
let x_coordinate = [], y_coordinate = [];
const radius = 25;
let dx = [-radius, radius, 0, 0], dy = [0,0,radius,-radius];
let graph = new Array(30);
let linex = new Array(30);
let liney = new Array(30);
for( var i=0; i<30; i++)
{   graph[i] = new Array(30);
    linex[i] = new Array(30);
    liney[i] = new Array(30);
}  
for(i=0;i<30;i++)
    for(j=0;j<30;j++)
    {   linex[i][j]=liney[i][j]=parseInt(0);
        graph[i][j]=parseInt(99999);
    }

function getCoordinates(event)
{
    var x = event.x;
    var y = event.y;
    console.log("X:"+x+"Y:"+y);
    ctx.font = "15px Arial";
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fillText(p,x-6,y+3);
    p = p + 1;
    ctx.stroke();
    x_coordinate.push(x);
    y_coordinate.push(y);
}

function remove()
{    
    canvas.removeEventListener("click", getCoordinates, true);
    flag = true;
    var i, opt;
    var newSel = document.getElementById("from_node");
    newSel.innerHTML = "<option value=\"\">Select</option>";
    for( i=0; i<p; i++ )
    {
        opt = document.createElement("option");
        opt.value = i;
        opt.text = i;
        newSel.appendChild(opt);
    }
    newSel = document.getElementById("to_node");
    newSel.innerHTML = "<option value=\"\"> Select </option>";
    for( i=0; i<p; i++ )
    {
        opt = document.createElement("option");
        opt.value = i;
        opt.text = i;
        newSel.appendChild(opt);
    }

    document.getElementById("cost").style.display = "inline";

}

function getValues() 
{
    const fromNodeinput = document.getElementById("from_node");               
    const fromNodeoutput = fromNodeinput.options[fromNodeinput.selectedIndex].value; 
    const toNodeinput = document.getElementById("to_node");               
    const toNodeoutput = toNodeinput.options[toNodeinput.selectedIndex].value; 
    const costInput = document.getElementById("cost");
    var costOutput = costInput.value; 
    if(!costOutput) costOutput = 10;
    if(fromNodeoutput == toNodeoutput)  alert("SELF LOOP NOT ALLOWED");
    else  connectEdges(fromNodeoutput, toNodeoutput, costOutput);
}

function connectEdges(fromNodeoutput, toNodeoutput, costOutput)
{
    console.log(fromNodeoutput, toNodeoutput, costOutput);

    const fromx = x_coordinate[fromNodeoutput], fromy = y_coordinate[fromNodeoutput];
    const tox = x_coordinate[toNodeoutput], toy = y_coordinate[toNodeoutput];

    ctx.font = "15px Arial";
    var font_start = (fromx +tox)/2 + 5;
    var font_end = (fromy + toy)/2 + 5;
    
    if(graph[fromNodeoutput][toNodeoutput]) {
        ctx.fillStyle = "white";
        ctx.fillText(graph[fromNodeoutput][toNodeoutput], font_start, font_end);
    }
    ctx.fillStyle = "black";
    ctx.fillText(costOutput, font_start, font_end );

    var mini = 99999999999, fx , fy, tx, ty;
    for(i=0;i<4;i++)
    {
        for(j=0;j<4;j++)
        {
            var dist = Math.pow((fromx + dx[i])- (tox + dx[j]),2) + Math.pow((fromy + dy[i])- (toy + dy[j]),2);
            if(dist<mini) {
                mini = dist;
                fx = fromx + dx[i];
                fy = fromy + dy[i];
                tx = tox + dx[j];
                ty = toy + dy[j];
            }
        }
    }

    linex[fromNodeoutput][toNodeoutput]=fx;
    linex[toNodeoutput][fromNodeoutput]=tx;
    liney[fromNodeoutput][toNodeoutput]=fy;
    liney[toNodeoutput][fromNodeoutput]=ty;


    if(graph[fromNodeoutput][toNodeoutput] == 99999) { 
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.lineWidth = "2";
        ctx.stroke();
    }
    graph[fromNodeoutput][toNodeoutput] = graph[toNodeoutput][fromNodeoutput] = costOutput;
    
    console.log(linex[fromNodeoutput][toNodeoutput], liney[fromNodeoutput][toNodeoutput]);
    console.log(linex[toNodeoutput][fromNodeoutput], liney[toNodeoutput][fromNodeoutput]);
}

let source;
let igx = 0;
let MST = new Array(p);
let SET2 = new Array(p);
function start()
{
    source = document.getElementById("start").value;
    if(source >= p) alert("Enter a valid starting node");
    console.log(source, typeof(source));
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(x_coordinate[source],y_coordinate[source],radius,0,2*Math.PI);
    ctx.stroke();

    SET2.push(source);
    for(i=0;i<p;i++)    MST[i]=false;
    
    func();
}
let lastTime, interval = 3000;

let min_dist = 999999;
let count = 0;
let prev;
let start_vertex, end_vertex;
// async function sleep(duration)
// {
//     try {
//         for(let timedelay = 0;timedelay<duration; timedelay++);
//         return;
//     } catch(error) {
//         throw(error);
//     }
// }

async function prims()
{
    try {
    source = parseInt(source);
    console.log(source);
    i = 0;
    // min_dist = 999999;
    // prev = source;
    // MST[source]=true;
    console.log(source,'source');
    i = parseInt(i);
    p = parseInt(p);
    min_dist = parseInt(min_dist);
    prev = parseInt(prev);
    start_vertex = parseInt(start_vertex);
    end_vertex = parseInt(end_vertex);

    for(i=0;i<p;i++)
    {
        color = "blue";
        thickness = "3";
        i = parseInt(i);
        if(graph[i][source]!=99999&&MST[i]==false)
            { drawstroke(i,source,prev,color,thickness);
              prev = i;
              graph[i][source] = parseInt(graph[i][source]);
              if(graph[i][source]<min_dist)  
              {
                    // console.log('newmin');
                    min_dist = graph[i][source];
                    start_vertex = source;
                    end_vertex = i;
              }   
            }
    }
    console.log('min_dist',min_dist,'start_vertex',start_vertex,'end_vertex',end_vertex);
    setTimeout(function()
    {   drawstroke(source,source,prev,color,thickness); 
        min_color(min_dist,start_vertex,end_vertex,'green','3',source,source,prev);
        func();
    },p*4000);
    // func();
    } catch(err) {
        throw(err);
    }
}


function min_color(min_dist,a,b,color,thickness,x1,x2,x3)
{
    // x1, x2, x3 ---> last line to turn black;

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = "3";
    ctx.moveTo(linex[x2][x3], liney[x2][x3]);
    ctx.lineTo(linex[x3][x2],liney[x3][x2]);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.moveTo(linex[x2][x3], liney[x2][x3]);
    ctx.lineTo(linex[x3][x2],liney[x3][x2]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(linex[a][b], liney[a][b]);
    ctx.lineTo(linex[b][a],liney[b][a]);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = "2";
    ctx.arc(x_coordinate[b],y_coordinate[b],radius,0,2*Math.PI);
    ctx.stroke();
    
    if(MST[b]==false) {
    MST[b]=true;
    SET2.push(b);
    }
    // func();

}

async function func()
{
    try {min_dist = 99999;
    p = parseInt(p);
    j= parseInt(j);

    console.log(typeof(min_dist));
    
    if(SET2.length<=p)
    {
        
        for(j=0;j<SET2.length;j++)
        {   source = SET2[j];
            prims();
        }
        console.log('prev',prev,'min_dist',min_dist);
    }
    else { 
        console.log('DONE'); 
        }
    } catch(err) {
        throw(err);
    }
}

async function drawstroke(a,b,c,color,thickness)
{
    try {
    // console.log('i',i);
    // setTimeout(function() {
    
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = "3";
    ctx.moveTo(linex[c][b], liney[c][b]);
    ctx.lineTo(linex[b][c],liney[b][c]);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.moveTo(linex[c][b], liney[c][b]);
    ctx.lineTo(linex[b][c],liney[b][c]);
    ctx.stroke();
    ctx.beginPath();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(linex[a][b], liney[a][b]);
    ctx.lineTo(linex[b][a],liney[b][a]);
    ctx.stroke();

    // },i*3000);
    }
    catch(err) {
        throw(err);
    }
    
    
}





// SET TIMEOUT - Return a value to the callback function
// https://stackoverflow.com/questions/5226285/settimeout-in-for-loop-does-not-print-consecutive-values