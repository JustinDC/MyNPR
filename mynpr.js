
var main = function() {
    $.get('http://api.npr.org/query?id=1149&numResults=2&apiKey=MDE2OTQ2ODMxMDE0MTI1NDIzODY0YjNiMg001', getnpr);
}

var getnpr = function(nprml) {
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
			console.log(story);
			console.log(storyObject);
			//console.log($($(story).find('parent')[0]).attr('type'));
			//console.log($($(story).find('parent')[0]).attr('id'));
			//console.log(storyObject);
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