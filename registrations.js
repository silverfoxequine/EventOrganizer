getEventData(function () {
    var registrations = $("#registrations");
    var registerLink = $("#registerLink");
    registerLink.html("registerone.html?eventId="+param("eventId"));
    registerLink.attr("href","registerone.html?eventId="+param("eventId"));
    var data = [];
    getAllRegistrations(data).then(function () {
        window.data = data;
        for (var i in data) {
            var reg = data[i];
            var totalCost = 0;
            for (var division of event.divisions) {
                for (var clazz of division.classes) {
                    var regClass = reg.registerTwo.filter(c => c.name == division.name + clazz.name)[0]
                    if (regClass.value) {
                        totalCost += clazz.price;
                    }
                }
            }
            divContainer = $(`<div class='list-group-item' onclick="toggleDetails(${i})">
                <h4>${reg.registerOne[0].value} ${reg.registerOne[1].value} : $${totalCost}</h4>
                <div class="row" data-id="${reg.registerOne[0].value} ${reg.registerOne[1].value}" style="display: none">
                </div>
            </a>`).appendTo(registrations);
            var additionalContainer = $(`div[data-id='${reg.registerOne[0].value} ${reg.registerOne[1].value}']`);
            var leftContainer = $("<div class='col-6'></div>").appendTo(additionalContainer);
            var rightContainer = $("<div class='col-6'></div>").appendTo(additionalContainer);
            for (var dataItem of reg.registerOne) {
                leftContainer.append(`<div><strong>${dataItem.name}</strong>: ${dataItem.value}</div>`);
            }
            for (var division of event.divisions) {
                for (var clazz of division.classes) {
                    var regClass = reg.registerTwo.filter(c => c.name == division.name + clazz.name)[0]
                    if (regClass.value) {
                        rightContainer.append(`<div>${division.name} ${clazz.name}</div>`);
                    }
                }
            }
        }
    });

});
function toggleDetails(index) {
    var reg = data[index];
    $(`div[data-id='${reg.registerOne[0].value} ${reg.registerOne[1].value}']`).toggle();
}
function getAllRegistrations(data) {
    var promises = [];
    for (var reg of event.registrations) {
        promises.push(getReg(data, reg));
    }
    return Promise.all(promises);
}
function getReg(data, reg) {
    return $.get(reg, function (json) {
        json.url = reg;
        data.push(json);
    })
}