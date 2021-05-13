//Content script!
/*
Goal:

	From skips, calculate the area where users watch.
	Visualize where people watch, rather than where people skip.
		- this is where the heatmap will come in


	Clean popup
		- Fix badge
		- Fix counters
		- Fix Heatmap button.
		- Implement Autoskip?
	




	CHEESE METER: AUTO SKIP FEATURE
		- checkbox in extension
		- user can decide what magnitude of cheese to skip.
	Host:
*/




(function() {
	var isVid = false;
	var url = '';
	var skipManifest = [];

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log(request.message);
	    if (request.message == 'url-change') {
	  		if(location.href != request.url){
	  			if(location.href.includes("/watch")){ // this breaks when the user reloads the page.
	  				if(!isVid) {main()}
	  				isVid = true;
	  			}
	  			if(skipManifest.length > 0) {
	  				console.log(skipManifest);
	  				sendPost(request.url, skipManifest);
	  				skipManifest = [];
	  			}
	  		} else {
	  			if(!isVid) {main()}
	  			isVid = true;
	  		}
	    }
	    url = request.url;
	    return true;
	});


	function sendPost(prev_url,data){
		console.log("sending post");
		data = skipFinder(data,4);
		chrome.runtime.sendMessage({message: "post-skips", skips: data, url: prev_url});
	}


	function main(){
		var test_count = 0;
		addHeatContainer();
		// addCommentButton();
		var heatmap;
		var video = $('video')[0];
		var totalSkips = 0;
		var currentSkips = 0;
		var current; // the current progress of the video (in seconds)

		if(typeof video != 'undefined'){
			video.addEventListener('loadeddata', (event) => {
				skipManifest = [];
				url = location.href;
				video.ontimeupdate = function(){current = videoTime(video)}; //this is called every time the video progresses.
				if(typeof heatmap != 'undefined'){
					reset();
				}
				chrome.runtime.sendMessage({message: "get-skips", url: url});

				if(!chrome.storage.onChanged.hasListeners()){
				    chrome.storage.onChanged.addListener(function(changes, namespace) {
				        for (var key in changes) {
				          var storageChange = changes[key];
				    	}

				    	if(storageChange.newValue.length != 0){
				    		console.log(storageChange.newValue);
				    		var newskips = JSON.parse(storageChange.newValue);

					    	if(newskips.message.length != 0){
					    		var a = [];
					    		var skip = {};
					    		for(var i = 0; i < newskips.message.length; i++){
					    			skip = {from: newskips.message[i]['init'], to: newskips.message[i]['final']}
					    			var skips = a.push(skip);
					    		}	
								addheatMap(a,video);
					    	}
				    	}

				    	
				    });
				}

				chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
				    if(request.message == 'hide-heatmap'){
				    	hideShowHeatmap("hide");
				    } else if(request.message == 'show-heatmap'){
				    	hideShowHeatmap("show");
				    }
				 });



				

				//** Listen for a new url (new video) **//
				//** Update skipManifest, and url for new video **//


				// run through the comment section, and look for time stamps.
				// give context to time stamps.
				//test_count++;
				//console.log($('ytd-comment-renderer'),test_count);

				//** click event for clicking the progress bar of the video. **//
				// here, current is the time before seeking.***
				// $('video')[0].currentTime is the time recorded after seeking.***
				$(".ytp-progress-bar").unbind().click(function() {
					console.log("time after=>", $('video')[0].currentTime,"time before=>", current);
					getSkipInterval(url,current, $('video')[0].currentTime); //before,after.
					currentSkips = currentSkips + 1;
					totalSkips = totalSkips + 1;
					console.log(count);
				});


				expanded = false;
				$("#cheeseblock-plus").unbind().click(function(){
					addMovingChapter(current);
					if(expanded){
						expandCommentBox("hide");
						addMovingChapter(current);
						expanded = false;
 					} else {
						expandCommentBox("show");
						expanded = true;
					}
				}).children().click(function(e) {
  					return false;
				});

			});	
		} else {
			console.log("Error getting video. Is there a video on this page?");
			return true;
		}
	}
	
	//############ Functions #############\\



/*		function addChapters(times){
			for(var i = 0; i < times.length; i++){
				var from = times[i]['from'];
				var to = times[i]['to'];

				var left1 = convertTimeToPercentage(from); //4:20
				var left2 = convertTimeToPercentage(to);
				
				var str1 = "<div class='chapter' style=left:" + left1 + "></div>";
				var str2 = "<div class='chapter' style=left:" + left2 + "></div>";

				var html1 = $.parseHTML(str1);
				var html2 = $.parseHTML(str2);

				$('.ytp-progress-bar').append(html1);
				$('.ytp-progress-bar').append(html2);
			}
		}*/



	// function addMovingChapter(time){
	// 		var left = convertTimeToPercentage(time); //4:20
	// 		var str = "<div class='chapter' style=left:" + left + "></div>";
	// 		var html = $.parseHTML(str);
	// 		$('.ytp-chrome-controls').append(html);
	// 		$(".chapter").draggable({ axis: 'x' });
	// 	}

	// function clearContent(){

	// }

	//Converts a given time in seconds to a percentage of the video.
	//returns a string of the percentage.
	// function convertTimeToPercentage(time,video){
	// 	var totalTime = video.duration; //total length of video
	// 	var ratio = time/totalTime * 100;
	// 	//console.log(video.duration / 60,"minutes");
	// 	ratio.toString();
	// 	ratio = ratio + "%";

	// 	return ratio;
	// }

	//Converts the given time to a percentage of the video.
	//returns an int.
	function convertTime(time,video){
		var totalTime = video.duration; //total length of video
		var ratio = time/totalTime * 100;
		//console.log(video.duration / 60,"minutes");

		return ratio;
	}

	//resets the skipManifest for the new url.
	function reset(){
		console.log("reset");
		//skipManifest = [];
		parent = document.querySelector('#heatmap-container')
		while (parent.firstChild) {
       		parent.removeChild(parent.firstChild);
    	}

    	var contentToRemove = document.querySelectorAll(".chapter");
		$(contentToRemove).remove(); 
	}


	function hideShowHeatmap(option){
		if(typeof heatmap == 'undefined'){return;}
		if(option=='hide'){
			$("#heatmap-container").hide("slow");
		} else {
			$("#heatmap-container").show("slow");
		}
	}


	//get mid point of the 2 times, to get the radius for the heatmap.
	//this is the midpoint given in seconds.dsafa
	function getmidPoint(arr){
		var sum = arr['from'] + arr['to'];
		var mid = sum / 2;
		return mid;
	}

	function roundToTwo(num) {    
    	return +(Math.round(num + "e+3")  + "e-3");
	}

	//gets, and returns the distance between skips [in seconds].
	function getDistanceBetweenSkips(arr){
		var max = arr['to'];
		var min = arr['from'];

		return max - min;
	}

	function getRadiusForHeatMap(arr){
		console.log(getDistanceBetweenSkips(arr),'=> RADIUS');
		return getDistanceBetweenSkips(arr)/2;
	}


	// create the heatmap for the skips.
	//waits 3 seconds before creating the heatmap
	//this way it does not influence the user to skip to where the heatmap lies, 
	function addheatMap(arr,video){
		setTimeout(function(){
			heatmap = h337.create({
	 		// only container is required, the rest will be defaults
	  			container: document.querySelector('#heatmap-container')
			});

			var points = [];
			var max = 0;
			var width = $('.ytp-progress-bar').width();
			var height = 10;


			for(var i = 0; i <= arr.length; i++){
				if(typeof arr[i]!='undefined'){
					var point = {
						// x: convertTime(260)/100 * $('.ytp-progress-bar').width(), // position on line
						x: convertTime(getmidPoint(arr[i]),video)/100 * width,
					    y: 1,
					    value: 10,
					    // radius configuration on point basis
					    radius: convertTime(getRadiusForHeatMap(arr[i]),video)/100 * width
				    	// radius:10
					};
					points.push(point);
				}
			}



			var data = {
			  max: 12,
			  data: points
			};
			console.log(data, "=>Data for the heapmap")
		// if you have a set of datapoints always use setData instead of addData
		// for data initialization

			heatmap.setData(data);
		},3000)
	}


	//add heatContainer
	function addHeatContainer(){
		var str = "<div id='heatmap-container'></div>";
		var html = $.parseHTML(str);
		$('.ytp-progress-bar').append(html);

		console.log($('#heatmap-container'));

		//return $('#heatmap-container');
	}




	// function addCommentButton(){
	// 	var str = "<div id='cheeseblock-plus'>+</div><div class='comment-container'></div>";
	// 	var html = $.parseHTML(str);
	// 	$('.ytp-left-controls').append(html);
	// 	$('.time-input').hide();
	// }


	function expandCommentBox(opt){
		if(opt == 'hide'){ 
			$('.comment-container').hide("fast");
		} else {
			$('.comment-container').show("fast");
		}
	}
//** Gets interval of the video skip, and adds it to skipManifest **//
	function getSkipInterval(url,before,after){
		if(before >= 5)
		{
			var arr = {url:url,from: before, to: after};
			skipManifest.push(arr);
		}
	}


	function createArr(count, total){
		var arr = {count:count,total:total};
		return arr;
	}

	//** Tracks time of the video **//
	function videoTime(video){
		return video.currentTime;
	}
		//Merges consecutive skips, and removes skips that are unreliable, ie: skipping back.
	//seconds until merging a skip (5 seconds might be best)
	function skipFinder(arr,threshold){
		console.log("before", arr);
		var url = arr[0]['url'];
		for(var i = 0; i < arr.length; i++){
			console.log(arr[i])
		    if(typeof arr[i+1] === 'undefined'){
        		break;
		    } else {
		      if(Math.abs(arr[i]['to'] - arr[i+1]['from']) <= threshold){
		        var x = arr[i];
		        var y = arr[i+1];
		        arr[i+1] = {url: url, from:x['from'], to: y['to']};
		        arr.splice(i, 1);
		        i--;
		      }
		    }
		}
		console.log("after" , arr);
		return removeUnwantedSkips(arr);
	}


	//removes skips that do not really make any sense, such as skipping back
	//or something else kinda dumb.
	function removeUnwantedSkips(arr){
		for(var i = 0; i<arr.length; i++){
		  	if(arr[i]['from'] - arr[i]['to'] > 0){
		    	arr.splice(i, 1);
		    	i--;
		    }
	  	}
		return arr;
	}
	// });
})();
