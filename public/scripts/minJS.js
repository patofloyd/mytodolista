function showInfo(){	// funktion för att visa info.

	$.ajax({					// ajax function med method "GET" för att få ut alla dokument.

		url: '/api/todos',
		method: 'GET'

	}).done(function (data) {

		listan.innerHTML = '';	// för att ta bort det som skulle finnas innan vi gör en annan callback.

		if (data.length === 0) {
			listan.innerHTML = "<i>Inga uppgifter tillagda</i>"; // Om det inte finns något element.
			toCheck.innerHTML = '';
		}
		else
			toCheck.innerHTML = "<b>Markera uppgifter och klicka på önskad händelse: </b><button onclick='checkInfo()'>- Avklarade -</button> <button onclick='deleteInfo()'>- Ta bort -</button>";
			for (var i = 0; i < data.length; i++) {	// för att visa alla element som finns i databas modellen samt knappar checka och ta bort.

				listan.innerHTML += "<li><input type='checkbox' id='objekt" + data[i].id + "' value='" + data[i].id + "' name='" + data[i].text + "'>Nº" + data[i].id + ". " + data[i].text + "</input></li>";
			}		
	});
}

function checkInfo() {	// funktion för att checka uppgifter som är klara.

	for (var i = storlek.length; i >= 1; i--) { // for loop för att gå genom listan.

		if ( document.getElementById("objekt" + i).checked ) {	// if sats för att ändra de som är markerade.

			$.ajax({
				url: '/api/todos/' + document.getElementById("objekt" + i).value,	// ajax funktion med method "PUT" för att uppdatera info.
				method: 'PUT',
				data: {text: document.getElementById("objekt" + i).name + " ✔"}	// Lägga till en ✔ på de som är markerade.
			}).done;			
		}
	}
	showInfo();	// visa info
	showInfo();
}

function sendInfo(){	// funktion för att skicka info.

	if(document.getElementById("uppgift").value === ''){
		alert("Du måste fylla på rutan!");	// alert om rutan är tom.
	}
	else						// om allt är ok kör vi på att lagra info.
		$.ajax({
			url: '/api/todos/',	// ajax funktion med method "POST" för att spara info.
			method: 'POST',
			data: {text: document.getElementById("uppgift").value}
		}).done(function(data){

			document.getElementById("uppgift").value = ''; // rensa rutan.
					
		});
		showInfo();	// visa info
		showInfo();
}

function modifyInfo(){	// funktion för att redigera elementen.

	if(document.getElementById('minId1').value === '' || document.getElementById("uppgift1").value === '' ){
		alert("Du måste fylla i alla rutor! Kom ihåg att första rutan måste vara ett nummer");	// alert om rutorna är tomma eller den första inte är ett nummer.
	}
	else if(document.getElementById('minId1').value > storlek.length || document.getElementById('minId1').value <= 0){
		alert("Numret finns inte i listan");	// alert om numret inte finns.
	}		
	else			// Om allt går bra ändrar vi elmentet.
		$.ajax({
			url: '/api/todos/' + document.getElementById("minId1").value,	
			method: 'PUT',
			data: {text: document.getElementById("uppgift1").value}	// ajax funktion med method "PUT" för att uppdatera info.
		}).done(function(data){

			document.getElementById("minId1").value = '';		// rensa rutorna.
			document.getElementById("uppgift1").value = '';
					
		});
		showInfo();	// visa info
		showInfo();
}

function deleteInfo(){	// funktion för att ta bort elementen.

	for (var i = storlek.length; i >= 1; i--) {	// for loop för att gå genom listan.

		if ( document.getElementById("objekt" + i).checked ) {	// if sats för att ta bort de som är markerade.

			$.ajax({
				url: '/api/todos/' + document.getElementById("objekt" + i).value,	// ajax funktion med method "DELETE" för att ta bort elementen.
				method: 'DELETE'
			}).done;		
		}
	}

	$.ajax({	// ajax function med method "GET" för att sortera id av alla element.
		url: '/api/todos/sort',
		method: 'GET'
	}).done;

	showInfo();	// visa info
	showInfo();
}

// Ni kan märka att jag anropar 2 gånger funktionen showInfo() varje gång jag gör en ändring eller tar bort något eller lägger 
// till något. Detta är därför det finns en bug i den funktionen som gör att den aktuliserade informationen ibland inte visas 
// så man var tvungen att hämta sidan igen... Den bugen försvinner oftast med Google Chrome om jag anropar funktionen 2 gånger.
