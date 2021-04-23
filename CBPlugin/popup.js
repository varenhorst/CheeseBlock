function main(){

var switchStatus = false;




  chrome.storage.local.get("count", function(data) {
      if(typeof data.count == "undefined") {
          // That's kind of bad
      } else {
          //console.log(data.count['count']);
          document.getElementById("pageNum").innerHTML = data.count['count'];
          //document.getElementById("totalNum").innerHTML = data.count['total'];
      }
  });

}


document.addEventListener("DOMContentLoaded", function() {

  $('#toggle').click(function(){
    if(this.checked){
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "show-heatmap"});
     });
    } else{
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "hide-heatmap"});
     });
    }

  });

});

// document.addEventListener("DOMContentLoaded", function() {
//   var button = document.getElementById("menu-button");
//   var menu = document.getElementById("menu");
//   var container = document.getElementById("middle");
//   var heatmap_toggle = document.getElementById("switch");
//   // var exWindow = document.body;

//   button.onclick = function(){
//     console.log(menu.style.display);

//     if(menu.style.display != "block"){
//       container.style.height = "250px";
//       menu.style.display = "block";
//       document.getElementById("button_plus").innerHTML = "-";
//     } else {
//       // exWindow.style.height = "100px";
//       document.body.style.height = "125px";
//       container.style.height = "90px";
//       menu.style.display = "none";
//       document.getElementById("button_plus").innerHTML = "+";
//     }
//   }

// });





window.onload = main();
