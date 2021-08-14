var path = (location.search == "") ? "scripts/playlist.js" : location.search.split('?')[1];

console.log(path);

loadPlaylist(path);

function loadPlaylist(path) {
    var script = document.createElement('script');
    
    script.onload = function() {
        var scriptCtrl = document.createElement('script'); 
        scriptCtrl.src = "scripts/controls.js"
        document.head.appendChild(scriptCtrl);
    };

    script.src = path;
  
    document.head.appendChild(script);
  };