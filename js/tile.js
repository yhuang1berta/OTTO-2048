(function() {
  'use strict';
  if (typeof JSGame === 'undefined'){
    window.JSGame = {};
  }


  var Tile = JSGame.Tile = function(board, pos, value){
    this.board = board;
    this.pos = pos || board.findEmpty();
    this.value = value || this.assignStartingValue();
    // this.render_value = values.get(this.value);
    this.merged = false;
    this.new = true;
  };


  Tile.prototype.assignStartingValue = function(){
    var rand = Math.random();
    if (rand < 0.8){
      return 2;
    }else{
      return 4;
    }
  };

  Tile.prototype.addDirection = function(direction){
    return([this.pos[0] + direction[0], this.pos[1] + direction[1]]);
  };

  var srcs = [
    './audio/success/1.wav',
    './audio/success/2.wav',
    './audio/success/3.wav',
    './audio/success/4.wav',
    './audio/success/5.wav',
    './audio/success/6.wav',
    './audio/success/7.wav',
    './audio/success/8.wav',
    './audio/success/9.wav',
    './audio/success/10.wav',
    './audio/success/11.wav',
    './audio/success/12.wav',
    './audio/success/13.wav',
    './audio/success/14.wav',
    './audio/success/15.wav',
    './audio/success/16.wav',
    './audio/success/17.wav',
    './audio/success/18.wav',
    './audio/success/19.wav',
    './audio/success/20.wav',
    './audio/success/21.wav',
    './audio/success/22.wav',
    './audio/success/23.wav',
    './audio/success/24.wav',
    './audio/success/25.wav',
    './audio/success/26.wav',
  ]

  Tile.prototype.move = function(direction){
    var newPos = this.addDirection(direction);
    while (this.board.isOnBoard(newPos)){
      if (this.board.isEmptySquare(newPos)){
        this.board.clearSquare(this.pos);
        this.pos = newPos;
        this.board.moved = true;
      }else if(!this.merged && this.match(this.board.grid[newPos[0]][newPos[1]]) && !this.board.grid[newPos[0]][newPos[1]].merged ){
        var match = this.board.grid[newPos[0]][newPos[1]];
        this.mergeInto(match);
        this.board.moved = true;
      }else if (!this.match(this.board.grid[newPos[0]][newPos[1]])){
        break;
      }
      newPos = [newPos[0] + direction[0], newPos[1] + direction[1]];
    }
    playAudio(srcs[Math.floor(Math.random() * srcs.length)]);

    this.new = false;
    this.resetKlass();
    this.board.addTile(this.pos, this);
    this.merged = false;
  };

  var playAudio = (audioFile="",v=0.4)=>{
    var audio = new Audio(audioFile);
    audio.volume = v;
    if(audio) audio.play();
  }

  Tile.prototype.mergeInto = function(other){
    this.board.score += this.value;
    this.value += other.value;
    let audioArr;
    if (this.value === 2048){
      playAudio("./audio/win/1.wav",1);
      this.board.won = true;
    } else if (this.value === 4) {
      audioArr = [
        './audio/4/1.wav',
        './audio/4/2.wav',
        './audio/4/3.wav',
        './audio/4/4.wav',
        './audio/4/5.wav',
        './audio/4/6.wav',
      ]
      playAudio(audioArr[Math.floor(Math.random() * audioArr.length)]);
    }
    if (this.value === 8) {//有数字为8的方块被合成
        //self.PlaySound("Play3");
        // // luigi-修改点-2
        audioArr = [
          './audio/8/1.wav',
          './audio/8/2.wav',
          './audio/8/3.wav',
          './audio/8/4.wav',
          './audio/8/5.wav',
          './audio/8/6.wav',
        ]
        playAudio(audioArr[Math.floor(Math.random() * audioArr.length)]);
        // luigi-修改点-2-over
    }

    if (this.value === 16) {//有数字为16的方块被合成
        audioArr = [
            './audio/16/1.wav',
            './audio/16/2.wav',
            './audio/16/3.wav',
            './audio/16/4.wav',
            './audio/16/5.wav',
            './audio/16/6.wav',
        ]
        playAudio(audioArr[Math.floor(Math.random() * audioArr.length)]);
        // luigi-修改点-2-over
    }

    if (this.value === 32) {//有数字为32的方块被合成
        playAudio('./audio/32/1.wav')
        // luigi-修改点-2-over
    }


    if (this.value === 64) {//有数字为64的方块被合成
        audioArr = [
            './audio/64/1.wav',
            './audio/64/2.wav',
            './audio/64/3.wav'
        ]
        playAudio(audioArr[Math.floor(Math.random() * audioArr.length)]);
        // luigi-修改点-2-over
    }

    if (this.value === 128) {//有数字为128的方块被合成
        audioArr = [
            './audio/128/1.wav',
            './audio/128/2.wav',
            './audio/128/3.wav'
        ]
        playAudio(audioArr[Math.floor(Math.random() * audioArr.length)]);
        // luigi-修改点-2-over
    }
    if (this.value === 256) {//有数字为256的方块被合成
        playAudio('./audio/256/1.wav')
        // luigi-修改点-2-over
    }
    if (this.value === 512) {//有数字为512的方块被合成
        audioArr = [
            './audio/512/1.wav',
            './audio/512/2.wav'
        ]
        playAudio(audioArr[Math.floor(Math.random() * audioArr.length)]);
        // luigi-修改点-2-over
    }
    if (this.value === 1024) {//有数字为1024的方块被合成
        playAudio('./audio/1024/1.wav')
        // luigi-修改点-2-over
    }

    this.board.clearSquare(this.pos);
    other.$el.remove();
    this.pos = other.pos;
    this.merged = true;
  };

  Tile.prototype.match = function(other) {
    return this.value === other.value;
  };


  Tile.prototype.canBeMoved = function(){
    var directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0]
    ];
    var testSquare;
    var pos;
    for (var i = 0; i < directions.length; i++) {
      pos = this.addDirection(directions[i]);
      if (this.board.isOnBoard(pos)){
        testSquare = this.board.grid[pos[0]][pos[1]];
        if (this.board.isEmptySquare(pos) || this.match(testSquare)){
          return true;
        }
      }
      }
    return false;
  };

  Tile.prototype.render = function(){
    var klass = this.klass();
    var display = $("<div></div>");
    display.addClass(klass);
    $(".game div").eq(0).append(display);
    this.$el = display;
  };

  Tile.prototype.klass = function(){
    var klass = "tile tile_" + this.pos[0] + this.pos[1];
    // klass += " value_" + values.get(this.value);
    klass += " value_" + this.value;
    if (this.merged){
      klass += " merged";
    }else if (this.new){
      klass += " new"
    }
    return klass;
  };

  Tile.prototype.resetKlass = function(){
    this.$el.removeClass();
    this.$el.addClass(this.klass());
  };


})();
