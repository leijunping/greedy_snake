var map;//global
var food;
var snake;
var timer;//to set speed
var initSpeed=200;
var newSpeed=initSpeed;
var flag=0;
var grade=0;
window.onload=function(){
	    map=new Map();
		map.show();
	    food=new Food();
		food.show();
	    snake=new Snake();
	    snake.show();
};
function Map(){
	this.height=400;
	this.width=800;
	this.position='absolute'; 
	this.backgroundColor='#EEEEEE';
	this._map=null;
	//generate the map
	this.show=function(){
		this._map=document.createElement('div');
		this._map.style.height=this.height+'px';
		this._map.style.width=this.width+'px';
		this._map.style.position=this.position;
		this._map.style.backgroundColor=this.backgroundColor;
		document.body.appendChild(this._map);
	};
}
function Food(){
	this.height=20;
	this.width=20;
	this.x=0;
	this.y=0;
	this.position='absolute'; 
	this.backgroundColor='#00FF00';
	this._food=null;
	//generate the food
	this.show=function(){
		this._food=document.createElement('div');
		this._food.style.height=this.height+'px';
		this._food.style.width=this.width+'px';
		this._food.style.position=this.position;
		this.x=Math.floor(Math.random()*map.width/this.width); 
		this.y=Math.floor(Math.random()*map.height/this.height);
		this._food.style.left=this.x*this.width+'px';
		this._food.style.top=this.y*this.height+'px';
		this._food.style.backgroundColor=this.backgroundColor;
		map._map.appendChild(this._food);
	};
}
function Snake(){
	this.height=20;
	this.width=20;
	this.position='absolute';
	this.direction=null;
	//init snake body
	this.body=new Array([3,2,'red',null],[2,2,'blue',null],[1,2,'blue',null]);
	this.show=function(){
		for(var i=0;i<this.body.length;i++){
			if(this.body[i][3]==null){
				this.body[i][3]=document.createElement('div');
				this.body[i][3].style.height=this.height;
				this.body[i][3].style.width=this.width;
				this.body[i][3].style.position=this.position;
				this.body[i][3].style.backgroundColor=this.body[i][2];
				map._map.appendChild(this.body[i][3]);
			}
			this.body[i][3].style.left=this.body[i][0]*this.width+'px';
			this.body[i][3].style.top=this.body[i][1]*this.height+'px';
		}
	};
	this.move=function(){
		//body move
		var bodyLen=this.body.length-1;
		for(var i=bodyLen;i>0;i--){
			this.body[i][0]=this.body[i-1][0];
			this.body[i][1]=this.body[i-1][1];
		}
		//head move
		switch(this.direction){
		case 'up':
			this.body[0][1]=this.body[0][1]-1;
			break;
		case 'down':
			this.body[0][1]=this.body[0][1]+1;
			break;
		case 'right':
			this.body[0][0]=this.body[0][0]+1;
			break;
		case 'left':
			this.body[0][0]=this.body[0][0]-1;
			break;
		}
		this.condition();
		
	};
	this.speed=function(){
		timer=setInterval('snake.move()',initSpeed);
	};
	this.condition=function(){
		//eat the food
		if(this.body[0][0]==food.x&&this.body[0][1]==food.y){
			this.body[this.body.length]=[0,0,'blue',null];
			grade++;
			map._map.removeChild(food._food);
			food.show();
		}
		//hit the wall or not
		if(this.body[0][0]<0||this.body[0][0]>map.width/this.width-1||this.body[0][1]<0||this.body[0][1]>map.height/this.height-1){
			clearInterval(timer);
			//alert('game over'); 
			gameOver();
			return;
		}
		//hit the snake body
		for(var i=1;i<this.body.length;i++){
			if(this.body[0][0]==this.body[i][0]&&this.body[0][1]==this.body[i][1]){
				clearInterval(timer);
				//alert('game over');
				gameOver();
				return;
			}
		}
		 //速度提升处理，积分每曾2分，速度提升一倍 
		if(grade/2==flag){
			clearInterval(timer);
			flag++;
			nowSpeed=initSpeed/flag; 
            timer=setInterval('snake.move()',nowSpeed); 
		}
		document.title='贪吃蛇 积分'+grade+' 速度等级'+initSpeed/nowSpeed; 
		this.show();  //放置game over之后会继续移动一个格子
	};
}
document.onkeydown=function(event){
	//press any key to start
	if(snake.direction==null){
		//init the direct
		snake.direction='right';
		//init the speed
		snake.speed();
	}
	//set keys to control the snake 
	var event=event||window.event;
	var keyCode=event.keyCode;
	var keyChar=String.fromCharCode(keyCode);
	switch(keyChar){
	case 'W':
		snake.direction=snake.body[0][0]==snake.body[1][0]?snake.direction:'up';
		break;
	case 'S':
		snake.direction=snake.body[0][0]==snake.body[1][0]?snake.direction:'down';
		break;
	case 'A':
		snake.direction=snake.body[0][1]==snake.body[1][1]?snake.direction:'left';
		break;
	case 'D':
		snake.direction=snake.body[0][0]==snake.body[1][1]?snake.direction:'right';
		break;
	}
};
function gameOver(){
    map._map.innerHTML='<font>Game Over!try again?</font>';
    map._map.style.textAlign='center';
    map._map.style.verticalAlign='middle';
    var flag=1;
    var r=confirm('Would you like to try again or quit?');
    if(r==true){
    	map.show();
		food=new Food();
		food.show();
	    snake=new Snake();
	    snake.show();
    }else{
    	map._map.innerHTML='Quit the game!';
    }
//    map._map.onclick=function(){
//    	if(flag){
//    		map._map.innerHTML='';
//    		food=new Food();
//    		food.show();
//    	    snake=new Snake();
//    	    snake.show();
//    		flag=0;
//    	}
//    };
}
