// Global player elements
var audio = document.getElementById("audio");
var sourceMP3 = document.getElementById("sourceMP3");
var timeSlider = document.getElementById("timeBar");
var playBtn = document.getElementById("playBtn");
var randomBtn = document.getElementById("randomBtn");
var volumeSlider = document.getElementById("volumeSlider");
var nextBtn = document.getElementById("nextBtn");
var previousBtn = document.getElementById("previousBtn");
var repeatBtn = document.getElementById("repeatBtn");
var titleText = document.getElementById("titleText");
var albumText = document.getElementById("albumText");
var artistText = document.getElementById("artistText");
var timeText = document.getElementById("timeText");
var log = document.getElementById("log");
var brepeat = new Boolean();
var PLAY_ICON = "icons/32/play-32.png";
var PAUSE_ICON = "icons/32/pause-32.png";
var brepeat_0_ICON = "icons/32/repeat-32_false.png";
var brepeat_1_ICON = "icons/32/repeat-32_true.png";


// ================ Add properties and methods to the playlist object
var playlist = {};
// Add tracks in the playlist
playlist.list = trackList;
// The index of the track currently being played
playlist.activeTrack = 0;
// Moves to the next track, loops if reaches end
playlist.next = function() {
    if (this.activeTrack == this.list.length - 1)
      this.activeTrack = 0;
    else
      this.activeTrack +=1;
  };
// Moves to the previous track
playlist.previous = function() {
    if (this.activeTrack == 0)
      this.activeTrack = this.list.length - 1;
    else
      this.activeTrack -= 1;
  };
// Returns the track currently being played
playlist.getActive = function() {
    return this.list[this.activeTrack];
}

var lrcObj = {};
lrcObj.timecodes = [];
lrcObj.lines = [];
lrcObj.index = 0;
lrcObj.getCurrTimecode = function(i){
  return this.timecodes[i];
}
lrcObj.getNextTimecode = function(i){
  return (i==this.timecodes.length-1) ? audio.duration : this.timecodes[i+1];
}
  
// ===================== On load set the default values to the audio element 
sourceMP3.src = playlist.getActive().src;
audio.load();
audio.currentTime = 0;

// On load start show the tracks title,artist etc
audio.addEventListener("loadeddata",function(){
  var filename = playlist.getActive().src;
  
  titleText.textContent = playlist.getActive().name || "Unknown Title";
  albumText.textContent = playlist.getActive().album || "Unknown Album";
  artistText.textContent = playlist.getActive().artist || "Unknown Artist";
});

// ===================== Buttons
// Play Button
playBtn.addEventListener("click",function(){
  if (audio.paused) {
    audio.play();
  }
  else {
    audio.pause();
  }
});


document.getElementById("slideContainer").innerHTML = showSongList();
loadLyric(lrcObj, playlist.getActive().lrc);


// Random Button
randomBtn.addEventListener("click",function(){
  brepeat = false;
  repeatBtn.firstElementChild.src = brepeat_0_ICON;
  shuffle(playlist.list)
  document.getElementById("slideContainer").innerHTML = showSongList();
  loadLyric(lrcObj, playlist.getActive().lrc);
  loadNewTrack(playlist.getActive().src);
});

//Next Button
nextBtn.addEventListener("click",function(){
  brepeat = false;
  repeatBtn.firstElementChild.src = brepeat_0_ICON;
  playlist.next();
  document.getElementById("slideContainer").innerHTML = showSongList();
  loadLyric(lrcObj, playlist.getActive().lrc);
  loadNewTrack(playlist.getActive().src);
});

//Previous button
previousBtn.addEventListener("click",function(){
  brepeat = false;
  repeatBtn.firstElementChild.src = brepeat_0_ICON;
  playlist.previous();
  document.getElementById("slideContainer").innerHTML = showSongList();
  loadLyric(lrcObj, playlist.getActive().lrc);
  loadNewTrack(playlist.getActive().src);
});

//Repeat button
repeatBtn.addEventListener("click",function(){
	if (brepeat == false)
	{
		repeatBtn.firstElementChild.src = brepeat_1_ICON;
		brepeat = true;
	}
	else
	{
		repeatBtn.firstElementChild.src = brepeat_0_ICON;
		brepeat = false;
	};
});


audio.addEventListener("play",function(){playBtn.firstElementChild.src = PAUSE_ICON;},false);
audio.addEventListener("pause",function(){playBtn.firstElementChild.src = PLAY_ICON;},false);

// ======================= Volume Control

// Setup volume slider using sliderfy.js
sliderfy(volumeSlider);
audio.volume = 1;
volumeSlider.addEventListener("change",function(){
  audio.volume = volumeSlider.sliderValue;
});

// ======================= Time Control
// Setup time slider using sliderfy,js
sliderfy(timeSlider);
// timeText.textContent = "0:00";// Not working at all!!!!!!!!!!!!!!
// On time update
timeUpdateCallback = function(){
    timeSlider.firstElementChild.style.width = (audio.currentTime/audio.duration) *timeSlider.offsetWidth + "px";
    var seconds = Math.floor(audio.currentTime % 60);
    var minutes = Math.floor(audio.currentTime / 60);
    var duration = (audio.duration?(Math.floor(audio.duration/60)+":"+(Math.floor(audio.duration%60)<10?"0":"")+Math.floor(audio.duration%60)):"-:--")
    
    timeText.textContent = minutes+":"+ (seconds<10?"0"+seconds:seconds) + " / " + duration;
  
    // log.textContent = "Duration: " + audio.duration + "Current: "+ audio.currentTime;
}
audio.addEventListener("timeupdate",timeUpdateCallback,false);
// Update lyric on time
updateLyric = function(){
  console.log(lrcObj.index)
  if(audio.currentTime < lrcObj.getCurrTimecode(lrcObj.index))
  {
    document.getElementById("lrc_"+lrcObj.index).style["color"] = "";
    do{
      lrcObj.index--;
    }while(audio.currentTime < lrcObj.getCurrTimecode(lrcObj.index))
    document.getElementById("lrc_"+lrcObj.index).style["color"] = "red";
  }else if(audio.currentTime > lrcObj.getNextTimecode(lrcObj.index)) {
    document.getElementById("lrc_"+lrcObj.index).style["color"] = "";
    do{
      lrcObj.index++;
    }while(audio.currentTime > lrcObj.getNextTimecode(lrcObj.index))
    document.getElementById("lrc_"+lrcObj.index).style["color"] = "red";
  }else{
    return;
  }
}
audio.addEventListener("timeupdate",updateLyric,false);

// On change
timeSlider.addEventListener("change", function(){
  audio.removeEventListener("timeupdate",timeUpdateCallback,false);
  audio.removeEventListener("timeupdate",updateLyric,false);
  audio.currentTime = timeSlider.sliderValue * audio.duration;
  audio.addEventListener("timeupdate",timeUpdateCallback,false);
  audio.addEventListener("timeupdate",updateLyric,false);
});

// On ended
audio.addEventListener("ended",function(){
	if(brepeat == false)
	{
		playlist.next();
	}
  document.getElementById("slideContainer").innerHTML = showSongList();
  loadLyric(lrcObj, playlist.getActive().lrc);
	loadNewTrack(playlist.getActive().src);
});

/**
 * Loads a new track on the audio elementFromPoint
 * @sourceString The source of the new track
 */
function loadNewTrack(sourceString){
  sourceMP3.src = sourceString;
  audio.load();
  audio.play();
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function showSongList(){
  var i = 0;
  var str = '<ul>';
  playlist.list.forEach(function(l) {
    if (i == playlist.activeTrack) {
      str += '<li id="activeTrack">' + l.name + '</li>'
    } else {
      str += '<li>' + l.name + '</li>'
    }
    i += 1
  });
  str += '</ul>';
  return str;
}

function loadLyric(lrcObj, lrcPath, offset = (playlist.getActive().offset == null) ? 0 : playlist.getActive().offset) {
  fetch(lrcPath)
  .then(response => response.text())
  .then(data => {
    var newDOM = '<ul>';
    lrcObj.timecodes = [];
    lrcObj.lines = [];
    lrcObj.index = 0;
    data = data.split(/[\[\]]/);
    for(var i = 0; i <= data.length/2-1; i++){
      let timecode = data[2*i+1].split(/[\:\.]/);
      lrcObj.timecodes.push(timecode[0]*60 + timecode[1]*1 + timecode[2]*0.01 + offset);
      lrcObj.lines.push(data[2*i+2]);
      newDOM += '<li id="lrc_' + i + '">' + lrcObj.lines[i] + '</li>';
    }
    newDOM += '</ul>';
    document.getElementById("lyricContainer").innerHTML = newDOM;
    document.getElementById("lrc_0").style["color"] = "red";
    lrcObj.timecodes[0] = 0;
    console.log(lrcObj.timecodes);
  });
};

  function offset(offset) {
    loadLyric(lrcObj, playlist.getActive().lrc, offset);
  }