var count = 0;

function getData(url){ 
  var dir = 'https://cheeseblock-313420.appspot.com/skip';
  var request = new XMLHttpRequest();
  var res;
  var params = "?url="+url;
  // console.log(params,"PARAMS");
  request.open("GET", dir+params, true);
  // request.setRequestHeader('Access-Control-Allow-Origin', '*');

  request.onload = function()
  {
      if(request.readyState == 4 && request.status == 200) {
          console.log("data-changings");
          res = request.responseText;
          chrome.storage.local.set({key: res});
          // alert(res);
          // return res;
          // return res;
      }
  }
  request.send(params);
  // alert(res);

  // chrome.storage.local.set({key: res}, function() {
  //   console.log('Value is set to ' + value);
  // });
  // return res;
}




//*********///

// var data;
function postData(data){
  var dir = 'https://cheeseblock-313420.appspot.com/skip';
  var request = new XMLHttpRequest();

  var url = 'alexwashere';
  var init = 69;
  var from = 420;

  // var data = "url="+url+"&init="+init+"&from="+from;

  request.open("POST", dir);
  request.setRequestHeader("Content-type", "application/json");
  // request.setRequestHeader('Access-Control-Allow-Origin', '*');

  // request.setRequestHeader("Content-length", data.length);
  // request.setRequestHeader("Content-length", data.length);
  // request.setRequestHeader("Connection", "close");

  request.onload = function() {
    if (request.status === 200) {
        // code if everything went fine
        // request.responseText for printing echoes
        // window.alert("Posting Data", request.responseText);
    } else {
        window.alert("oh no");
    }
  };

  console.log("Sending data: ",data);
  // sending data here
  request.send(JSON.stringify(data));
}

var previousUrl = '';
var temp = '';
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {
              chrome.tabs.query({active : true}, function (tabs) {
                var CurrTab = tabs[0];
                chrome.tabs.sendMessage(CurrTab.id, {message:'url-change',url:previousUrl});
                console.log("Previous Url Sent:",previousUrl);
                previousUrl = details.url;
              })
            //   chrome.storage.local.set({url: }, function() {
            // // console.log('Value is set to ' + res);
            //   });
            }
        });
    }
});

//recieve url from script here/
//with url, query database to get skips
//send skips to script.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(request.message);
      if(typeof request.skips != 'undefined' & request.message == "post-skips" ){

        console.log("posting skips for ", request.url, request.skips);
        postData(request.skips);
        // return true;
        // console.log(request, request.url, " TEST");
      }


      if(request.message == "get-skips"){
        console.log("getting skips for ", request.url);
        getData(request.url);
        // return true;
      }

      // console.log(sender.tab ? "from a content script:" + sender.tab.url :"from the extension");

      // sendResponse({reply: "hey"});
  });


chrome.storage.onChanged.addListener(function(changes, namespace) {
  count++;
  if(typeof chrome.app.isInstalled!=='undefined'){
    chrome.browserAction.setBadgeText({text: count.toString()});
  }
  // console.log("hey " + Object.keys(changes));
  for (var key in changes) {
          var storageChange = changes[key];
          // console.log('Storage key "%s" in namespace "%s" changed. ' +
          //             'Old value was "%s", new value is "%s".',
          //             key,
          //             namespace,
          //             storageChange.oldValue,
          //             storageChange.newValue);
        }


      
});






