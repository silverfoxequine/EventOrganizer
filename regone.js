
var eventId = param("eventId");
getEventData();
function submitOne() {
    var saveData = [];
    $('input').each(function () {
        var input = $(this),
            value = input.val();
        if (input.attr("type") == "checkbox") {
            value = input.is(":checked");
        }
        saveData.push({
            name: input.attr("name"),
            value: value
        });
    })
    var regId = localStorage.getItem("regId"+eventId);
    if (!regId) {
        $.ajax({
            url: "https://api.myjson.com/bins",
            type: "POST",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ret, textStatus, jqXHR) {
                regId = ret.uri;
                localStorage.setItem("regId"+eventId, regId);
                getEventData(function () {
                    event.registrations.push(regId);
                    updateEvent();
                    updateInfo(regId, saveData);
                });
            }
        });
    } else {
        updateInfo(regId, saveData);
    }
}
function updateInfo(regId, saveData) {
    
    getRegData(regId, function (regJson) {
        regJson.registerOne = saveData;
        var data = JSON.stringify(saveData);
        localStorage.setItem('registerOne', data);
        var eventId = param("eventId");
        $.ajax({
            url: regId,
            type: "PUT",
            data: JSON.stringify(regJson),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                location.href = `registertwo.html?eventId=${eventId}`;
            }
        });
    });
}
function updateEvent() {
    var val = JSON.stringify(event);
    var eventId = param("eventId");
    $.ajax({
        url: `https://api.myjson.com/bins/${eventId}`,
        type: "PUT",
        data: val,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

        }
    });
}
var regData = localStorage.getItem("registerOne");
if (regData) {
    var regDataJson = JSON.parse(regData);
    for (var item of regDataJson) {
        var input = $(`input[name="${item.name}"]`);
        if (input.attr("type") == "checkbox") {
            input[0].checked = item.value;
        } else {
            $(`input[name="${item.name}"]`).val(item.value);
        }
    }
}