// Evolution of images
// Author: Sergey Zolotykh
//------------------------------------------------------------------------------------------


var generation = 0;
var goalGeneration=0;
var populationSize = 100;
var updating = false;
var aveSimilarity=0;

function createEmptyIndividual(){
	return $("<canvas class='individuals' width='100' height='100' sim='0'></canvas>")
	.click(function(){
		if($(this).attr("class")=="individuals")
			$(this).toggleClass("individuals individuals-selected");
		else
			$(this).toggleClass("individuals-selected individuals");
	}).appendTo("#field")[0];
}

function createInitialPopulation(){
	for(var i=0; i<populationSize; i++){
		var indConvas = createEmptyIndividual();
		var ctx = indConvas.getContext('2d');
		var color = Math.floor((Math.random()*255));
		ctx.fillStyle="rgb("+color+", "+color+", "+color+")";
		ctx.fillRect(0, 0, 100,100);
	}
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
	return 255-totalDifference/10000;
}

function drawRandomRactangle(ctx, maxSize){
	var w = Math.floor((Math.random()*maxSize)+1);
	var h = Math.floor((Math.random()*maxSize)+1);
			
	var x = Math.floor((Math.random()*(100-w)));
	var y = Math.floor((Math.random()*(100-h)));
				
	var color = Math.floor((Math.random()*255));
	ctx.fillStyle="rgb("+color+", "+color+", "+color+")";
	ctx.fillRect(x, y, w, h);
}

function NextGeneration(){
	var selectedIndividuals = $(".individuals-selected");
	
	if(selectedIndividuals.length<1)
		return;
	// Remove all none selected members of current population
	$(".individuals").remove();
	
	aveSimilarity = 0;
	var reference = $('#cReference')[0];
	selectedIndividuals.each(function(index, element){
		for(var i=0; i<2; i++){
			var w = Math.floor((Math.random()*100)+1);
			var h = Math.floor((Math.random()*100)+1);
				
			var x = Math.floor((Math.random()*(100-w)));
			var y = Math.floor((Math.random()*(100-h)));
				
			var ctxParent = element.getContext('2d');
			var imgData=ctxParent.getImageData(x, y, w, h);
			
			var indexParent2 = Math.floor((Math.random()*selectedIndividuals.length));
				
			// Copy parent 2 to child1
			var child = createEmptyIndividual();
			var ctxChild = child.getContext('2d');
			ctxChild.drawImage(selectedIndividuals[indexParent2], 0, 0);
				
			ctxChild.putImageData(imgData, x, y);
			var sim = compareCanvas(child, reference);
			$(child).attr("sim", sim);
			aveSimilarity += sim;
		}
	})
	aveSimilarity = aveSimilarity/selectedIndividuals.length;
	
	// Remove all previously selected individuals
	$(".individuals-selected").remove();
	
	// Mutations
	$(".individuals").each(function(index, element){
		// Rectangle mutations
		// Large
		var size = (aveSimilarity<400)?40:10;
		if(Math.floor((Math.random()*10))==1){
			drawRandomRactangle(element.getContext('2d'), size);
		}
		// Medium
		if(Math.floor((Math.random()*3))==1){
			drawRandomRactangle(element.getContext('2d'), 5);
		}
		// Small
		if(Math.floor((Math.random()*2))==1){
			drawRandomRactangle(element.getContext('2d'), 3);
		}
	});
	
	generation++;
	$("#tGeneration").html("Generation: "+generation);
	$("#tSimilarity").html("Average similarity: "+aveSimilarity);
}

// Select the best individuals from population
function SelectBest(){
	$(".individuals-selected").toggleClass("individuals-selected individuals");
	var elements = $(".individuals");
	
	var list = new PriorityQueue();
	elements.each(function(index, element){
		var sim = $(element).attr("sim");
		list.push(index, 255-sim);
	});
	for(var i=0; i<elements.length/2; i++){
		elements.eq(list.pop()).toggleClass("individuals individuals-selected");
	}
}
// Select random individuals from population
function SelectSome(){
	$(".individuals-selected").toggleClass("individuals-selected individuals");
	$(".individuals").each(function(index, element){
		if(Math.floor((Math.random()*2))==1)
			$(element).toggleClass("individuals individuals-selected");
	});
}
// Select all individuals from population
function SelectAll(){
	$(".individuals").toggleClass("individuals individuals-selected");
}

// Create new population
function NewPopulation(){
	// Remove previous population
	$(".individuals").remove();
	// Create initial population
	createInitialPopulation();
	// Update population variables
	generation = 0;
	aveSimilarity = 0;
	// Update display information about population
	$("#tGeneration").html("Generation: "+generation);
	$("#tSimilarity").html("Average similarity: "+aveSimilarity);
}
// Create new generation of individuals
function CreateGeneration(){
	SelectBest();
	NextGeneration();
}


$( document ).ready(function() {
	// Generation animation
	var genPeriod = 10;
	var genInterval;
	
	// Load reference image
	var imgReference = new Image();
	imgReference.onload = function() {
		// Reference canvas
		var ctxReference = $('#cReference')[0].getContext('2d');
        ctxReference.drawImage(imgReference, 0, 0);
	};
	imgReference.src = "img/1.png";
	//imgReference.src = "img/2.png";
	//imgReference.src = "img/3.png";
	//imgReference.src = "img/4.png";
	
	// Create initial population
	createInitialPopulation();
	
	// Create new empty generation
	$("#bNewPopulation").click(NewPopulation);
	// Create next generation
	$("#bNextGeneration").click(NextGeneration);
	// Select All
	$("#bSelectAll").click(SelectAll);
	// Select Some
	$("#bSelectSome").click(SelectSome);
	// Select best
	$("#bSelectBest").click(SelectBest);
	
	// Start evolution process
	$("#bStart").click(function(){
		genInterval = setInterval(CreateGeneration, genPeriod);
	});
	//Stop evolution process
	$("#bStop").click(function(){
		window.clearInterval(genInterval);
	});
});