/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var storyQueue = []; 

$(document).ready(function() {
    var audio = document.getElementById("player_audio");
    audio.addEventListener('timeupdate',function (){
        $("#player_ProgressBar").width(audio.currentTime*100/audio.duration+"%");
    });
});

function clickedPlay() {
    var audio = document.getElementById("player_audio");
    $("#player_btnPlay").html("<span class=\"typcn typcn-media-pause\" onclick=\"clickedPause()\"></span>");
    audio.play();
};

function clickedPause() {
    var audio = document.getElementById("player_audio");
    $("#player_btnPlay").html("<span class=\"typcn typcn-media-play\" onclick=\"clickedPlay()\"></span>");
    audio.pause();
};

function clickedForward() {
    storyQueue.shift();
    var audio = document.getElementById("player_audio");
    audio.src = storyQueue[0].mp3link;
    audio.load(); audio.play();
    $("#player_btnPlay").html("<span class=\"typcn typcn-media-pause\" onclick=\"clickedPause()\"></span>");
    $.get('http://api.npr.org/query?id=1149&numResults=2&apiKey=MDE2OTQ2ODMxMDE0MTI1NDIzODY0YjNiMg001', getnpr);
    console.log(storyQueue);
};

function clickedRewind() {
    var audio = document.getElementById("player_audio");
    audio.currentTime -= 10;
};

function addStoryToUI(story) {
    storyQueue.push(story);
    if (storyQueue.length == 1) {
        var audio = document.getElementById("player_audio");
        audio.src = storyQueue[0].mp3link;
        audio.load();
    }
}