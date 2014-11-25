var storyQueue;
var firstTime;

var main = function() {
        firstTime = JSON.parse(localStorage.getItem('firstTime'));
        if (!firstTime) {
            $("#prefModal").show();
            firstTime = true;
        }
        
	prefs = JSON.parse(localStorage.getItem('prefs'));
	if (!prefs) { //first time usage
		prefs = [
		{id: "1003", pref: 0.5, topic: "U.S. News", checked: false},
                {id: "1004", pref: 0.5, topic: "World News", checked: false},
                {id: "1014", pref: 0.5, topic: "Politics", checked: false},
                {id: "1006", pref: 0.5, topic: "Business", checked: false},
                {id: "1019", pref: 0.5, topic: "Technology", checked: false},
                {id: "1007", pref: 0.5, topic: "Science", checked: false},
                {id: "1128", pref: 0.5, topic: "Health", checked: false},
                {id: "1013", pref: 0.5, topic: "Education", checked: false},
                {id: "1032", pref: 0.5, topic: "Books", checked: false},
                {id: "1045", pref: 0.5, topic: "Movies", checked: false},
                {id: "1048", pref: 0.5, topic: "Pop Culture", checked: false},
                {id: "1053", pref: 0.5, topic: "Food", checked: false},
                {id: "1047", pref: 0.5, topic: "Art & Design", checked: false},
                {id: "1046", pref: 0.5, topic: "Performing Arts", checked: false},
                {id: "1039", pref: 0.5, topic: "Music", checked: false},
                {id: "1016", pref: 0.5, topic: "Religion", checked: false},
                {id: "1142", pref: 0.5, topic: "Architecture", checked: false},
                {id: "1057", pref: 0.5, topic: "Opinion", checked: false},
                {id: "1138", pref: 0.5, topic: "Television", checked: false},
                {id: "1025", pref: 0.5, topic: "Environment", checked: false},
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
                if (audio !== null) {
                    audio.src = storyQueue[0].mp3link;
                    audio.load();
                }
        }
    var newsQueue = document.getElementById("queue");
    if (newsQueue !== null) {
        $("#header_title").html(storyQueue[0].title);
        $("#news1").html(storyQueue[1].title);
        $("#news2").html(storyQueue[2].title);
        $("#news3").html(storyQueue[3].title);
        $("#news4").html(storyQueue[4].title);
        $("#news5").html(storyQueue[5].title);
    }

    var prefDiv = document.getElementById("preferences");
    if (prefDiv !== null) {
        for (var i = 0; i < prefs.length; i++) {
            $("#preferences").html($("#preferences").html()+"<div id=\""+i+"\" class=\"preference\">"+prefs[i].topic+"</div>");
            var prefElement = document.getElementById(parseInt(i));
            $(prefElement).height($(prefElement).width());
            if (prefs[i].checked) {
                prefElement.style.backgroundColor = "#596EAE";
            } else {
                prefElement.style.backgroundColor = "rgba(96, 96, 96, 0.7)";
            }
           console.log(prefs[i].checked);
        }
        $(".preference").on("click", function() {
                if (!prefs[parseInt(this.id)].checked) {
                    this.style.backgroundColor = "#596EAE";
                    prefs[parseInt(this.id)].pref += 5;
                    prefs[parseInt(this.id)].checked = true;
                } else {
                    this.style.backgroundColor = "rgba(96, 96, 96, 0.7)";
                    prefs[parseInt(this.id)].pref -= 5;
                    prefs[parseInt(this.id)].checked = false;
                }
            });
    }
}

var exit = function() {
	if (prefs) {
		localStorage.setItem('prefs', JSON.stringify(prefs));
	}
	if (storyQueue) {
		localStorage.setItem('storyQueue', JSON.stringify(storyQueue));
	}
        if (firstTime) {
		localStorage.setItem('firstTime', JSON.stringify(firstTime));
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