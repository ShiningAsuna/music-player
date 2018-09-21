function $(selector){
  return document.querySelector(selector);
}

function $$(selector){
  return document.querySelectorAll(selector);
}

var curIndex = 0;
var musicList = [];
var audio = new Audio();
var rotateDeg = 0;
var rotateSpeed = 0.4;

window.onload = function(){
  $('.album-img').style.width = getComputedStyle($('.album-img')).height;
}

window.onresize = function(){
  $('.album-img').style.width = getComputedStyle($('.album-img')).height;
}

LoadMusicData(function(dataObj){
  var musicDataList = dataObj.data;
  musicList = musicDataList;
  showMusicList(musicDataList);
  LoadMusic(musicDataList[0]);
})

function LoadMusicData(callback){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/music.json', true);
  xhr.onload = function(){
    if(xhr.status>=200 || xhr.status<300 || xhr.status===304){
      callback(JSON.parse(xhr.responseText));
    }
  } 
  xhr.send();
}

function LoadAndPlayMusic(musicObj){
  rotateDeg = 0;
  setBackgroundPic(musicObj);
  setSrc(musicObj);
  playMusic(musicObj);
  setBottomBar(musicObj);
}

function LoadMusic(musicObj){
  rotateDeg = 0;
  setBackgroundPic(musicObj);
  setSrc(musicObj);
  setBottomBar(musicObj);
}

function showMusicList(musicDataList){
  musicDataList.forEach(function(node){
    var author = node.author;
    var name = node.name;
    var li = document.createElement('li');
    li.innerText = name + ' - ' + author;
    $('.music-list ul').appendChild(li);
  });
}

function setBackgroundPic(musicObj){
  var albumImg = musicObj['album-img'];
  $('.album-img img').src = albumImg;
  $('.album-bac').style.backgroundImage = 'url(' + albumImg + ')';
}

function setSrc(musicObj){
  var src = musicObj['src'];
  audio.src = src;
}

function playMusic(musicObj){
  var src = musicObj['src'];
  audio.src = src;
  audio.play();
}

function setBottomBar(musicObj){
  var singerImg = musicObj['singer-img'];
  var author = musicObj.author;
  var name = musicObj.name;
  $('.music-name').innerText = name;
  $('.author').innerText = author;
  $('.singer-img').style.backgroundImage = 'url(' + singerImg + ')';
}

$('#play').addEventListener('click', function(){
  if(audio.paused){
    audio.play();
    this.classList.remove('icon-icon-test1');
    this.classList.add('icon-icon-test');
  } else {
    audio.pause();
    this.classList.remove('icon-icon-test');
    this.classList.add('icon-icon-test1');
  }
});

$('#previous').addEventListener('click', function(){
  curIndex = curIndex === 0 ? musicList.length-1 : curIndex - 1;
  LoadAndPlayMusic(musicList[curIndex]);
});

$('#next').addEventListener('click', function(){
  curIndex = curIndex === musicList.length-1 ? 0 : curIndex + 1;
  LoadAndPlayMusic(musicList[curIndex]);
})

$('#loop').addEventListener('click', function(){
  if(audio.loop){
    audio.loop = false;
    this.classList.remove('icon-danquxunhuan1');
    this.classList.add('icon-liebiaoxunhuan');
  } else {
    audio.loop = true;
    this.classList.remove('icon-liebiaoxunhuan');
    this.classList.add('icon-danquxunhuan1');
  }
})

$('.music-list').addEventListener('click', function(e){
  var curNode = e.target;
  this.querySelectorAll('li').forEach(function(node, index){
    if(node === curNode){
      curIndex = index;
      LoadAndPlayMusic(musicList[curIndex]);
    }
  })
})

$('.progress').addEventListener('click', function(e){
  var sumLength = parseInt(getComputedStyle($('.sum-bar')).width);
  var percent = e.offsetX/sumLength;
  audio.currentTime = audio.duration * percent;
})

$('.volume-bar').addEventListener('click', function(e){ 
  var sumLength = parseInt(getComputedStyle($('.sum-volume')).width);
  var percent = e.offsetX/sumLength;
  audio.volume = percent;
})

$('#volume-icon').addEventListener('click', function(){
  if(audio.volume > 0){
    audio.volume = 0;
  } else {
    audio.volume = 1;
  }
})

audio.addEventListener('play', function(){
  $$('.music-list li').forEach(function(node){
    node.classList.remove('active');
  });
  $('.music-list li:nth-child(' + (curIndex + 1) + ')').classList.add('active');
  $('#play').classList.remove('icon-icon-test1');
  $('#play').classList.add('icon-icon-test');
})

audio.addEventListener('timeupdate', function(){
  var curPersent = audio.currentTime/audio.duration;
  var sumLength = parseInt(getComputedStyle($('.sum-bar')).width);
  $('.cur-bar').style.width = Math.floor(curPersent * sumLength) + 'px';
  var minute = Math.floor(audio.currentTime/60);
  var second = Math.floor(audio.currentTime)%60 + '';
  second = second.length === 2 ? second : '0' + second;
  $('.bottom-bar .time').innerText = minute + ':' +second;
  rotateDeg = rotateDeg + rotateSpeed;
  $('.album-img img').style.transform = 'rotate(' + rotateDeg % 360  + 'deg)';
})

audio.addEventListener('ended', function(){
  curIndex = curIndex === musicList.length-1 ? 0 : curIndex + 1;
  LoadAndPlayMusic(musicList[curIndex]);
})

audio.addEventListener('volumechange', function(){
  var sumLength = parseInt(getComputedStyle($('.sum-volume')).width);
  if(audio.volume > 0.5){
    $('#volume-icon').classList.remove('icon-icon-test7');
    $('#volume-icon').classList.remove('icon-icon-test6');
    $('#volume-icon').classList.add('icon-icon-test8');
  } else if(audio.volume === 0) {
    $('#volume-icon').classList.remove('icon-icon-test7');
    $('#volume-icon').classList.remove('icon-icon-test8');
    $('#volume-icon').classList.add('icon-icon-test6');
  } else {
    $('#volume-icon').classList.remove('icon-icon-test6');
    $('#volume-icon').classList.remove('icon-icon-test8');
    $('#volume-icon').classList.add('icon-icon-test7');
  }
  $('.cur-volume').style.width = sumLength * audio.volume + 'px';
})

// 1.列表隐藏
// 2.循环模式
// 3.音量调节

