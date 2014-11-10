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
    feedback(storyQueue[0], 0);
    storyQueue.shift();
    var audio = document.getElementById("player_audio");
    audio.src = storyQueue[0].mp3link;
    audio.load(); audio.play();
    $("#player_btnPlay").html("<span class=\"typcn typcn-media-pause\" onclick=\"clickedPause()\"></span>");
    nextStory();
};

function clickedRewind() {
    var audio = document.getElementById("player_audio");
    audio.currentTime -= 10;
};

function clickedThumbsUp() {
    feedback(storyQueue[0],.2);
};

function clickedThumbsDown() {
    feedback(storyQueue[0],-.2);
    storyQueue.shift();
    var audio = document.getElementById("player_audio");
    audio.src = storyQueue[0].mp3link;
    audio.load(); audio.play();
    $("#player_btnPlay").html("<span class=\"typcn typcn-media-pause\" onclick=\"clickedPause()\"></span>");
    nextStory();
};

function addStoryToUI(story) {
    storyQueue.push(story);
    if (storyQueue.length == 1) {
        var audio = document.getElementById("player_audio");
        audio.src = storyQueue[0].mp3link;
        audio.load();
    }
}