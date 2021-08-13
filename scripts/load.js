var path = (location.search == "") ? "scripts/playlist.js" : location.search.split('?')[1];

console.log(path);

loadPlaylist(path);

function loadPlaylist(path) {
    var script = document.createElement('script');
    var scriptCtrl = document.createElement('script');
    
    script.src = path;
    scriptCtrl.src = "scripts/controls.js"
  
    document.head.appendChild(script);
    document.head.appendChild(scriptCtrl);
  };