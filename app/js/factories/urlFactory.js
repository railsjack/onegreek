onegreek.factory('urlFactory', function() {
   return {
       apiUrl: function(partial, params) {
           return onegreekConfig.onegreekApiEndpoint + partial + '?' + this.queryString(params);
       },
       bootUrl: function() {
           return onegreekConfig.onegreekApiEndpoint.replace('api/', 'boot.json');
       },
       queryString: function(params) {
           var queryString = '';
           for(var key in params) {
               if(key) {
                   queryString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
               }
           }
           return queryString;
       }
   }
});