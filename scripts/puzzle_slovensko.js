$(".kraj").each(function (){
	$(this).children().css({height: $(this).children().height()*0.6, width: $(this).children().width()*0.6});
	$(this).width($(this).children().width());
})
$("#okraj").css({height: $("#okraj").height()*0.6 +"px",width: $("#okraj").width()*0.6+"px"});
$("#okraj_div").width($("#okraj").width());

// nastavenie pozicie dropboxov
let imgPos = $('#okraj').position();
let height = $('#okraj').height();
let width = $('#okraj').width();
$("#dropba").css({top: imgPos.top - 25 + height/1.3383, left: imgPos.left - 25 + width / 16.8});
$("#dropbb").css({top: imgPos.top - 25 + height/1.3846, left: imgPos.left - 25 + width / 2.185});
$("#dropke").css({top: imgPos.top - 25 + height/1.5, left: imgPos.left - 25 + width / 1.2923});
$("#dropnr").css({top: imgPos.top - 25 + height/1.196, left: imgPos.left - 25 + width / 3.8571});
$("#droppo").css({top: imgPos.top - 25 + height/2.3077, left: imgPos.left - 25 + width / 1.3012});
$("#droptn").css({top: imgPos.top - 25 + height/2.1176, left: imgPos.left - 25 + width / 4.421});
$("#droptt").css({top: imgPos.top - 25 + height/1.3091, left: imgPos.left - 25 + width / 8.8941});
$("#dropza").css({top: imgPos.top - 25 + height/2.88, left: imgPos.left - 25 + width / 2.3406});

let kraje = {ba: false, bb: false, tn: false, tt:false, ke:false, za:false, nr:false, po:false};

let time = 0;

console.log(imgPos.top, imgPos.left, imgPos.top + $('#okraj').height(), imgPos.top + $('#okraj').width());

// drag

document.querySelectorAll('.kraj').forEach(item => {
	item.onmousedown = function(event) {
		let mousePos = {x: 0, y: 0};
		setCorrect(item, false);
	  	item.style.position = 'absolute';
	  	item.style.zIndex = 10;

	  	document.body.append(item);

	  	function moveAt(pageX, pageY) {
	   	 	item.style.left = pageX - $("#"+item.id).width() / 2 + 'px';
	   	 	item.style.top = pageY - $("#"+item.id).height() / 2 + 'px';
	  	}

	  	moveAt(event.pageX, event.pageY);

	  	function onMouseMove(event) {
	    	moveAt(event.pageX, event.pageY);
	    	mousePos.x = event.pageX;
	    	mousePos.y = event.pageY;
	  	}

	  	document.addEventListener('mousemove', onMouseMove);

	  	item.onmouseup = function() {
	  		console.log(mousePos);
	  		if(checkDropPosition(item, mousePos)){
	  			setImg(item);
	  		};
	  		setTimeout(() => { 
		  		if(checkEnd())
		  			window.alert("Poskladané v čase: "+ printClock());
		  	},50);
	    	document.removeEventListener('mousemove', onMouseMove);
	    	item.onmouseup = null;
	  	};

		};

	item.ondragstart = function() {
	  	return false;
	};
});

// kontrola pozicie pustenia casti

function checkDropPosition(item, mousePos){
	let id = "drop"+item.id;
	let dropPosition = $("#"+id).position();
	let left = mousePos.x - dropPosition.left;
	let right = left - 50;
	let top = mousePos.y - dropPosition.top;
	let bottom = top -50;

	if(left>0 && right<0 && top>0 && bottom<0)
		return true;


	return false;
}

// ulozenie casti do dropboxu

function setImg(item){
	let id = "drop"+item.id;

	let dropPos = $("#"+id).position();

	let leftPos =  dropPos.left+$("#"+id).width()/2-$("#"+item.id).width()/2;
	let topPos = dropPos.top+$("#"+id).height()/2-$("#"+item.id).height()/2;

	$("#"+item.id).css({top: topPos, left: leftPos});


	setCorrect(item, true);
}

let timer = false;

// handler pre start casovaca

$("#start").click(function(){
	timer = true;
	startClock();
})

// Casovac

function startClock(){
	$("#time").text(printClock());
	setTimeout(() => { 
		if(timer){ 
			time++; 
			$("#time").text(printClock());
			startClock(time);
		} 
	}, 1000);
}

function printClock(){
	let timeStr = "";
	let minutes = 0;
	if(time>59){
		minutes = Math.floor(time/60);
		time = time%60;
		if(minutes<9)
			timeStr="0"
	}
	timeStr += minutes + ":";
	if(time<10){
		timeStr += "0";
	}
	timeStr += time;
	return timeStr;
}

// handler pre demo

$("#demo").click(function(){
	timer = false;
	time = 0;
	setPosition();
})

// nastavenie casti do ich pozicii

function setPosition(){
	document.querySelectorAll('.kraj').forEach(item =>{

	  	item.style.position = 'absolute';
		setImg(item);
	})
	checkEnd();
}

function setCorrect(item, bool){
	let id = item.id;
	kraje[id] = bool;
}

// kontrola ci su vsetky casti ulozene spravne

function checkEnd(){
	let correct = 0;
	for(const i in kraje){
		if(kraje[i]){
			correct++;
		}
	}
	correctPlace = correct;
	setCorrectText(correct);
	if (correct < 8) {
		return false;
	}
	timer = false;
	return true;
}

// vypis pocet spravne ulozenych casti

function setCorrectText(correct){
	$("#spravne").text("Správne: "+correct+"/8");
}