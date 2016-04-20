

var runBtn=document.getElementById("runBtn");
var runIpt=document.getElementById("runIpt");
var textarea=document.getElementById("textarea");
var tbody=document.getElementsByTagName("tbody")[0];
var direction=["top","right","bottom","left"]
var interval=null;
var WIDTH=61;
var HEIGHT=61;
var nowPosition={
    X:0,
    Y:0,
    action:null,
    turn:0,
    rotate:0
};


function _mkAction(){
    var odiv=document.createElement("div");
    odiv.className="action";
    odiv.style.width=WIDTH+"px";
    odiv.style.height=HEIGHT-10+"px";
    odiv.style.borderTop="10px solid blue";
    odiv.style.backgroundColor="red";
    odiv.style.position="absolute";
    var ox=Math.floor(Math.random()*10);
    var oy=Math.floor(Math.random()*10);
    odiv.style.left=ox*WIDTH+"px";
    odiv.style.top=oy*HEIGHT+"px";
    nowPosition.X=ox+1;
    nowPosition.Y=oy+1;
    nowPosition.action=odiv;
    tbody.appendChild(odiv);
}



function Move(num,times){
    var go;
    if(times==0)
        return false;
    if(num==undefined||num===null)
        go=nowPosition.turn;
    else
    if(num===0)
        go=num;
    else
        go=num;
    if(go==0){
        if(nowPosition.Y>1)
            nowPosition.Y--;
    }
    if(go==1){
        if(nowPosition.X<10)
            nowPosition.X++;
    }

    if(go==2){
        if(nowPosition.Y<10)
            nowPosition.Y++;
    }
    if(go==3){
        if(nowPosition.X>1)
            nowPosition.X--;
    }
    nowPosition.action.style.top=(nowPosition.Y-1)*HEIGHT+"px";
    nowPosition.action.style.left=(nowPosition.X-1)*WIDTH+"px"; 
    times&&Move(num,times-1);
}

// 设置方向函数
function Turn(direct,rotate){
    if(direct!=null)
    switch(direct){
        case "TUN RIG":
        nowPosition.rotate=(nowPosition.rotate+90);
        console.log(nowPosition);
        nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
        nowPosition.turn=(nowPosition.turn+1)%4;
        console.log(nowPosition.rotate);
        console.log(nowPosition.turn);
        break;
        case "TUN LEF":
        nowPosition.rotate=(nowPosition.rotate-90);
        nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
        nowPosition.turn=(4+(nowPosition.turn-1)%4)%4;
        console.log(nowPosition.rotate);
        console.log(nowPosition.turn);
        break;
        case "TUN BAC":
        nowPosition.rotate=(nowPosition.rotate+180);
        nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
        nowPosition.turn=(nowPosition.turn+2)%4;
                console.log(nowPosition.rotate);
        console.log(nowPosition.turn);
        break;
    }
    else{
        nowPosition.rotate=rotate;
        nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
        if(nowPosition.rotate>=0)
            nowPosition.turn=(nowPosition.rotate/90)%4;
        else if(nowPosition.rotate<0)
            nowPosition.turn=(4+(nowPosition.rotate/90)%4)%4;
        // Move(nowPosition.turn);
    }
}
// 根据路径设置动画
function _go(way){
    var i=0;
    nowPosition.action.style.left=(way[i].x-1)*WIDTH+"px";
    nowPosition.action.style.top=(way[i].y-1)*HEIGHT+"px";
    var goInterval=setInterval(function(){
        i++;
        if(i>way.length-1)
            clearInterval(goInterval);
        nowPosition.action.style.left=(way[i].x-1)*WIDTH+"px";
        nowPosition.action.style.top=(way[i].y-1)*HEIGHT+"px";
    },1000);
    return ;

}


var handler={
        "GO":function(num){
            console.log(num);
            Move(null,num);
        },
        "TUN LEF":function(num){
            Turn("TUN LEF");
        },
        "TUN RIG":function(num){
            Turn("TUN RIG");
        },
        "TUN BAC":function(num){
            Turn("TUN BAC");
        },
        "TRA LEF":function(num){
            Move(3,num);
        },
         "TRA TOP":function(num){
            Move(0,num);
        },
         "TRA RIG":function(num){
            Move(1,num);
        },
         "TRA BOT":function(num){
            Move(2,num);
        },
         "MOV LEF":function(num){
            Turn(null,-90);
            Move(null,num);
        },
         "MOV TOP":function(num){
            Turn(null,0);
            Move(null,num);
        },
         "MOV RIG":function(num){
            Turn(null,90);
            Move(null,num);
        },
         "MOV BOT":function(num){
            Turn(null,180);
            Move(null,num);
        },
         "BUILD":function(num){
            build.build();
        },
         "BRU":function(color){
            build.renderBuild(color);
        },
         "MOV TO":function(x,y){
            var way=build.searchToWay(x,y);
            _go(way);


        }

}

var handTextArea = (function(){
    var textarea=document.getElementById("textarea");
    var showRow=document.getElementsByClassName("show-row")[0];
    var enterRagExp=/\n/g;
    var row=0;
    function _addRow(enterRow){
        if(row!=enterRow){
            var el;
            var temp=document.createDocumentFragment();
            showRow.innerHTML="<div class='rol-el'>1</div>";
            for(var i=1;i<=enterRow;i++){
                el=document.createElement("div");
                el.className="rol-el";
                el.innerHTML=i+1;
                temp.appendChild(el);
            }
            showRow.appendChild(temp);
            row=enterRow;
        }
    }
    return {
        addShow: function(){
            var value=textarea.value;
            if(value.match(enterRagExp))
                var enterRow=value.match(enterRagExp).length;
            _addRow(enterRow);
        },
        matchConsole: function(){
            var value=textarea.value;
            var consoleArr=value.split(enterRagExp);
            console.log(consoleArr);
            return consoleArr;
        },
        showRowScroll: function(scrollTop){
            showRow.scrollTop=scrollTop;
        }
    }
}());



var checkConsoleArr= (function(){
    var checkExp=/MOV|GO|TRA|BUILD/;
    var checkMOVTO=/MOV TO/;
    var checkBRU=/BRU/;
    var arrStr="";
    for(key in handler){
        if(checkMOVTO.test(key)){
            arrStr+="^"+key+"(\\s+\\d+,\\d+)?$|";
        }else if(checkExp.test(key)){
            arrStr+="^"+key+"(\\s+[0-9]+)?$|";
        }else if(checkBRU.test(key)){
            arrStr+="^"+key+"(\\s+(.+)$)|"
        }else
            arrStr+="^"+key+"$|";
    }
    arrStr=arrStr.slice(0,-1);
    arrStr=new RegExp(arrStr);
    console.log(arrStr);
    function _processArr(arr){
    return  arr && arr.map(function(item,index){
            item=item.replace(/^\s+|\s+$/g,"");
            if(arrStr.test(item))
                return item;
            else
                return false;
        });

    }
    return {
        exec: function(){
            var consoleArr=_processArr(handTextArea.matchConsole());
            var i=0;
            var fn=handler[consoleArr[i].replace(/\s+[0-9]+$/,"")];
            var num=consoleArr[i].match(/[0-9]+/)&&consoleArr[i].match(/[0-9]+/)[0];
            var color=consoleArr[i].match(/BRU\s+(.+)\s*/)&&consoleArr[i].match(/BRU\s+(.+)\s*/)[1];
            // console.log(_processArr(handTextArea.matchConsole()));
            // console.log(consoleArr[i].replace(/\s+[0-9]+$/,""));
            // console.log(fn);
            // console.log(num);
            // console.log(consoleArr[i].match(/BRU\s+(.+)\s*$/));
            // console.log(color);
            if(/BRU/.test(consoleArr[i])){
                handler["BRU"](color);
            }else if(/MOV TO/.test(consoleArr[i])){
                var temp=consoleArr[i].match(/\d{1,2}/g);
                console.log(temp[0],temp[1]);
                handler["MOV TO"](temp[0],temp[1]);
            }else
            fn(num);
            var userInterval=setInterval(function(){
                i++;
                if(i>=consoleArr.length||!consoleArr.length)
                    clearInterval(userInterval);
                var fn=handler[consoleArr[i].replace(/\s+[0-9]+$/,"")];
                var num=consoleArr[i].match(/[0-9]+/)&&consoleArr[i].match(/[0-9]+/)[0];
                var color=consoleArr[i].match(/BRU\s+(.+)\s*/)&&consoleArr[i].match(/BRU\s+(.+)\s*/)[1];
                if(/BRU/.test(consoleArr[i])){
                    handler["BRU"](color);
                }else if(/MOV TO/.test(consoleArr[i])){
                var temp=consoleArr[i].match(/\d{1,2}/g);
                console.log(temp[0],temp[1]);
                handler["MOV TO"](temp[0],temp[1]);
            }else
                fn(num);
                console.log(consoleArr.length);
                
            },1000);
        },
        check: function(){
            var showRow=document.getElementsByClassName("show-row")[0];
            var flag=true;
            var consoleArr=_processArr(handTextArea.matchConsole());
            consoleArr.map(function(item,index){
                if(item==false){
                    showRow.children[index].style.backgroundColor="red";
                    flag=false;
                }
                else
                    showRow.children[index].style.backgroundColor="";
            });
            return flag;
          }
        
    };

}());


var build=(function(){
    var buildArr=[];
    var tbody=document.getElementsByTagName("tbody")[0];
    function randomBuild(){
        var ox=Math.floor(Math.random()*10+1);
        var oy=Math.floor(Math.random()*10+1);
        console.log(nowPosition.X,nowPosition.X);
        if(buildArr.length==99){
            console.log("没有格子了");
            return false;
        }
        if(_jud(ox,oy))
            _addDiv(ox,oy);
        else
            randomBuild();

    }
    function _jud(ox,oy){
        var flag=true;
        buildArr.map(function(item,index){
            if(ox==item.x&&oy==item.y)
                flag=false;
            if(ox==nowPosition.X&&oy==nowPosition.Y)
                flag=false;
        });
        return flag;
    }
    function _addDiv(ox,oy){
        var el=document.createElement("div");
        buildArr.push({
            x:ox,
            y:oy,
            el:el
        });
        console.log(buildArr);
        el.className="_addDiv";
        el.style.position="absolute";
        el.style.left=WIDTH*(ox-1) + "px";
        el.style.top=HEIGHT*(oy-1) + "px";
        tbody.appendChild(el);
    }
    
    // 前方建障碍物
    function build(){
        var ox=nowPosition.X;
        var oy=nowPosition.Y;
        console.log(nowPosition.turn,ox,oy);
        ox=_judBuild(ox,oy).ox;
        oy=_judBuild(ox,oy).oy;
        if(_jud(ox,oy)){
            _addDiv(ox,oy);
        }else{
            console.log("前方已有障碍物");
        }
    }
    
    // 选择面对的那个方块
    function _judBuild(ox,oy){
        if(nowPosition.turn==0&&oy>1)
            oy--;
        if(nowPosition.turn==1&&ox>1)
            ox++;
        if(nowPosition.turn==2&&oy<10)
            oy++;
        if(nowPosition.turn==3&&ox<10)
            ox--;
        return {
            ox:ox,
            oy:oy
        }
    }

    function renderBuild(color){
        var ox=nowPosition.X;
        var oy=nowPosition.Y;
        ox=_judBuild(ox,oy).ox;
        oy=_judBuild(ox,oy).oy;
        // flag=_judIsBuild(ox,oy);
        // if(flag[tf]==true)
        //     _addDivColor(flag);
        // else
        //     console.log("前方没有障碍物");
        var flag=false;
        buildArr.map(function(item,index){
            console.log(ox,oy,item.x,item.y);
            if(ox==item.x&&oy==item.y){
                item.el.style.backgroundColor=color;
                flag=true;

            }
        });
        if(flag==false)
            console.log("前方没有障碍物");
     }
     function nowIsEnd(endX,endY){
        var flag=true;
         buildArr.map(function(item,index){
             if(item.x==endX&&item.y==endY)
                flag=false;
         });
         return flag;
     }
    
    function searchToWay(endX,endY){
        var ox=nowPosition.X;
        var oy=nowPosition.Y;
        if(!nowIsEnd(endX,endY)){
            console.log("目的地不可达");
            return false;
        }
        var theWay=[];
        var count=[];
        var mm=0;
        console.log(ox,oy,endX,endY);
        goWay(ox,oy);
        return theWay;
        function goWay(ox,oy){
            mm++;
            if(mm>50){
                console.log("error");
                return false;
            }
        if(ox==endX&&oy==endY){
            // console.log(theWay);
            nowPosition.X=endX;
            nowPosition.Y=endY;
            return true;
        }
        if(_judSearch(ox-1,oy)){
            count.push({
                x:ox-1,
                y:oy
            });
        }
        if(_judSearch(ox,oy-1)){
            count.push({
                x:ox,
                y:oy-1
            });
        }
        if(_judSearch(ox+1,oy)){
            count.push({
                x:ox+1,
                y:oy
            });
        }
        if(_judSearch(ox,oy+1)){
            count.push({
                x:ox,
                y:oy+1
            });
        }
        console.log(count);
        var arr=_searchMin(count);
        console.log(theWay);
        count=[];
        goWay(arr.x,arr.y);
        }
        
        function _searchMin(count){
            var min=count[0];
            count.map(function(item,index){
                if((Math.abs(min.x-endX)+Math.abs(min.y-endY)) > (Math.abs(item.x-endX)+Math.abs(item.y-endY)) )
                    min=item;
            })
            theWay.push(min);
            return min;
        }




        function _judSearch(ox,oy){
            
        var flag=true
        if(ox<1||ox>10||oy<1||oy>10)
            flag=false;
        buildArr.map(function(item,index){
            if(ox==item.x&&oy==item.y)
              flag=false;
        });
        theWay.map(function(item,index){
            if(ox==item.x&&oy==item.y)
              flag=false;
        });

        return flag;
        }

    }

    

    return {
        randomBuild:randomBuild,
        build:build,
        renderBuild:renderBuild,
        searchToWay:searchToWay
    };

}());



// 解决浏览器兼容
function addEventHandler(obj,event,handler){
    if(obj.addEventListener){
        obj.addEventListener(event,handler,false);
    }else if(obj.attachEvent){
        obj.attachEvent("on"+event,handler);
    }else
        obj["on"+event]=handler;
}



function init(){
    _mkAction();
    addEventHandler(document.getElementById("test"),"click",function(){
        handler["BRU"]();
    });
    var shouElIterval=setInterval(handTextArea.addShow,500);
    addEventHandler(document.getElementById("randomBtn"),"click",build.randomBuild);
    addEventHandler(runBtn,"click",function(){
        if(checkConsoleArr.check())
            checkConsoleArr.exec();
    });
    addEventHandler(textarea,"scroll",function(event){
        event=event||window.event;
        handTextArea.showRowScroll(event.target.scrollTop);
    });

}

init();