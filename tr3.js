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
 * - (required) tree preset to be used
 * - (required) rendering method that should be used
 * - (optional) color of the background
 * - (optional) color of the foreground
 * - (optional) x-coordinate of the tree root
 * - (optional) y-coordinate of the tree root
 */
tr3.prototype.render = function(tree,renderer,back,front,startx,starty)
{
    var w = this.w;
    var h = this.h;

    back = back ? back : "#FFFFFF";
    front = front ? front : "#000000";
    startx = startx ? startx : w/2;
    starty = starty ? starty : 0.95 * h;

    this.clear(back);
    
    var context = this.context;

    context.strokeStyle = front;
    context.lineCap = 'round';

    // invoke the tree preset function
    this[tree](renderer, 1, startx, starty);
};

tr3.prototype.sign = function()
{
    return Math.random() < 0.5 ? -1 : 1;
};

/**
 * Sketchy rendering
 */
tr3.prototype.SKETCH = function(level,fromx,fromy,tox,toy,w,h)
{
    this.context.beginPath();
    this.context.moveTo(fromx, fromy);
    this.context.bezierCurveTo(tox + this.sign() * Math.random() * w, toy + this.sign() * Math.random() * h, tox + this.sign() * Math.random() * w, toy + this.sign() * Math.random() * h, tox, toy);
    this.context.stroke();
};

/**
 * Simple line rendering
 */
tr3.prototype.LINE = function(level,fromx,fromy,tox,toy,w,h)
{
    this.context.beginPath();
    this.context.moveTo(fromx, fromy);
    this.context.lineTo(tox, toy);
    this.context.stroke();
};

/**
 * SAVANNAH1 tree structure preset
 */
tr3.prototype.TREE_SAVANNAH1 = function(renderer,level,fromx,fromy,tox,toy,w,h)
{
    if (level === 1) {
        tox = fromx;
        h = (fromy - 10) / (Math.random() + 3);
        toy = fromy - h;
        w = 80;
    }

    this.context.lineWidth = (7 - level) > 0 ? (7 - level) : 1;
    this[renderer](level, fromx, fromy, tox, toy, w, h);

    if (level === 6) {
        return;
    }

    h = h / 2;
    var branches = 2 + Math.random() * 2;
    for (var i = 0; i < branches; ++i) {
        this.TREE_SAVANNAH1(renderer, level + 1, tox, toy, tox + this.sign() * Math.random() * w, toy - h + this.sign() * Math.random() * h, w, h);   
    }
};

/**
 * SAVANNAH2 tree structure preset
 */
tr3.prototype.TREE_SAVANNAH2 = function(renderer,level,fromx,fromy,tox,toy,w,h)
{
    if (level === 1) {
        tox = fromx;
        h = (fromy - 10) / (Math.random() + 3);
        toy = fromy - h;
        w = 80;
    }

    tox = tox + this.sign() * Math.random() * w;
    toy = toy + this.sign() * Math.random() * h/2;

    var lineWidth = 25;
    for (var i = 0; i < level; i++) {
        lineWidth /= 1.9;
    }
    this.context.lineWidth = lineWidth;

    this[renderer](level, fromx, fromy, tox, toy, w, h);

    if (level === 6) {
        return;
    }

    h = h / 2;
    for (var i = 0; i < 1 + Math.random() * 10; ++i) {
        this.TREE_SAVANNAH2(renderer, level + 1, tox, toy, tox + this.sign() * Math.random() * w, toy - h + this.sign() * Math.random() * h, w * 0.9, h * 0.9);
    }
};
