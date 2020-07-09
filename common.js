var JSONAPIURL = "https://jsonbox.io/box_368e23ee382d9f98d0d0/";
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

function getEventData(retFn, eventId) {
    eventId = eventId || param("eventId");
    $.get(`${JSONAPIURL}${eventId}`, function (json) {
        try {
            //json = JSON.parse(json);
            window.event = json;
            $("#eventName").html(json.name);
            $("#eventDate").html(json.date);
            retFn && retFn(json);
        } catch (e) {
            console.log(e);
            errorHandle();
        }
    }).fail(function () {
        errorHandle();
    });
}
function errorHandle() {
    alert("Error: Event Not Found. Contact Christina to resolve.");
}
function updateJsonData(id, data, callback) {
    $.ajax({
        url: `${JSONAPIURL}${id}`,
        type: "PUT",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            callback(data);
        }
    });
}
function putData(data, callback) {
    $.ajax({
        url: JSONAPIURL,
        type: "POST",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(ret,ret2, ret3) {
            ret.uri = JSONAPIURL+"/" + ret._id;
            callback(ret);
        }
    });
}
function getRegData(url, retFn) {
    $.get(url, function (json) {
        if (!(json instanceof Object)) {
            json = JSON.parse(json);
        }
        retFn && retFn(json);
    });
}
