    var map;    //地图     
    var snake;  //蛇     
    var food;  //食物     
    var timer;  //定时器  
    var initSpeed=200;  //初始定时器时间间隔（毫秒）,间接代表蛇移动速度   
    var nowSpeed=initSpeed; //游戏进行时蛇移动速度 
    var grade=0;    //积分  
    var flag=1;     //（可间接看做）关卡     
    
    
    //地图类    
    function Map(){ 
        this.width=800; 
        this.height=400; 
        this.position='absolute'; 
        this.color='#EEEEEE'; 
        this._map=null; 
        //生成地图         
        this.show=function(){ 
            this._map=document.createElement('div'); 
            this._map.style.width=this.width+'px'; 
            this._map.style.height=this.height+'px'; 
            this._map.style.position=this.position; 
            this._map.style.backgroundColor=this.color; 
            document.getElementsByTagName('body')[0].appendChild(this._map); 
        }  
    }   
        
    //食物类    
    function Food(){ 
        this.width=20; 
        this.height=20; 
        this.position='absolute'; 
        this.color='#00FF00'; 
        this.x=0; 
        this.y=0; 
        this._food; 
        //生成食物       
        this.show=function(){ 
            this._food=document.createElement('div'); 
            this._food.style.width=this.width+'px'; 
            this._food.style.height=this.height+'px'; 
            this._food.style.position=this.position; 
            this._food.style.backgroundColor=this.color; 
            this.x=Math.floor(Math.random()*map.width/this.width); 
            this.y=Math.floor(Math.random()*map.height/this.width); 
            this._food.style.left=this.x*this.width; 
            this._food.style.top=this.y*this.height; 
  
            map._map.appendChild(this._food); 
        } 
    } 
    
    
    //蛇类    
    function Snake(){ 
        this.width=20; 
        this.height=20; 
        this.position='absolute'; 
        this.direct=null;
        //移动方向         //初始蛇身         
        this.body=new Array( 
                [3,2,'red',null], //蛇头    
                [2,2,'blue',null], 
                [1,2,'blue',null] 
            ); 
        //生成蛇身   
        this.show=function(){ 
            for(var i=0;i<this.body.length;i++){ 
                if(this.body[i][3]==null){ 
                    this.body[i][3]=document.createElement('div'); 
                    this.body[i][3].style.width=this.width; 
                    this.body[i][3].style.height=this.height; 
                    this.body[i][3].style.position=this.position; 
                    this.body[i][3].style.backgroundColor=this.body[i][2]; 
                    map._map.appendChild(this.body[i][3]); 
                } 
                this.body[i][3].style.left=this.body[i][0]*this.width+'px'; 
                this.body[i][3].style.top=this.body[i][1]*this.height+'px'; 
            } 
        } 
        //控制蛇移动    
        this.move=function(){ 
              
            var length=this.body.length-1; 
            for(var i=length;i>0;i--){ 
                this.body[i][0]=this.body[i-1][0]; 
                this.body[i][1]=this.body[i-1][1]; 
            } 
  
            switch(this.direct){ 
                case 'right': 
                    this.body[0][0]=this.body[0][0]+1; 
                    break; 
                case 'left': 
                    this.body[0][0]=this.body[0][0]-1; 
                    break; 
                case 'up': 
                    this.body[0][1]=this.body[0][1]-1; 
                    break; 
                case 'down': 
                    this.body[0][1]=this.body[0][1]+1; 
                    break; 
            } 
              
            this.condition(); 
            this.show(); 
        } 
        //定时器，开始游戏时，调用   
        this.speed=function(){ 
            timer=setInterval('snake.move()',initSpeed); 
        } 
        //条件处理      
        this.condition=function(){ 
            //吃食物      
            if(this.body[0][0]==food.x&&this.body[0][1]==food.y){ 
                grade++; 
                this.body[[this.body.length]]=[0,0,'blue',null]; 
                map._map.removeChild(food._food) 
                food.show(); 
            } 
            //判断是否撞墙     
            if(this.body[0][0]<0||this.body[0][0]>=map.width/this.width||this.body[0][1]<0||this.body[0][1]>=map.height/this.height){ 
                alert('game over'); 
                clearInterval(timer); 
                return ; 
            } 
            //判断是否撞到自身  
            for(var i=1;i<this.body.length;i++){ 
                if(this.body[0][0]==this.body[i][0]&&this.body[0][1]==this.body[i][1]){ 
                    alert('game over'); 
                    clearInterval(timer); 
                    return ; 
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
  
        } 
    } 
  
    document.onkeydown=function(event){ 
        //按下任意键，开始游戏      
        if(snake.direct===null){ 
            snake.direct='right'; 
            snake.speed(); 
        } 
        //控制方向，W S D A分别代表 上下右左   
        switch(window.event?window.event.keyCode:event.keyCode){//浏览器兼容处理            
        case 87 : 
                snake.direct=snake.body[0][0]==snake.body[1][0]?snake.direct:'up';//避免反向移动，触发死亡bug            
                break; 
            case 83 : 
                snake.direct=snake.body[0][0]==snake.body[1][0]?snake.direct:'down'; 
                break; 
            case 68 : 
                snake.direct=snake.body[0][1]==snake.body[1][1]?snake.direct:'right'; 
                break; 
            case 65 : 
                snake.direct=snake.body[0][1]==snake.body[1][1]?snake.direct:'left'; 
                break; 
        } 
    } 
    //自动加载游戏   
    window.onload=function(){ 
        map=new Map(); 
        map.show(); 
        food=new Food(); 
        food.show(); 
        snake=new Snake(); 
        snake.show();        
    } 