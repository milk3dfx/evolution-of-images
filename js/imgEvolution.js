
var generation = 0;
var goalGeneration=0;
var populationSize = 100;
var updating = false;
var maxId=0;
var aveSimilarity=0;
var gSim=[];

function createEmptyIndCanvas(){
	var indConvas = $("<canvas class='individuals' class width='100' height='100'></canvas>");
	indConvas.attr("id", "individual-"+maxId);
	maxId++;
	indConvas.click(function(){
		if($(this).attr("class")=="individuals")
			$(this).toggleClass("individuals individuals-selected");
		else
			$(this).toggleClass("individuals-selected individuals");
	});
	$("#field").append(indConvas);
	return indConvas[0];
}

function compareCanvas(el1, el2){
	var ctx1 = el1.getContext("2d");
	var ctx2 = el2.getContext("2d");
	var d1 = ctx1.getImageData(0, 0, 100, 100);
	var d2 = ctx2.getImageData(0, 0, 100, 100);
	var len = d1.data.length;
	var maxDifference = 2500000;
	var totalDifference=0;
	
	
	for(var i = 0; i<len; i+=4) {
		totalDifference = totalDifference + Math.abs(d1.data[i]-d2.data[i]);
	}
	
	//return (maxDifference - totalDifference)/maxDifference;
	return 255-totalDifference/10000;
}

// Priority Queue
function PriorityQueue(){
	this.list = new Array()
	this.push = function(el, priority){
		this.list.push([el, priority]);
	}
	this.pop = function(){
		if(this.list.length == 0)
			return null;
		var minPriority = this.list[0][1];
		var minIndex = 0;
		for(var i = 1; i < this.list.length; i++){
			if(this.list[i][1] < minPriority){
				minPriority = this.list[i][1];
				minIndex = i;
			}
		}
		var minValue = this.list[minIndex][0];
		this.list.splice(minIndex, 1);
		return minValue;
	}
	return this;
}

function NextGeneration(){
	var numSelected = $(".individuals-selected").length;
	
	if(numSelected<1)
		return;
	// Remove all none selected members of current population
	$(".individuals").remove();
	
	$(".individuals-selected").each(function(index, element){
		for(var i=0; i<2; i++){
			var w = Math.floor((Math.random()*100)+1);
			var h = Math.floor((Math.random()*100)+1);
				
			var x = Math.floor((Math.random()*(100-w)));
			var y = Math.floor((Math.random()*(100-h)));
				
			var ctxParent = element.getContext('2d');
			var imgData=ctxParent.getImageData(x, y, w, h);
			
			var indexParent2 = Math.floor((Math.random()*numSelected));
			//var ctxParent2 = $(".individuals-selected")[indexParent2].getContext('2d');
				
			// Copy parent 2 to child1
			var child1 = createEmptyIndCanvas();
			var ctxChild1 = child1.getContext('2d');
			ctxChild1.drawImage($(".individuals-selected")[indexParent2], 0, 0);
				
			ctxChild1.putImageData(imgData, x, y);
		}
	})
	$(".individuals-selected").remove();
	// Mutations
	$(".individuals").each(function(index, element){
		// Rectangle
		if(Math.floor((Math.random()*10))==1){
			var ctxInd = element.getContext('2d');
			var w = Math.floor((Math.random()*50)+1);
			var h = Math.floor((Math.random()*50)+1);
			
			var x = Math.floor((Math.random()*(100-w)));
			var y = Math.floor((Math.random()*(100-h)));
				
			var color = Math.floor((Math.random()*255));
			ctxInd.fillStyle="rgb("+color+", "+color+", "+color+")";
			ctxInd.fillRect(x, y, w, h);
		}
		if(Math.floor((Math.random()*3))==1){
			var num = Math.floor((Math.random()*2))+1;
			for(var i = 0; i<num; i++){
				var ctxInd = element.getContext('2d');
				var w = Math.floor((Math.random()*5)+1);
				var h = Math.floor((Math.random()*5)+1);
				
				var x = Math.floor((Math.random()*(100-w)));
				var y = Math.floor((Math.random()*(100-h)));
					
				var color = Math.floor((Math.random()*255));
				ctxInd.fillStyle="rgb("+color+", "+color+", "+color+")";
				ctxInd.fillRect(x, y, w, h);			
			}
		}
		
		if(Math.floor((Math.random()*2))==1){
			var ctxInd = element.getContext('2d');
			var w = Math.floor((Math.random()*3)+1);
			var h = Math.floor((Math.random()*3)+1);
			
			var x = Math.floor((Math.random()*(100-w)));
			var y = Math.floor((Math.random()*(100-h)));
				
			var color = Math.floor((Math.random()*255));
			ctxInd.fillStyle="rgb("+color+", "+color+", "+color+")";
			ctxInd.fillRect(x, y, w, h);
		}

		// Line
		/*
		if(Math.floor((Math.random()*3))==1){
			var ctxInd = element.getContext('2d');
			var x1 = Math.floor((Math.random()*100));
			var y1 = Math.floor((Math.random()*100));
				
			var x2 = Math.floor((Math.random()*100));
			var y2 = Math.floor((Math.random()*100));
				
				
			ctxInd.lineWidth = Math.floor((Math.random()*10))+1;
			var color = Math.floor((Math.random()*255));
			ctxInd.strokeStyle = "rgb("+color+", "+color+", "+color+")";
			ctxInd.beginPath();
			ctxInd.moveTo(x1,y1);
			ctxInd.lineTo(x2,y2);
			ctxInd.closePath();
			ctxInd.stroke();
		}*/
	});
	generation++;
	$("#tGeneration").html("Generation: "+generation);
	//console.log(generation+" : "+aveSim);
	$("#tSimilarity").html(aveSimilarity);
}

function SelectBest(){
	$(".individuals-selected").toggleClass("individuals-selected individuals");
	//var ctxReference = $('#cReference')[0].getContext('2d');
	var elements = $(".individuals");
		
	aveSimilarity = 0;
	var list = new PriorityQueue();
	for(var i=0; i<elements.length; i++){
		var sim = compareCanvas(elements[i], $('#cReference')[0]);
		aveSimilarity += sim;
		list.push(i, 1-sim);
	}
	aveSimilarity = aveSimilarity/elements.length;
	for(var i=0; i<elements.length/2; i++){
		elements.eq(list.pop()).toggleClass("individuals individuals-selected");
	}
	gSim.push(aveSimilarity);
}

$( document ).ready(function() {
	// Reference canvas
	var cReference = $('#cReference')[0];
	var ctxReference = cReference.getContext('2d');
	var imgReference = new Image();
	imgReference.onload = function() {
        ctxReference.drawImage(imgReference, 0, 0);
	};
	imgReference.crossOrigin = '';
	imgReference.src = "img/1.png";
	//imgReference.src = "img/2.png";
	//imgReference.src = "img/3.png";
	//imgReference.src = "img/4.png";
	
	
	for(var i=0; i<populationSize; i++){
		createEmptyIndCanvas();
	}
	$(".individuals").each(function(index, element){
		var ctx = element.getContext('2d');
		var color = Math.floor((Math.random()*255));
		ctx.fillStyle="rgb("+color+", "+color+", "+color+")";
		ctx.fillRect(0, 0, 100,100);
	})
	
	
	$("#bNewPopulation").click(function(){
		$(".individuals").each(function(index, element){
			var ctx = element.getContext('2d');
			var color = Math.floor((Math.random()*255));
			ctx.fillStyle="rgb("+color+", "+color+", "+color+")";
			ctx.fillRect(0, 0, 100,100);
		})
	});
	
	$("#bNextGeneration").click(function(){
		NextGeneration();
	});
	// Select All
	$("#bSelectAll").click(function(){
		$(".individuals").toggleClass("individuals individuals-selected");
	});
	// Select Some
	$("#bSelectSome").click(function(){
		$(".individuals-selected").toggleClass("individuals-selected individuals");
		$(".individuals").each(function(index, element){
			if(Math.floor((Math.random()*2))==1)
				$(element).toggleClass("individuals individuals-selected");
		});
	});
	// Select best
	$("#bSelectBest").click(function(){
		SelectBest();
		$("#bNextGeneration").trigger("click");
	});
	$("#bResults").click(function(){
		var str = "";
		for(var i=0; i<gSim.length; i++){
			str += (gSim[i]+"<br>");
		}
		$("#results").html(str);
	});
	
	function genterateGeneration(){
			SelectBest();
			NextGeneration();
			if(updating)
				setTimeout(genterateGeneration,10);
	}
	$("#bStart").click(function(){
		updating = true;
		setTimeout(genterateGeneration,10);
	});
	$("#bStop").click(function(){
		updating = false;
	});
});