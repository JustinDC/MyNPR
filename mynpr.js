var prefs;
var storyQueue;

var main = function() {
	prefs = JSON.parse(localStorage.getItem('prefs'));
	if (!prefs) { //first time usage
		prefs = [
		{id: "1006", pref: 0.5}, //economy
		{id: "1045", pref: 0.5}, //movies
		];
		//TODO: show popup
	}

	storyQueue = JSON.parse(localStorage.getItem('storyQueue'));
	if (!storyQueue) { //first time usage
		storyQueue = [];
	  nextStory();
	  nextStory();
	  nextStory();
	  nextStory();
	  nextStory();
	  nextStory();
	}
	else {
		var audio = document.getElementById("player_audio");
    audio.src = storyQueue[0].mp3link;
    audio.load();
    $("#news0").html(storyQueue[0].title);
    $("#news1").html(storyQueue[1].title);
    $("#news2").html(storyQueue[2].title);
    $("#news3").html(storyQueue[3].title);
    $("#news4").html(storyQueue[4].title);
    $("#news5").html(storyQueue[5].title);
	}
}

var exit = function() {
	if (prefs) {
		localStorage.setItem('prefs', JSON.stringify(prefs));
	}
	if (storyQueue) {
			localStorage.setItem('storyQueue', JSON.stringify(storyQueue));
	}
}

var getnpr = function(queryTopic) {
	return function(nprml, textStatus, jqXHR) {
		var nprlist = $(nprml).find('list')[0];
		var stories = $(nprlist).find('story');
		numStories = stories.length;
		var storyObjects = [];
		/*Story object is an Object containing the following fields for each story
		title
		duration
		primaryTopic
		topics (as an array of strings)
		link
		ids of related links (as an array of numbers)
		m3u
		mp3

		in the future maybe:
		teaser
		image thumbnail
		*/
		for (var i = 0; i < stories.length; i++) {
			var story = $(stories)[i];
			var mp3 = $(story).find('mp3');
			if (mp3.length == 1) { //viable story, has an mp3 file
				var storyObject = {};
				storyObject.queryTopic = queryTopic;
				storyObject.mp3 = $(mp3).text();
				storyObject.title = $($(story).find('title')[0]).text();
				storyObject.duration = $($(story).find('duration')[0]).text();
				var topics = [];
				var primaryTopic;
				var tags = [];
				var program;
				console
				for (var j = 0; j < $(story).find('parent').length; j++) {
					var parentType = $($(story).find('parent')[j]).attr('type');
					var parentId = $($(story).find('parent')[j]).attr('id');
					if (parentType == 'topic') {
						topics.push(parentId);
					}
					if (parentType == 'primaryTopic')
						primaryTopic = parentId;
					if (parentType == 'tag')
						tags.push(parentId);
					if (parentType == 'program')
						program = parentId;
				}
				storyObject.topics = topics;
				storyObject.primaryTopic = primaryTopic;
				storyObject.tags = tags;
				storyObject.program = program;

				storyObject.link = $($(story).find('link')[0]).text();

				var relatedLinks = [];
				for (var j = 0; j < $(story).find('relatedLink'); j++) {
					var relatedLink = $($(story).find('relatedLink')[j]).attr('id');
					relatedLinks.push(relatedLink);
				}
				storyObject.relatedLinks = relatedLinks;
				storyObjects.push(storyObject);

			}
		}

		//TODO: what if storyObjects.length == 0?
			//return an "error" storyObject?


		//TODO: improve how selection works.
		var found = false;
		var choice;
		
		while (!found) {
			choice = Math.floor(Math.random() * storyObjects.length);
			found = true;
			for (var i = 0; i < 6; i++) {
				if (storyQueue[i] && storyObjects[choice].title == storyQueue[i].title)
					found = false;
			}
		}
		
		var theStory = storyObjects[choice];
		$.get(theStory.mp3, processm3u(theStory));
	}
}

var processm3u = function(story) {
	return function(data, textStatus, jqXHR) {
	story.mp3link = data;
        addStoryToUI(story);
    };
}

/*
signal:
0: thumbs up
1: thumbs down
2: skip
3: play to completion
*/
var feedback = function(story, signal) {
	var topic = story.queryTopic;
	var prefsIndex;
	var done = false;
	for(var i = 0; i < prefs.length && !done; i++) {
		if (prefs[i].id == topic.toString()) {
			prefsIndex = i;
			done = true;
		}
	}
	prefs[prefsIndex].pref += signal;
	prefs[prefsIndex].pref = Math.max(prefs[prefsIndex].pref, 0.1);
	console.log('id: ' + prefs[prefsIndex].id + ', pref: ' + prefs[prefsIndex].pref);
}

var nextStory = function() {
	var total = 0;
	for (var i = 0; i < prefs.length; i++) {
		total += prefs[i].pref;
	}
	var rand = Math.random()*total;
	var choice;
	var curr = 0;
	for (var i = 0; !choice; i++) {
		if (curr + prefs[i].pref > rand) { // hit the thing.
			choice = prefs[i].id;
		}
		else {
			curr += prefs[i].pref;
		}
	}
	getStories(choice, 20);
}

//index can be a singular index, like '1149' or multiple, delimited by commas:
//such as '1149, 1150'
var getStories = function(index, numResults) {
	var query = 'http://api.npr.org/query?id=' + index + '&numResults=' + numResults + '&apiKey=MDE2OTQ2ODMxMDE0MTI1NDIzODY0YjNiMg001';
	//console.log(query);
	$.get(query, getnpr(index));
}

window.addEventListener("load", main);
window.addEventListener("beforeunload", exit);