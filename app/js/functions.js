var reloadOneGree = function() {
    window.location = 'index.html';
};

var getUserUuid = function() {
    return onegreekConfig.user_uuid;
}
var setUserUuid = function(uuid) {
    onegreekConfig.user_uuid = uuid;
}