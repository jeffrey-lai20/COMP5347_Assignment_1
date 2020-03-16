/*Provided code to read the JSON file*/
function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

window.onload = function() {
	/*Provided code to read the JSON file*/
	bookList = []; /*List for the books*/
	getJsonObject('data.json',
		function(data) {
			bookList = data; /*Store the book list into bookList*/
			
			const category = document.querySelector("#category");	/*Gets the HTMLElement Category object*/
			const tableBody = document.querySelector("#listBox table tbody");		/*Gets the HTMLElement Table object*/
			var rows = tableBody.childNodes;
			var categories = [];
			
			/*Retrieving categories*/
			for (let i = 0; i < bookList.length; i++) {
				if (!(categories.includes(bookList[i].category))) {
					categories.push(bookList[i].category);	/*Adds the JSON element "category" to the categories list*/
					let newCategory = document.createElement("option");	/*Creates a new option for the category*/
					newCategory.innerHTML = bookList[i].category;
					newCategory.setAttribute("value", bookList[i].category);	/*Sets the value attribute to the new option*/
					category.appendChild(newCategory);	
				}
				
				let rows = document.createElement("tr");
				rows.innerHTML = "<td><input type=\"radio\" name=\"radio\"></td>" +	/*Radio*/
								"<td><img src=\"" + bookList[i].img +"\" height=\";100\"; width=\"80\"></td>"+	/*Image*/
								"<td width = \"30%\">" + bookList[i].title +"</td>";	/*Title*/
				
				/*Converts the rating to a number to iterate through and add in appropriate stars for the rating*/
				var ratingString = "<td>";		
				var ratingNumber = parseInt(bookList[i].rating);
				for (let j = 0; j < ratingNumber; j++) {
					ratingString += "<img src=\"" + "/images/star-16.ico" +"\" class = \"star\">";	/*Adding filled stars*/
				}
				if (ratingNumber < 5){
					for (let p = 0; p < (5 - ratingNumber); p++) {
						ratingString += "<img src=\"" + "/images/outline-star-16.ico" +"\" class = \"star\">";	/*Adding empty stars*/
					}
				}
				ratingString += "</td>";	/*End of rating*/
				rows.innerHTML += ratingString + 
								"<td>" + bookList[i].authors +"</td>"+ /*Authors*/
								"<td>" + bookList[i].year +"</td>"+	/*Year*/
								"<td>" + bookList[i].price +"</td>"+	/*Price*/
								"<td>" + bookList[i].publisher +"</td>"+	/*Publisher*/
								"<td>" + bookList[i].category +"</td>";	/*Category*/
				rows.setAttribute("id", "row" + i);	/*Sets the new row's ID to the row number of the table*/
				tableBody.append(rows);
			}

			/*Extra category that isn't in the bookstore*/
			let newCategory = document.querySelector("#empty_category");
			newCategory.innerHTML = "Extra";	/*Sets the contents of the new option to "Extra"*/
			newCategory.setAttribute("value", newCategory.innerHTML);	/*Sets value*/
			category.appendChild(newCategory);
			document.querySelector("#empty_category").style.display = "none"; /*Hides option, change "none" to "" to display*/
		  			  
			/*DarkMode radio handler*/
			var darkMode = document.querySelector("#darkMode");
			darkMode.addEventListener("change", function() {
				var element = document.body;
				element.classList.toggle("darkMode");	/*Toggles darkMode in CSS*/
				for (let i=0; i < bookList.length; i++){
					let current_row = document.querySelector("#row"+i);	
					if (darkMode.checked) {
						if (current_row.style.backgroundColor == "cyan") {
							current_row.style.backgroundColor ="rgb(0, 0, 102)";	/*Changes highlighted cells to dark blue*/
						} else {
							current_row.style.backgroundColor ="#808080";	/*Changes non-highlighted cells to dark gray*/
						}
					} else {
						if (current_row.style.backgroundColor == "rgb(0, 0, 102)") {
							current_row.style.backgroundColor ="cyan";	/*Change back from dark blue to cyan*/
						} else {
							current_row.style.backgroundColor ="#FFFFFF";	/*Change non-highlighted cells to white*/
						}
						
					}
				}			
			});
			
			/*Search feature*/
			const searchText = document.querySelector("#searchText");	/*Creates the search object*/
			const searchButton = document.querySelector("#searchButton");	/*Creates the search button object*/
			searchButton.onclick = () => {	/*Search button being clicked*/
				let input = searchText.value;	/*Stores input from user*/
				let found = false;	/*Boolean for results*/
				for (let i = 0; i < bookList.length; i++){	/*For loop to iterate the search*/
					let current_row = document.querySelector("#row"+i);	/*Gets the row's contents*/
					if (bookList[i].title.toLowerCase().includes(input.trim().toLowerCase())){	/*Compares the input text and the titles, not case sensitive*/
						found = true;	/*Changes boolean if found*/
						console.log("DarkMode boolean "+darkMode.checked);
						if (!darkMode.checked) {
							if (input == "") {
								current_row.style.backgroundColor ="#FFFFFF";	/*Empty String, change everything back to white*/
							} else {
								current_row.style.backgroundColor ="cyan";	/*If found, change it to cyan*/     
							}
						} else {
							if (input == "") {
								current_row.style.backgroundColor ="#808080";	/*Empty String, change everything to dark gray*/
							} else {
								current_row.style.backgroundColor ="rgb(0, 0, 102)";	/*If found, change it to dark blue*/
							}
						}
					} else {
						if (!darkMode.checked) {
							current_row.style.backgroundColor ="#FFFFFF";	/*If not found, change it to white*/
						} else {
							current_row.style.backgroundColor ="#808080";	/*If found, change it to dark gray*/
						}
					}
				}
				if (!found){	/*Alerts if no results found*/
				  alert("No Results.");
				}
			}

			  /*Filter button handler*/
			  var filterButton = document.querySelector("#filterButton");
			  filterButton.onclick = () => {
				let match = 0; /*Counter for matches*/
				for (let i = 0; i < bookList.length; i++) {
				  let current_row = document.querySelector("#row"+i);	/*Iterate through each row*/
				  if (category.value == "Category") {	/*If set to "Category" display all rows*/
					for (let j = 0; j < bookList.length; j++) {
					  document.querySelector("#row"+j).style.display = "";	/*Displays the matching rows*/
					}
					break;
				  }
				  if (category.value == bookList[i].category) {	/*Display matching categories*/
					current_row.style.display = "";
					match += 1;
				  } else {
					current_row.style.display = "none" /*Don't display non-matching categories*/
				  }
				}
			 
				if (match == 0 && category.value != "Category"){
					document.querySelector("#empty_category").style.display = "";	/*Display a blank table if nothing is found*/
				} else {
					document.querySelector("#empty_category").style.display = "none";	/*Hide the blank table*/
				}
				uncheck(rows);
			  }

			  /*Add to cart handler*/
			  var cart_items = [];  //items in cart
			  var addButton = document.querySelector("#addButton");
			  var cartNumber = document.querySelector("#cartNumber");
			  addButton.onclick = () =>{
				var quantityInput = prompt("How many of these would you like?", "0");	/*Asks user quantity*/
				var quantityNum = parseInt(quantityInput);	/*Quantity input, max 100 000 000*/
				if (quantityNum > 0 && quantityNum <= 100000000) {
					var itemSelected = false;	/*Check for valid radio checking*/
					for (let i = 0; i < rows.length; i++) {
						let current_row = document.querySelector("#row"+i);	/*Gets the row's contents*/
						if (current_row != null) {
							if (current_row.querySelector('input[name="radio"]').checked) {
								itemSelected = true;	/*A valid selection has been made*/
								for (let y = 0; y < quantityNum; y++) {
									cart_items.push(rows[i]);	/*Adds items into cart, looping quantityNum times*/
								} 
							}
						}
					}
					if (!itemSelected) {
						alert("No items have been selected");
					}
					cartNumber.innerHTML = "("+ cart_items.length +")";
					uncheck(rows);
				} else {
					if (quantityNum >= 100000000) {
						alert("Quantity input is too high.");
					} else {
						alert("Invalid input.");
					}
				}				
			  }

			  /*Reset cart handler*/
			  var resetButton = document.querySelector("#resetButton");
			  uncheck(rows);	/*Unchecks all radios*/
			  resetButton.onclick = () => {
				if (confirm("Are you sure you want to reset your cart?")) {
				  cart_items = [];	/*Empty cart*/
				  cartNumber.innerHTML = "("+ cart_items.length + ")";	/*Update cart item number*/
				  alert("Cart has been reset.");
				} else {
				  alert("Reset cancelled.");
				}
			  }
		},
		function(xhr) { console.error(xhr); }	/*Provided code from assignment*/
	);
}

/*Uncheck radio*/
function uncheck(rows){
  for (let i = 0; i < rows.length; i++){
		let current_row = document.querySelector("#row" + i);	/*Gets the row's contents*/
		if (current_row != null){
				current_row.querySelector('input[name="radio"]').checked = false;	/*Unchecking*/
	  }
	}
}