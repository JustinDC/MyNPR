/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var storyQueue = [];
var thumbsUp = 0;

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
    feedback(storyQueue[0], 0+thumbsUp);
    storyQueue.shift();
    nextStory();
    var audio = document.getElementById("player_audio");
    audio.src = storyQueue[0].mp3link;
    audio.load(); audio.play();
    $("#player_btnPlay").html("<span class=\"typcn typcn-media-pause\" onclick=\"clickedPause()\"></span>");
};

function clickedRewind() {
    var audio = document.getElementById("player_audio");
    audio.currentTime -= 10;
};

function clickedLike_TurnOn() {
    thumbsUp = 0.2;
    $("#player_btnLike").html("<span class=\"typcn typcn-arrow-up-thick\" onclick=\"clickedLike_TurnOff()\"></span>");
};
function clickedLike_TurnOff() {
    thumbsUp = 0;
    $("#player_btnLike").html("<span class=\"typcn typcn-arrow-up-outline\" onclick=\"clickedLike_TurnOn()\"></span>");
};

function clickedDislike() {
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
    $("#news0").html(storyQueue[0].title);
    $("#news1").html(storyQueue[1].title);
    $("#news2").html(storyQueue[2].title);
    $("#news3").html(storyQueue[3].title);
    $("#news4").html(storyQueue[4].title);
    $("#news5").html(storyQueue[5].title);
}