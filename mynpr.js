
var main = function() {
    $.get('http://api.npr.org/query?id=1149&numResults=20&apiKey=MDE2OTQ2ODMxMDE0MTI1NDIzODY0YjNiMg001', getnpr);
}

var queryRunning = false;
var mp3Links = [];
var numStories = 0;

var getnpr = function(nprml) {
	var nprlist = $(nprml).find('list')[0];
	var stories = $(nprlist).find('story');
	queryRunning = true;
	mp3Links = [];
	numStories = stories.length;
	for (var i = 0; i < stories.length; i++) {
		var story = $(stories)[i];
		var mp3 = $(story).find('mp3');
		if (mp3.length == 1) {
			$.get($(mp3).text(), processm3u);
		}
	}
}

var processm3u = function(m3u) {
	var playlist = M3U.parse(m3u);
	console.log(playlist[0].file);
}


//index can be a singular index, like '1149' or multiple, delimited by commas:
//such as '1149, 1150'
var getStories = function(index, numResults) {
	var query = 'http://api.npr.org/query?id=' + index + '&numResults=' + numResults + '&apiKey=MDE2OTQ2ODMxMDE0MTI1NDIzODY0YjNiMg001';
	//console.log(query);
	$.get(query, getnpr);
}

window.addEventListener("load", main);