getEventData(function () {
    var eventId = param("eventId");
    var regData = localStorage.getItem("registerTwo"+eventId);
    if (!regData) {
        alert("Registration info not found. Please try again");
        location.href ="registerone.html?eventId="+eventId;
    }
    var regJson = JSON.parse(regData);
    var totalCost = 0;
    var divisions = $("#divisions");
    for (var division of event.divisions) {
        var divisionAdded = false;
        for (var clazz of division.classes) {
            var regClass= regJson.filter(c=>c.name==division.name+clazz.name)[0]
            if(regClass.value) {
                totalCost+= clazz.price;
                var divContainer;
                if (!divisionAdded) {
                    divisionAdded = true;
                    divContainer = $(`<div class='list-group-item' data-id="${division.name}">
                        <h4>${division.name}</h4>
                    </div>`).appendTo(divisions);
                } else {
                    divContainer = $(`div[data-id="${division.name}"]`);
                }
                divContainer.append(`<div><strong>${clazz.name}</strong> $${clazz.price}</div>`);
            }
        }
    }
    $('#totalCost').html("$"+totalCost);
});