// Inspired in http://www.the-art-of-web.com/javascript/search-highlight/
var Injector = (function() {
    return {
      createInjector: function(charger) {
        return function searchTextNodes(element) {
          exploreNodes = [];
          for (var child of element.childNodes) {
            exploreNodes.push(child);
          }
          for (var node of exploreNodes) {
            searchTextNodes(node);
          }
          var injectionPoints = charger.selector(element);
          injectionPoints.sort((a, b) => a.index > b.index);
          console.log(injectionPoints); 
          while (injectionPoints.length > 0) {
              var matched = injectionPoints.pop();
              var injection = charger.buildNode(matched);
              var after = element.splitText(matched.index);
              after.nodeValue = after.nodeValue.substring(matched[0].length);
              element.parentNode.insertBefore(injection, after);
          }
        }
      }
    };
  })()
