// Priority Queue
// Anchor: Sergey Zolotykh
//------------------------------------------------------------------------
function PriorityQueue(){
	this.list = new Array()
	// Push method
	this.push = function(el, priority){
		this.list.push([el, priority]);
	}
	// Pop method
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