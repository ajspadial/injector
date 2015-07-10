(function() {
    var dictionary = [];

    var agripaProfileReemp = {
      selector: function(element) { 
        var matchedElements = [];
        if (element.nodeType == Node.TEXT_NODE) {
          regex = /@\w+\b/g;
          while (matched = regex.exec(element.textContent)) {
            matchedElements.push(matched);
          }
          matchedElements.filter(e => dictionary[e[0]]).forEach(e => {
            e.data = dictionary[e[0]];
          });
          var promises = matchedElements.filter(e => !dictionary[e[0]]).map(e => {
            var name = e[0].slice(1);
            var p = $.get('http://agripa.org/api/actor/' + name);
            p.index = e.index;
            return p;
          });
          promises.forEach(p => {
            p.done(result => {
              matchedElements.filter(e => e.index === p.index).forEach(e => {
                dictionary[e[0]] = e.data = result;
              });
            });
          });
          while (promises.length > 0 && !promises.every (p => (p.state() === 'resolved')));
          matchedElements = matchedElements.filter(e => e.data.ok);
        }
        return matchedElements;
      },
      buildNode: function(injectionPoint) {
        var injection = document.createElement('a');
        injection.appendChild(document.createTextNode(injectionPoint[0]));
        injection.className = 'injection';
        injection.href = 'http://agripa.org/profile/' + injectionPoint[0].slice(1);
        injection.title = injectionPoint.data.actor.displayName + ', '
                          + injectionPoint.data.actor.description;
        return injection;     
      },
    };
  
  var injector = Injector.createInjector(agripaProfileReemp);
  injector(document.body);
})();
