onegreek.service('deviceMediaService', function($q) {
   return {
       takePicture:function() {
           var options = {
               quality: 50,
               destinationType: navigator.camera.DestinationType.DATA_URL,
               sourceType: navigator.camera.PictureSourceType.CAMERA
           };
           var q = $q.defer();
            navigator.camera.getPicture(function(dataURL) {
                q.resolve({ dataURL: dataURL });
            }, function(err) {
                q.reject(err);
            }, options);
           return q.promise;
       },
       choosePicture: function() {
           var options = {
               quality: 50,
               destinationType: navigator.camera.DestinationType.DATA_URL,
               sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
           };
           var q = $q.defer();
           navigator.camera.getPicture(function(dataURL) {
               q.resolve({ dataURL: dataURL });
           }, function(err) {
               q.reject(err);
           }, options);
           return q.promise;
       }
    }
});