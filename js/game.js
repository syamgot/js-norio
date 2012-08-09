(function() {

	var version = '0.1.1';
	var system;
	var imagePath = {
		  redBtn 		: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/red_btn.png'
		, yellowBtn 	: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/yellow_btn.png'
		, upBtn 		: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/up_btn.png'
		, downBtn 		: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/down_btn.png'
		, rightBtn 		: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/right_btn.png'
		, leftBtn 		: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/left_btn.png'
		, norioStanding : 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/norio_standing.png'
		, norioRunning 	: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/norio_running.png'
		, norioBraking 	: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/norio_braking.png'
		, norioJumping 	: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/norio_jumping.png'
		, norioDying 	: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/norio_dying.png'
		, block 		: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/block.png'
		, coin 			: 'http://lab.syamgot.com/js/arctic/norio/'+version+'/images/coin.png'
	    };

	var imagePaths = [
		  imagePath.redBtn
		, imagePath.yellowBtn 	
		, imagePath.upBtn 		
		, imagePath.downBtn 		
		, imagePath.rightBtn 		
		, imagePath.leftBtn 
		, imagePath.norioStanding 
		, imagePath.norioRunning 	
		, imagePath.norioBraking 	
		, imagePath.norioJumping 	
		, imagePath.norioDying 	
		, imagePath.block 	
		, imagePath.coin 	
		];
	
	function initialize(e){
	
		system = new arc.System(320, 420, 'canvas');
		system.setGameClass(Main, {});
		system.addEventListener(arc.Event.PROGRESS, function(e){
			 console.log(e.loaded + ", " + e.total);
		});
		system.addEventListener(arc.Event.COMPLETE, function(){
			console.log('loaded');
		});
	 
		system.load(imagePaths);
	}


	var Main = arc.Class.create(arc.Game, {

		  logger:null	
		, pad:null
		, norio:null
		, norioInput:null
		, collisions:null

		, initialize : function () {

			this.norio = new Norio();
			this.addChild(this.norio.getDisp());
			this.norio.setX(50);

			this.collisions = [];

			var b = new Block(-20, 0, 20, 320);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(320, 0, 20, 320);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(0, 320, 320, 100);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(192, 64, 80, 16);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(32, 96, 80, 16);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(160, 128, 80, 16);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(128, 192, 80, 16);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var b = new Block(96, 256, 80, 16);
			this.addChild(b.getDisp());
			this.collisions.push(b);

			var c = new Coin(96, 32);
			this.addChild(c.getDisp());
			this.collisions.push(c);

			var c = new Coin(136, 178);
			this.addChild(c.getDisp());
			this.collisions.push(c);

			var c = new Coin(148, 178);
			this.addChild(c.getDisp());
			this.collisions.push(c);

			var c = new Coin(160, 178);
			this.addChild(c.getDisp());
			this.collisions.push(c);

			var c = new Coin(172, 178);
			this.addChild(c.getDisp());
			this.collisions.push(c);

			this.norioInput = new NorioInput();

			this.pad = new Pad(this);
			this.addChild(this.pad.getDisp());
			this.pad.setX(16); this.pad.setY(336);

			this.norioInput.addUI(this.pad);

			if (!arc.ua.isMobile) { 
				this.keyBoard = new KeyBoard(); 
				this.norioInput.addUI(this.keyBoard);
			}

			// this.logger = new Logger(4);
			// this.addChild(this.logger.getDisp());
		}
	 
		, update:function()
		{
			var o = this;
			o.norioInput.reflesh();
			o.norio.reflesh(o.norioInput, o.collisions);
		}
	
	});
	
	window.addEventListener('DOMContentLoaded', initialize, false);


	var Norio = arc.Class.create({
	
		initialize:function() {
			var o = this;
			
			o.disp = new arc.display.MovieClip();
			o.hit = new arc.display.Shape();
			o.hit.beginFill(0xff0000, 0.0);
			o.hit.drawRect(0, 0, 12, 16);
			o.hit.setX(2);
			o.hit.setY(0);
			o.hit.endFill();
			o.disp.addChild(o.hit);

			o.norioStanding = new arc.display.Sprite(system.getImage(imagePath.norioStanding));
			o.norioRunning 	= new arc.display.SheetMovieClip(
									system.getImage(imagePath.norioRunning), 16, 24, true, false);
			o.norioBraking 	= new arc.display.Sprite(system.getImage(imagePath.norioBraking));
			o.norioJumping 	= new arc.display.Sprite(system.getImage(imagePath.norioJumping));
			o.norioDying 	= new arc.display.Sprite(system.getImage(imagePath.norioDying));

			o._setChar(o.norioStanding);
		}

		, disp 			: null
		, hit 			: null
		, char 			: null
		, norioStanding : null
		, norioRunning 	: null
		, norioBraking 	: null
		, norioJumping 	: null
		, norioDying 	: null

		, _dx 			: 0.0
		, _dy 			: 0.0 
		, _ax 			: 0.5
		, _ay 			: 8.0
		, _gx 			: 0.85
		, _gy 			: 0.4
		, _dxMax 		: 3.0 
		, _dyMax 		: 8.0 

		, _direc 		: 0
		, _jumping 		: true 

		, x 			: 0
		, y 			: 0

		, _offsetX		: 0
		, _offsetY 		: 0

		, _setChar : function(dispObj) {
			var o = this;
			if (o.char == dispObj) { return; }
			if (o.char != null) {o.disp.removeChild(o.char);}
			o.char = dispObj;
			o.disp.addChild(o.char);
		}

		, reflesh:function(input, collisions) {
			var o = this;

			o.x = o.disp.getX();
			o.y = o.disp.getY();

			// 入力判定
			if (input.aBtnDown && !o._jumping) {
				o._dy = -o._ay;
				o._jumping = true;
			} else if (input.downBtnDown) {
				// o._dy += o._ay;
			}
			if (input.leftBtnDown) {
				o._dx -= o._ax;
				o._direc = -1;
			} else if (input.rightBtnDown) {
				o._dx += o._ax;
				o._direc = 1;
			} else {
				o._direc = 0;
			}
			o._dx *= o._gx; // 摩擦
			o._dy += o._gy; // 重力
			o._dx = o._dx > o._dxMax ? o._dxMax : o._dx < -o._dxMax ? -o._dxMax : o._dx;
			o._dy = o._dy > o._dyMax ? o._dyMax : o._dy < -o._dyMax ? -o._dyMax : o._dy;

			// 移動量を計上
			o.x += o._dx; o.y += o._dy;
			o.disp.setX(o.x); o.disp.setY(o.y);

			// 衝突判定
			var hit = false;
			var oRec = o.getRect();
			for (var i = 0; i < collisions.length; i++) {
				var tRec = collisions[i].getRect();
				if (o.hitTest(tRec)) {
					
					if (collisions[i].type == 1) {
						collisions[i].hide();
					} else {
						if (o._dy > 0) {
							if (oRec[1] + oRec[3] - tRec[1] < 10) { o._offsetY = -(oRec[1] + oRec[3] - tRec[1]); hit = true;}
						} else {
							if (tRec[1] + tRec[3] - oRec[1] < 10) { o._offsetY =   tRec[1] + tRec[3] - oRec[1];}
						}
						if (o._dx > 0) {
							if (oRec[0] + oRec[2] - tRec[0] < 10) { o._offsetX = -(oRec[0] + oRec[2] - tRec[0]);}
						} else {
							if (tRec[0] + tRec[2] - oRec[0] < 10) { o._offsetX =   tRec[0] + tRec[2] - oRec[0];}
						}
					}
				}
			}

			// 着地&頭上判定
			if (o._offsetY < 0 && o._jumping) 	{ o._jumping = false; o._dy = 0; } // 着地
			if (!hit && !o._jumping) 			{ o._jumping = true;  o._dy = 0; } // 落下
			if (o._offsetY > 0 && o._jumping) 	{ o._dy = 0; }

			// のめり込み補正
			o.x += o._offsetX;
			o.y += o._offsetY;
			o.disp.setX(o.x); o.disp.setY(o.y);

			// 補正値をクリア
			o._offsetY = o._offsetX = 0;

			// reflesh character image
			if (o._jumping) {
				o._setChar(o.norioJumping);
			} else {
				if (o._direc == 0) {
					o._setChar(o.norioStanding);
				} else {
					if ((o._dx > 0 && o._direc < 0)
					 || (o._dx < 0 && o._direc > 0)) {
						o._setChar(o.norioBraking);
					} else {
						o._setChar(o.norioRunning);
						if (!o.norioRunning.playing) {
							o.norioRunning.playing = true;
							o.norioRunning.play();
						}
					}
				}
			}


			// XXX んーな判定
			if (o._dx < 0) {
				o.char.setScaleX(-1);
				o.char.setX(-(o.char.getWidth()));
			} else if (o._dx > 0) {
				o.char.setScaleX(1);
				o.char.setX(0);
			}

		}


		, hitTest : function (tRec) {
			var oRec = this.getRect();
			var x0 = oRec[0]; var x1 = oRec[0] + oRec[2]; var x2 = tRec[0]; var x3 = tRec[0] + tRec[2];
			var y0 = oRec[1]; var y1 = oRec[1] + oRec[3]; var y2 = tRec[1]; var y3 = tRec[1] + tRec[3];
			return (x0 < x3 && x2 < x1 && y0 < y3 && y2 < y1); 
		}

		, hitTest2:function(tRec) {
			var o = this;
			var oRec = o.getRect();
			if (o.hitTest(tRec)) {
				if (o._vy > 0) {
					if (oRec[1] + oRec[3] - tRec[1] < 10) { o._offsetY = -(oRec[1] + oRec[3] - tRec[1]);}
				} else {
					if (tRec[1] + tRec[3] - oRec[1] < 10) { o._offsetY =   tRec[1] + tRec[3] - oRec[1];}
				}
				if (o._vx > 0) {
					if (oRec[0] + oRec[2] - tRec[0] < 10) { o._offsetX = -(oRec[0] + oRec[2] - tRec[0]);}
				} else {
					if (tRec[0] + tRec[2] - oRec[0] < 10) { o._offsetX =   tRec[0] + tRec[2] - oRec[0];}
				}
				return true;
			} else {
				return false;
			}
		}

		, setX:function(val) { this.disp.setX(val); }
		, setY:function(val) { this.disp.setY(val); }
		, getDisp : function() { return this.disp; }
		, getRect : function() { return [this.disp.getX(), this.disp.getY(), this.hit.getWidth(), this.hit.getHeight()];}
	});

	var NorioInput = arc.Class.create({
		  initialize:function() {}
		
		, _uis 			: []
		, aBtnDown 		: false
		, bBtnDown 		: false
		, upBtnDown 	: false
		, downBtnDown 	: false
		, rightBtnDown 	: false
		, leftBtnDown 	: false

		, clear : function() {
			var o = this;
			o.aBtnDown = o.bBtnDown = o.upBtnDown = o.downBtnDown = o.rightBtnDown = o.leftBtnDown = false;
		}
		
		, reflesh : function () {
			var o = this;
			o.clear();
			var n = o._uis.length;
			for (var i = 0; i < n; i++) {
				if (!o.aBtnDown) 	{ o.aBtnDown 		= o._uis[i].aBtnDown }; 
				if (!o.bBtnDown) 	{ o.bBtnDown 	 	= o._uis[i].bBtnDown };	
				if (!o.upBtnDown)	{ o.upBtnDown 	 	= o._uis[i].upBtnDown};
				if (!o.downBtnDown) { o.downBtnDown 	= o._uis[i].downBtnDown}; 	
				if (!o.rightBtnDown){ o.rightBtnDown	= o._uis[i].rightBtnDown}; 	
				if (!o.leftBtnDown)	{ o.leftBtnDown 	= o._uis[i].leftBtnDown}; 	
			}
		}

		, addUI : function(ui) {
			this._uis.push(ui);
		}

		, toString : function() {
			var o = this;
			var buf = "";
			buf += o.aBtnDown 		? "A" : "";
			buf += o.bBtnDown 		? "B" : "";
			buf += o.upBtnDown 		? "U" : "";
			buf += o.downBtnDown 	? "D" : "";
			buf += o.rightBtnDown 	? "R" : "";
			buf += o.leftBtnDown 	? "L" : "";
			return buf;	
		}
	});


	var Block = arc.Class.create({
		initialize:function(x, y, width, height) {
			var o = this;
			
			o.disp = new arc.display.MovieClip();

			o.bg = new arc.display.Shape();
			o.bg.beginFill(0xC67100, 1);
			// o.bg.drawRect(0, 0, 30, 30);
			o.bg.drawRect(0, 0, width, height);
			o.bg.endFill();
			o.disp.addChild(o.bg);

			o.disp.setX(x);
			o.disp.setY(y);
		}

		, disp 			: null
		, bg 			: null
		, type 			: 0

		, setX:function(val) { this.disp.setX(val); }
		, setY:function(val) { this.disp.setY(val); }
		, getDisp : function() { return this.disp; }
		, getRect : function() { return [this.disp.getX(), this.disp.getY(), this.disp.getWidth(), this.disp.getHeight()];}
	});
	
	var Coin = arc.Class.create({
		initialize:function(x, y) {
			var o = this;
			
			o.disp = new arc.display.MovieClip();

			o.bg = new arc.display.Shape();
			o.bg.beginFill(0xC67100, 1);
			o.bg.drawRect(0, 0, 8, 14);
			o.bg.endFill();
			o.disp.addChild(o.bg);

			var img = new arc.display.Sprite(system.getImage(imagePath.coin));
			o.disp.addChild(img);

			o.disp.setX(x);
			o.disp.setY(y);
		}

		, disp 			: null
		, bg 			: null
		, type 			: 1

		, hide:function() { this.disp.setVisible(false); }

		, setX:function(val) { this.disp.setX(val); }
		, setY:function(val) { this.disp.setY(val); }
		, getDisp : function() { return this.disp; }
		, getRect : function() { return [this.disp.getX(), this.disp.getY(), this.disp.getWidth(), this.disp.getHeight()];}
	});

	var Pad = arc.Class.create({

		initialize:function() {
			var o = this;

			o.disp = new arc.display.MovieClip();

			o.bg = new arc.display.Shape();
			o.bg.beginFill(0x0, 0);
			o.bg.drawRect(0, 0, 320, 100);
			o.bg.endFill();
			o.disp.addChild(o.bg);

			o._initBtn('aBtn'		, 'aBtnDown'		, imagePath.redBtn		, 256, 16);
			o._initBtn('bBtn'		, 'bBtnDown'		, imagePath.yellowBtn	, 192, 16);
			o._initBtn('rightBtn'	, 'rightBtnDown'	, imagePath.rightBtn	,  27, 22);
			o._initBtn('leftBtn'	, 'leftBtnDown'		, imagePath.leftBtn		,   0, 22);
			o._initBtn('upBtn'		, 'upBtnDown'		, imagePath.upBtn		,  23,  0);
			o._initBtn('downBtn'	, 'downBtnDown'		, imagePath.downBtn		,  23, 25);
		} 
	
		, aBtnDown 		: false
		, bBtnDown 		: false
		, upBtnDown 	: false
		, downBtnDown 	: false
		, rightBtnDown 	: false
		, leftBtnDown 	: false

		, disp 			: null
		, bg 			: null
		, aBtn 			: null
		, bBtn 			: null
		, upBtn 		: null
		, downBtn 		: null
		, rightBtn 		: null
		, leftBtn 		: null
		
		, _initBtn:function(insPropName, statePropName, imgPath, x, y) {
			var o = this;
			o[insPropName] = new arc.display.Sprite(system.getImage(imgPath));
			o.disp.addChild(o[insPropName]);
			o._event(o[insPropName], statePropName);
			o[insPropName].setX(x); o[insPropName].setY(y);
		}

		, _event : function(dispacher, propName) {
			var o = this;
			dispacher.addEventListener(arc.Event.TOUCH_START, function(e){ o[propName] = true; });
			dispacher.addEventListener(arc.Event.TOUCH_END, function(e){ o[propName] = false; });
		}
		
		, getDisp : function() {
			return this.disp;	
		}
		
		, toString : function() {
			var o = this;
			var buf = "";
			buf += o.aBtnDown 		? "A" : "";
			buf += o.bBtnDown 		? "B" : "";
			buf += o.upBtnDown 		? "U" : "";
			buf += o.downBtnDown 	? "D" : "";
			buf += o.rightBtnDown 	? "R" : "";
			buf += o.leftBtnDown 	? "L" : "";
			return buf;	
		}

		, setX:function(val) { this.disp.setX(val); }
		, setY:function(val) { this.disp.setY(val); }

	});

	var KeyBoard = arc.Class.create({
		initialize:function() {
			var o = this;
			document.onkeydown = function(e){
				switch (e.keyCode) {
					case 90 : 
						o.aBtnDown = true;
						break;
					case 37 : // 左矢印 
						o.leftBtnDown = true;
						break;
					case 38 : // 上矢印
						o.upBtnDown = true;
						break;
					case 39 : // 右矢印
						o.rightBtnDown = true;
						break;
					case 40 : // 下矢印
						o.downBtnDown = true;
						break;
				}
			}

			document.onkeyup = function(e){
				switch (e.keyCode) {
					case 90 : 
						o.aBtnDown = false;
						break;
					case 37 : // 左矢印 
						o.leftBtnDown = false;
						break;
					case 38 : // 上矢印
						o.upBtnDown = false;
						break;
					case 39 : // 右矢印
						o.rightBtnDown = false;
						break;
					case 40 : // 下矢印
						o.downBtnDown = false;
						break;
				}
			}
		}

		, aBtnDown 		: false
		, bBtnDown 		: false
		, upBtnDown 	: false
		, downBtnDown 	: false
		, rightBtnDown 	: false
		, leftBtnDown 	: false

		, toString : function() {
			var o = this;
			var buf = "";
			buf += o.aBtnDown 		? "A" : "";
			buf += o.bBtnDown 		? "B" : "";
			buf += o.upBtnDown 		? "U" : "";
			buf += o.downBtnDown 	? "D" : "";
			buf += o.rightBtnDown 	? "R" : "";
			buf += o.leftBtnDown 	? "L" : "";
			return buf;	
		}

	});

	var Logger = arc.Class.create({
	
		initialize:function(rownum) {
			var o = this;

			o.rownum = rownum;
			var h = rownum * 10 + 20;
	
			o.disp = new arc.display.MovieClip();
	
			o.bg = new arc.display.Shape();
			o.bg.beginFill(0x0, 0.4);
			o.bg.drawRect(0, 0, 320, h);
			o.bg.endFill();
			o.disp.addChild(o.bg);
	
			o.tf = new arc.display.TextField();
			o.tf.setColor("0xffffff");
			o.tf.setX(8);
			o.tf.setY(8);
			o.disp.addChild(o.tf);
		} 
	
		// ----------------------------------------
		// properties 
		// ----------------------------------------
		, tf 		: null
		, disp 		: null
		, bg 		: null
		, texts 	: []
		, rownum 	: 4
	
		// ----------------------------------------
		// private methods 
		// ----------------------------------------
		, _log:function(msg) {
			var o = this;
			o.texts.push(msg);
			if(o.texts.length > o.rownum) o.texts.shift();
			var buf = "";
			var i = o.texts.length;
			while(i--) {
				if (i != (o.texts.length - 1)) buf += "\n";
				buf += o.texts[i];
			}
			o.tf.setText(buf);
		}
		
		, _date:function() {
			var d = new Date();
			var buf =  d.getFullYear() + "/"
					 + d.getMonth() + "/"
					 + d.getDate() + " "
					 + d.getHours() + ":"
					 + d.getMinutes() + ":"
					 + d.getSeconds() + "."
					 + d.getMilliseconds();
			return buf;	
		}
		
		// ----------------------------------------
		// public methods 
		// ----------------------------------------
		, getDisp:function() {
			return this.disp;	
		}
		
		, log:function(msg) {
			var o = this;
			// var buf = "[" + o._date() + "] " + msg;
			var buf = msg;
			o._log(buf);
		}
		
		, setX:function(val) { this.disp.setX(val); }
		, setY:function(val) { this.disp.setY(val); }
	});

	


})();



