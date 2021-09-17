class Point {
	constructor(x, y, dX, dY){
		this.x  = x;
		this.y  = y;
		this.dX = dX;
		this.dY = dY;
		this.color = getRandomColor();
	}
	move(direction) {
		this.x += this.dX*direction;
		this.y += this.dY*direction;
	}
}

let points = {
	entities: [],
	amount: 10,
	size: 5,
	maxSpeed: 5,
	direction: 1,
	moving: false,
	drawPoints: false,
	pointsCancer: false,
	cancerColors: false,
	generate: function(){
		for(let i = 0 ; i < this.amount ; i ++){
			let newX = Math.round(Math.random()*canvas.width), newY = Math.round(Math.random()*canvas.height);
			let newdX = Math.round(Math.random()*this.maxSpeed), newdY = Math.round(Math.random()*this.maxSpeed);
			if(Math.random() > 0.5) newdX *= -1;
			if(Math.random() > 0.5) newdY *= -1;
			this.entities[i] = new Point(newX, newY, newdX, newdY);
		}
	},
	draw: function(){
		for(let x = 0; x < canvas.width; x += this.size){
			for(let y = 0; y < canvas.height; y += this.size){
				let lowestDist = getDist(x, y, this.entities[0].x, this.entities[0].y), bestMatch = 0;
				for(let i = 0; i < this.amount; i ++){
					let newDist = getDist(x, y, this.entities[i].x, this.entities[i].y);
					if(newDist < lowestDist){
						lowestDist = newDist;
						bestMatch = i;
					}
					
				}
				context.fillStyle = this.entities[bestMatch].color;
				context.fillRect(x, y, this.size, this.size);
			}
		}
		if ( this.drawPoints ){
			for(let i = 0; i < this.amount; i++){
				context.fillStyle = getRandomColor();
				if(!this.pointsCancer) context.fillStyle = "black";
				context.beginPath();
				context.arc(this.entities[i].x, this.entities[i].y, 2, 0, Math.PI*2);
				context.closePath();
				context.fill();
			}
		}
	},
	move: function(){
		let amountoffScreen = 0;
		for(let i = 0; i < this.amount ; i ++){
			this.entities[i].move(this.direction);
			if ( (this.entities[i].x < 0 || this.entities[i].x > 800 ) && (this.entities[i].y < 0 || this.entities[i].y > 600) ){
				amountoffScreen++;
			}
			if(amountoffScreen >= (this.amount/3)*2){
				this.direction *= -1;
			}
		}
	}
}

points.generate();

function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for(let i = 0; i < 6; i ++) color += letters[Math.floor(Math.random()*16)];
	return color;
}
function update() {
	if(points.moving){
		points.move()
	}
	if(points.cancerColors){
		for ( let i = 0 ; i < points.entities.length ; ++i){
			points.entities[i].color = getRandomColor();
		}
	}
}

function getDist(x1, y1, x2, y2){
	let dX = x1-x2;
	let dY = y1-y2;
	return Math.hypot(dX, dY);
}

function draw() {
	points.draw();
}

function keyup(key) {
	switch(key){
		case 32:
			points.moving = !points.moving;
			break;
		case 173:
			if(points.size > 1) points.size--;
			break;
		case 61:
			points.size++;
			break;
		case 80:
			points.drawPoints = !points.drawPoints;
			break;
		case 67:
			points.cancerColors = !points.cancerColors;
			break;
		case 79:
			points.pointsCancer = !points.pointsCancer;
			break;
		case 72:
			alert("Click to generate new points. Press space to toggle moving. + and - increase and decrease the resolution for performance. C toggles the seizure simulator. P toggles the rendering of the points and O toggles their sicko mode.");
			break;
	}
	console.log(key);
}

function mouseup() {
	points.generate();
}
