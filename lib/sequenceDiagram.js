(function() {
    if(window.Sequence!==undefined){
        console.log("Global variable named Sequence has been used by other framework!");
    }
    window.Sequence = function (option) {
        option = option || {};
        var id = option.id || typeof(option.id)!=="string" ? "main":option.id,
            container = document.getElementById(id),
            paper = new Raphael(container, 0, 0),
            root = option.root || typeof(option.root)!=="string"?"../assets/images/":option.root,
            images = option.images || typeof(option.images) !=="array"?[
            "AS.png",
            "BGCF.png",
            "BSC.png",
            "CS.png",
            "DNS.png",
            "eNB.png",
            "EPC.png",
            "HSS.png",
            "MGCF.png",
            "MME.png",
            "MRS.png",
            "MSC.png",
            "P-CSCF.png",
            "PGW.png",
            "S-CSCF.png",
            "SGW.png",
            "UE.png"
        ]:option.images,
            headers = [],
            headerAfterPadding = option.headerAfterPadding ||
                typeof (option.headerAfterPadding) !== "number"?20:option.headerAfterPadding,
            headerLeft = option.headerLeft || typeof(option.headerLeft) !== "number" ?100:option.headerLeft,
            headerHeight = 87,
            headerWidth = 48,
            arrowTopPadding = option.arrowTopPadding ||
                typeof(option.arrowTopPadding) !=="number" ? 10 : option.arrowTopPadding,
            arrowHeight = option.scrollTop || typeof(option.scrollTop) !=="number" ? 20 : option.scrollTop,
            arrowWidth = option.arrowWidth || typeof(option.arrowWidth) !=="number" ? 20 :option.arrowWidth ,
            arrowBottomPadding = option.arrowBottomPadding ||
                typeof(option.arrowBottomPadding) !== "number" ? 10 : option.arrowBottomPadding,
            drawingHeight = option.drawingHeight ||
                typeof(option.currentHeight) !=="number" ? headerHeight : option.curentHeight, //start point for current signal drawing
            storage = {
                signals:[
                    {id:"1",from:"SGW",to:"UE",time:"00:00:50:400",desc:"this is an explanation"},
                    {id:"2",from:"P-CSCF",to:"SGW",time:"01:03:45:466",desc:"this is an explanation"},
                    {id:"3",from:"MME",to:"MRS",time:"01:04:56:566",desc:"this is an explanation"},
                    {id:"4",from:"HSS",to:"DNS",time:"02:56:45:245",desc:"this is an explanation"},
                    {id:"5",from:"AS",to:"PGW",time:"03:56:33:400",desc:"this is an explanation"},
                    {id:"6",from:"UE",to:"MGCF",time:"05:45:45:456",desc:"this is an explanation"},
                    {id:"7",from:"MME",to:"MRS",time:"01:04:56:566",desc:"this is an explanation"},
                    {id:"8",from:"HSS",to:"DNS",time:"02:56:45:245",desc:"this is an explanation"},
                    {id:"9",from:"AS",to:"PGW",time:"03:56:33:400",desc:"this is an explanation"},
                    {id:"10",from:"UE",to:"MGCF",time:"05:45:45:456",desc:"this is an explanation"},
                    {id:"11",from:"AS",to:"PGW",time:"03:56:33:400",desc:"this is an explanation"},
                    {id:"12",from:"UE",to:"MGCF",time:"05:45:45:456",desc:"this is an explanation"},
                    {id:"13",from:"MME",to:"MRS",time:"01:04:56:566",desc:"this is an explanation"},
                    {id:"14",from:"HSS",to:"DNS",time:"02:56:45:245",desc:"this is an explanation"},
                    {id:"15",from:"AS",to:"PGW",time:"03:56:33:400",desc:"this is an explanation"},
                    {id:"16",from:"UE",to:"MGCF",time:"05:45:45:456",desc:"this is an explanation"},
                    {id:"17",from:"AS",to:"PGW",time:"03:56:33:400",desc:"this is an explanation"},
                    {id:"18",from:"UE",to:"MGCF",time:"05:45:45:456",desc:"this is an explanation"},
                    {id:"19",from:"MME",to:"MRS",time:"01:04:56:566",desc:"this is an explanation"},
                    {id:"20",from:"HSS",to:"DNS",time:"02:56:45:245",desc:"this is an explanation"},
                    {id:"21",from:"AS",to:"PGW",time:"03:56:33:400",desc:"this is an explanation"},
                    {id:"22",from:"UE",to:"MGCF",time:"05:45:45:456",desc:"this is an explanation"}
                ],
                nodes:{}, //{name:[middle,sequence]} middle of header image's width
                scrollTop:{}, //{id:height} arrow current height
                arrows:{}, //{id:{scale:[raphaelObj],arrow:raphaelOjb,line:raphaelOjb,time:raphaelSet}}
                highlight:{}
            };
        draw();
        resizePaper();
        container.scrollTop = 0;
        container.onscroll= function(){
            moveHeader(container.scrollTop);
        };
        function clear(){
            _.each(storage.arrows,function(v){
                v.arrow.forEach(function(o){
                    o.remove();
                });

                v.time.forEach(function(o){
                    o.remove();
                });
                _.each(v.scale,function(s){
                    s.remove();
                });

            });
        }
        function draw(){
            drawHeaderAndUpdateNodes();
            drawSignal();
            //paper.setViewBox(0,0,1920,1080,true);
        }
        function drawHeaderAndUpdateNodes() {
            _.each(images, function (el,i) {
                headers.push(paper.image(root + el, headerLeft, 0, headerWidth, headerHeight)
                    .attr("opacity",1).toFront());
                storage.nodes[el.split(".")[0]] = [headerLeft + 24,i];
                headerLeft = headerLeft + headerAfterPadding + 48;
            });
        }
        function drawSignal(){
            _.each(storage.signals,function(v,k){
                storage.arrows[v.id] = {};
                storage.arrows[v.id]["scale"] = drawScale();
                storage.arrows[v.id]["time"] = drawTime(v.time);
                var set = drawArrow({from: v.from,to: v.to,desc:v.desc});
                storage.arrows[v.id]["arrow"]=set;
                storage.scrollTop[v.id] = set.pop().getBBox().y - arrowTopPadding - arrowHeight/2;
                updateCurrentHeight();
            });
        }
        function drawArrow(signal){
            var from = storage.nodes[signal.from], to=storage.nodes[signal.to];
            if(from[1]>to[1]){
                return drawLeftArrow({from:from[0],to:to[0],text:signal.desc});
            }else{
                return drawRightArrow({from:from[0],to:to[0],text:signal.desc});
            }
        }
        function drawLeftArrow(data){
            var x1=data.from,
                y=drawingHeight+arrowTopPadding+arrowHeight/2,
                x2=data.to,
                set = paper.set(),text;
                set.push(paper.text((x1-x2)/2,0,data.text).translate(x2,y));
                set.push(drawLeftTriangle(arrowWidth,arrowHeight).translate(x2,y-arrowHeight/2)),
                set.push(drawLine({from:[x1,y],to:[x2+arrowWidth,y],width:arrowHeight}));
                return set;
        }
        function drawRightArrow(data){
            var x1=data.from,
                y=drawingHeight+arrowTopPadding+arrowHeight/2,
                x2=data.to,text,
                set = paper.set();
                set.push(paper.text((x2-x1)/2,0,data.text).translate(x1,y));
                set.push(drawRightTriangle(arrowWidth,arrowHeight).translate(x2-arrowWidth,y-arrowHeight/2));
                set.push(drawLine({from:[x1,y],to:[x2-arrowWidth,y],width:arrowHeight}));
                return set;
        }
        function drawScale(){
            var tmp = [];
            _.each(storage.nodes,function(v){
                tmp.push(drawLine({from:[v[0],drawingHeight],
                    to:[v[0],drawingHeight + getArrowBoxHeight()],
                    width:1}));
            });
            return tmp;
        }
        function getArrowBoxHeight(){
               return   getArrowTopPadding()+
                        getArrowHeight()+
                        getArrowBottomPadding();
        }
        function getArrowTopPadding(){
            return arrowTopPadding;
        }
        function getArrowHeight(){
            return arrowHeight;
        }
        function getArrowBottomPadding(){
            return arrowBottomPadding;
        }
        function updateCurrentHeight(){
            drawingHeight = drawingHeight + getArrowBoxHeight();
        }
        function scrollTo(signal){

            var offsetTop = findArrow(signal);
            highlight(signal);
            //console.log("offset top:"+offsetTop+arrowHeight/2);
            container.scrollTop = offsetTop - headerHeight;
            //moveHeader(container.scrollTop);
            //http://stackoverflow.com/questions/27980084/scrolling-to-a-element-inside-a-scrollable-div
            //http://stackoverflow.com/questions/11822298/how-do-i-find-the-position-of-an-element-in-raphael

        }
        function moveHeader(top){
            _.each(headers,function(h){
                h.attr({x: h.getBBox().x,y: top});
            });
            //http://stackoverflow.com/questions/13544681/transform-vs-translate-in-raphael
        }
        function findArrow(data){
            return storage.scrollTop[data.id];
        }
        function drawLeftTriangle(height,width){
            var top = [width,0], bottom =[width,height],left = [0,height/2];
            return paper.path("M"+ top.join(" ")+" L"+bottom.join(" ")+" L"+left.join(" ")+" Z").attr({"fill":"#FF5733","fill-opacity":0.5,"stroke":"#FF5733","stroke-opacity":0.5});
        }
        function drawRightTriangle(height,width){
            var top = [0,0], bottom =[0,height],right = [width,height/2];
            return paper.path("M"+ top.join(" ")+" L"+bottom.join(" ")+" L"+right.join(" ")+" Z").attr({"fill":"#FF5733","fill-opacity":0.5,"stroke":"#FF5733","stroke-opacity":0.5});
        }
        function drawLine(o){
            o = o || {};
            //o.from = [0,100], o.to = [500,100];
            return paper.path("M" + o.from.join(" ")+ " L"+ o.to.join(" ")).attr({
                "stroke-opacity":0.5,
                "stroke":"yellow",
                "stroke-width": o.width
            });
        }
        function highlight(o){
            //unhightLight();
            //storage.highlight = storage.arrows[o.id].pop().pop().pop().attr({});
        }
        function unhightLight(){
            //storage.highlight.pop().pop().pop().attr({});
        }
        function drawTime(time){
            return drawRectangle({text:time}).translate(0,drawingHeight + getArrowTopPadding());
        }
        function drawRectangle(o){
            o = o || {};
            var set = paper.set();
            set.push(paper.text(45,12.5,o.text));
            set.push(paper.path("M0 0 L90 0 L90 25 L0 25 Z").attr({
                "fill":"yellow",
                "fill-opacity":0.5,
                "stroke":"yellow"
            }));
            return set;
        }
        function resizePaper(){
            var maxWidth = 0,maxHeight=0;
            paper.forEach(function(el){
                var o = el.getBBox(),x = o.x, y=o.y, w=o.width, h=o.height;
                maxWidth = Math.max(maxWidth,x+w);
                maxHeight = Math.max(maxHeight,y+h);
            });
            //console.log(maxWidth + "," + maxHeight);
            paper.setSize(maxWidth,maxHeight);
        }
        function refresh(signals){
            storage.signals = signals;
            clear();
            drawSignal();
        }
        return{
            scrollTo:scrollTo,
            refresh:refresh,
            clear:clear
        }
    };
})();