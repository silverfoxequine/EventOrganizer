window.param = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function getEventData(retFn) {
    var eventId = param("eventId");
    $.get(`https://api.myjson.com/bins/${eventId}`, function (json) {
        window.event = json;
        $("#eventName").html(json.name);
        retFn && retFn();
    });
}
function getRegData(url, retFn) {
    $.get(url, function (json) {
        retFn && retFn(json);
    });
}
