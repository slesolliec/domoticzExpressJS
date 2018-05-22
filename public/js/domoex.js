
function refreshState() {
	// we get the new state
	$.getJSON("/getState", function(state) {
		// we dispatch it on GUI
		// console.log(state.rooms.Bed);
		$.each( state.rooms, function(roomName,room) {
			$("#roomcard-" + roomName + " .temp")
				// change temp
				.html( prettyTemp(room.temp) )
				// change card color
				.parent()
				.removeClass()
				.addClass("card")
				.addClass("temp-" + Math.floor(room.temp).toString())
				// change wanted temp
				.children(".wanted")
				.text(room.wantedTemp + "°")
				// change on/off state
				.parent()
				.children(".heater")
				.text( room.hitsOn > 0 ? "On" : "Off" )
			;
		});
	});


//     alert($("#roomcard-Kitchen .temp").html());

}


function prettyTemp(temp) {
	return Math.floor(temp).toString()
		+ "<small>." + (temp % 1).toFixed(1).substring(2) + "</small>";
}


$( document ).ready(  setInterval(refreshState, 15000) );
