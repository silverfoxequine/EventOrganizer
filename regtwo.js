getEventData(function () {
    var divisions = $('#divisions');
    for (var division of event.divisions) {
        var price = "$" + division.price;
        var divContainer = $(`<div class="list-group-item row" style="display:flex"></div>`).appendTo(divisions);
        divContainer.append(`<h4 class='col-4'>${division.name}</h4>`);
        var classContainer = $("<div class='col-8'></div>").appendTo(divContainer);
        for (var clazz of division.classes) {
            var inputCont = $(`<div class="form-check">
                    <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" name="${division.name}${clazz.name}">
                    ${clazz.name} : $${clazz.price}</label>
                </div>`).appendTo(classContainer);
        }
    }
    
    var regData = localStorage.getItem("registerTwo");
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
})
function submitTwo() {
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
    var regId = localStorage.getItem("regId");
    if (!regId) {
        alert("Couldn't find info from step one, redirecting to step one");
        location.href = "registerone.html?eventId=" +param("eventId");
    } else {
        updateInfo(regId, saveData);
    }
}
function updateInfo(regId, saveData) {
    var data = localStorage.getItem("registerTwo");
    if (data) {
        data = JSON.parse(data);
        for (var i in data) {
            data[i].value = saveData[i].value;
        }
    } else {
        data = saveData;
    }
    getRegData(regId, function (regJson) {
        regJson.registerTwo = data;
        data = JSON.stringify(data);
        localStorage.setItem('registerTwo', data);
        var eventId = param("eventId");
        $.ajax({
            url: regId,
            type: "PUT",
            data: JSON.stringify(regJson),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                location.href = `registerthree.html?eventId=${eventId}`;
            }
        });
    });
}