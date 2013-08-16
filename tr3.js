/**
 * tr3 object constructor. Constructor arguments are:
 * - (required) id of the canvas on which rendering will be performed
 */
function tr3(canvasid)
{
	this.canvas = document.getElementById(canvasid);
	this.w = this.canvas.width;
	this.h = this.canvas.height;
	this.context = this.canvas.getContext('2d');
}

/**
 * Clears the contents of the tr3 canvas.
 */
tr3.prototype.clear = function(back)
{
	this.canvas.width = this.canvas.width;
	if (document.getElementById(back)) {
		this.context.drawImage(document.getElementById(back), 0, 0, this.w, this.h);	
	} else {
		this.context.fillStyle = back;
		this.context.fillRect(0, 0, this.w, this.h);
	}
};

/**
 * Render a random tree-like structure. Arguments:
 * - (required) rendering method that should be used
 * - (optional) color of the background
 * - (optional) color of the foreground
 * - (optional) x-coordinate of the tree root
 * - (optional) y-coordinate of the tree root
 * - (optional) angle of the tree growth
 */
tr3.prototype.render = function(renderer,back,front,startx,starty,angle)
{
	var w = this.w;
	var h = this.h;

	back = back ? back : "#FFFFFF";
	front = front ? front : "#000000";
	startx = startx ? startx : w/2;
	starty = starty ? starty : 0.95 * h;
	angle = angle ? angle : 0;

	this.clear(back);
	
	var context = this.context;

	context.strokeStyle = front;
	context.lineWidth = 1;

	switch (renderer)
	{
		case 0:
			this.SIMPLE(1, context, startx, starty);
			break;
		case 1:
			this.SKETCH(1, context, startx, starty);
			break;
		default:
			break;
	}
};

tr3.prototype.sign = function()
{
	return Math.random() < 0.5 ? -1 : 1;
};

/**
 * Simple tree rendering
 */
tr3.prototype.SIMPLE = function(level,context,fromx,fromy,tox,toy,w,h)
{
    if (level === 1) {
    	tox = fromx;
		h = (fromy - 10) / (Math.random() + 3);
		toy = fromy - h;
		w = 80;
    }

    context.lineWidth = (7 - level) > 0 ? (7 - level) : 1;

    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();

    if (level === 7) {
    	return;
    }

    h = h / 2;

    var branches = 2 + Math.random() * 2;
    for (var i = 0; i < branches; ++i) {
    	this.SIMPLE(level + 1, context, tox, toy, tox + this.sign() * Math.random() * w, toy - h + this.sign() * Math.random() * h, w, h);	
    }
};

/**
 * Sketchy rendering
 */
tr3.prototype.SKETCH =  function(level,context,fromx,fromy,tox,toy,w,h)
{
    if (level === 1) {
    	tox = fromx;
		h = (fromy - 10) / (Math.random() + 3);
		toy = fromy - h;
		w = 80;
    }

    context.lineWidth = (7 - level) > 0 ? (7 - level) : 1;

    context.beginPath();
    context.moveTo(fromx, fromy);
    context.bezierCurveTo(tox + this.sign() * Math.random() * w, toy + this.sign() * Math.random() * h, tox + this.sign() * Math.random() * w, toy + this.sign() * Math.random() * h, tox, toy);
    context.stroke();

    if (level === 6) {
    	return;
    }

    h = h / 2;
   	var branches = 2 + Math.random() * 2;
    for (var i = 0; i < branches; ++i) {
    	this.SKETCH(level + 1, context, tox, toy, tox + this.sign() * Math.random() * w, toy - h + this.sign() * Math.random() * h, w, h);	
    }
};
