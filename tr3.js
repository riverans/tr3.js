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
tr3.prototype.render = function(tree,back,front,startx,starty)
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
    this[tree](1, startx, starty);
};

/**
 * Signed random from -1 to 1
 */
tr3.prototype.random = function()
{
    return (Math.random() < 0.5 ? -1 : 1) * Math.random();
};

/**
 * Sketchy rendering
 */
tr3.prototype.sketch = function(level,fromx,fromy,tox,toy,w,h)
{
    this.context.beginPath();
    this.context.moveTo(fromx, fromy);
    this.context.bezierCurveTo(tox + this.random() * w, toy + this.random() * h, tox + this.random() * w, toy + this.random() * h, tox, toy);
    this.context.stroke();
};

/**
 * SAVANNAH1 tree structure preset
 */
tr3.prototype.TREE_SAVANNAH1 = function(level,fromx,fromy,tox,toy,w,h)
{
    if (level === 1) {
        tox = fromx;
        h = (fromy - 10) / (Math.random() + 3);
        toy = fromy - h;
        w = 80;
    }

    this.context.lineWidth = (7 - level) > 0 ? (7 - level) : 1;
    this.sketch(level, fromx, fromy, tox, toy, w, h);

    if (level === 6) {
        return;
    }

    h = h / 2;
    var branches = 2 + Math.random() * 2;
    for (var i = 0; i < branches; ++i) {
        this.TREE_SAVANNAH1(level + 1, tox, toy, tox + this.random() * w, toy - h + this.random() * h, w, h);   
    }
};

/**
 * SAVANNAH2 tree structure preset
 */
tr3.prototype.TREE_SAVANNAH2 = function(level,fromx,fromy,tox,toy,w,h)
{
    if (level === 1) {
        tox = fromx;
        h = (fromy - 10) / (Math.random() + 3);
        toy = fromy - h;
        w = 80;
    }

    tox = tox + this.random() * w;
    toy = toy + this.random() * h/2;

    var lineWidth = 25;
    for (var i = 0; i < level; i++) {
        lineWidth /= 1.9;
    }
    this.context.lineWidth = lineWidth;

    this.sketch(level, fromx, fromy, tox, toy, w, h);

    if (level === 6) {
        return;
    }

    h = h / 2;
    for (var i = 0; i < 1 + Math.random() * 10; ++i) {
        this.TREE_SAVANNAH2( level + 1, tox, toy, tox + this.random() * w, toy - h + this.random() * h, w * 0.9, h * 0.9);
    }
};

/**
 * OAK tree structure preset
 */
tr3.prototype.TREE_OAK = function(level,fromx,fromy,l,angle)
{
    var tox, toy;
    if (level === 1) {
        l = (fromy - 10) / (3 + Math.random());
        angle = this.random() * (Math.PI/6);
    }

    var xOffset = l * Math.sin(angle);
    var yOffset = l * Math.cos(angle);
    tox = fromx + xOffset;
    toy = fromy - yOffset;

    var lineWidth = 35;
    for (var i = 0; i < level; i++) {
        lineWidth /= 1.9;
    }
    this.context.lineWidth = lineWidth;


    this.sketch(level, fromx, fromy, tox, toy, Math.random() * l, Math.random() * l);

    if (level >= 7) {
        return;
    }

    var branchCount = 5 + Math.random() * 5;
    var minAngle = -1 * Math.PI / 2;
    var angleOffset = (Math.abs(minAngle) - minAngle) / branchCount;
    for (var i = 0; i < branchCount; ++i) {
        var branchAngle = angle + (minAngle + i * angleOffset);
        if (Math.abs(branchAngle) > Math.PI/2) {
            if (branchAngle > 0) {
                branchAngle = Math.PI/2 + (Math.random() * (Math.PI / 7));
            } else {
                branchAngle = -Math.PI/2 - (Math.random() * (Math.PI / 7));
            }
        }
        this.TREE_OAK(level+1, tox, toy, l / (1.2 + (Math.random() * 1.3)), branchAngle);
    }

};

/**
 * PALM tree structure preset
 */
tr3.prototype.TREE_PALM = function(level,fromx,fromy,l,angle)
{
    if (level == 1) {
        var rootCount = 1 + Math.random() * 3;
        for (var r = 0; r < rootCount; ++r) {
            l = (fromy * 0.8) - (Math.random() * (fromy / 2));
            angle = this.random() * (Math.PI/6);
            this.TREE_PALM(2, fromx, fromy, l, angle);
        }
        return;
    }

    var tox, toy;
    var xOffset = l * Math.sin(angle);
    var yOffset = l * Math.cos(angle);
    tox = fromx + xOffset;
    toy = fromy - yOffset;

    var lineWidth = 35;
    for (var i = 0; i < level; i++) {
        lineWidth /= 1.9;
    }
    this.context.lineWidth = lineWidth;

    if (level == 1) {
        this.sketch(level, fromx, fromy, tox, toy, 0, 0);
    } else {
        this.sketch(level, fromx, fromy, tox, toy, 0, 0);
    }

    if (level >= 1) {
        return;
    }

    var branchCount = 5 + Math.random() * 5;
    var minAngle = -1 * Math.PI / 2;
    var angleOffset = (Math.abs(minAngle) - minAngle) / branchCount;
    for (var i = 0; i < branchCount; ++i) {
        var branchAngle = angle + (minAngle + i * angleOffset);
        if (Math.abs(branchAngle) > Math.PI/2) {
            if (branchAngle > 0) {
                branchAngle = Math.PI/2 + (Math.random() * (Math.PI / 7));
            } else {
                branchAngle = -Math.PI/2 - (Math.random() * (Math.PI / 7));
            }
        }
        this.TREE_PALM(level+1, tox, toy, l / (1.2 + (Math.random() * 1.3)), branchAngle);
    }

};