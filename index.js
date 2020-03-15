<!--function provided to read the JSON files-->
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
	<!--provided code to read JSON file-->
	bookList = []; // book list container
	getJsonObject('data.json',
		function(data) {
			bookList = data; // store the book list into bookList
			//console.log(bookList); // print it into console (developer tools)
			//console.log(bookList[0]); // print the first book object into console 
			// here you can call methods to laod or refresh the page 
			// loadBooks() or refreshPage()
			
			const category = document.querySelector("#category");	<!--Gets the HTMLElement Category object-->
			const tableBody = document.querySelector("#listBox table tbody");		<!--Gets the HTMLElement Table object-->
			var rows = tableBody.childNodes;
			var categories = [];
			
			for (let i = 0; i < bookList.length; i++) {		<!--Loop through the whole JSON file-->
				if (!(categories.includes(bookList[i].category))) {
					categories.push(bookList[i].category);	<!--Adds the JSON element "category" to the categories array-->
					
					let newCategory = document.createElement("option");	<!--Creates a new option for the category-->
					newCategory.innerHTML = bookList[i].category;	<!--Sets the HTML element's content to the input category-->
					newCategory.setAttribute("value", bookList[i].category);	<!--Sets the value attribute to the new option-->
					category.appendChild(newCategory);		<!--Adds the new category option to the HTML Category object-->
				}
				
				let rows = document.createElement("tr");	<!--Elements for the table body, adding in respective content for each row-->
				rows.innerHTML = "<td><input type=\"checkbox\" id=\"checkbox\"></td>" +	<!--Checkbox-->
								"<td><img src=\"" + bookList[i].img +"\" height=\";100\"; width=\"80\"></td>"+	<!--Image-->
								"<td width = \"30%\">" + bookList[i].title +"</td>";	<!--Title-->
				
				<!--Converts the rating to an int to iterate through and add in appropriate stars for the rating-->
				var ratingString = "<td>";		
				var ratingNumber = parseInt(bookList[i].rating);
				for (let j = 0; j < ratingNumber; j++) {
					ratingString += "<img src=\"" + "/images/star-16.ico" +"\" class = \"star\">";	<!--Adding filled stars-->
				}
				if (ratingNumber < 5){
					for (let p = 0; p < (5 - ratingNumber); p++) {
						ratingString += "<img src=\"" + "/images/outline-star-16.ico" +"\" class = \"star\">";	<!--Adding empty stars-->
					}
				}
				ratingString += "</td>";	<!--End of rating-->
				
				rows.innerHTML += ratingString + 
								"<td>" + bookList[i].authors +"</td>"+ <!--Authors-->
								"<td>" + bookList[i].year +"</td>"+	<!--Year-->
								"<td>" + bookList[i].price +"</td>"+	<!--Price-->
								"<td>" + bookList[i].publisher +"</td>"+	<!--Publisher-->
								"<td>" + bookList[i].category +"</td>";	<!--Category-->
				rows.setAttribute("id", "row" + i);	<!--Sets the new row's ID to the row number of the table-->
				tableBody.append(rows);	<!--Adds the JSON information into a new row of the table body--> 
			}


			<!--Extra category that isn't in the bookstore-->
			{let newCategory = document.querySelector("#empty_category");	<!-- Creates the category option object-->
			newCategory.innerHTML = "Extra";	<!--Sets the contents of the new option to "Test"-->
			newCategory.setAttribute("value", newCategory.innerHTML);	<!--Sets the value-->
			category.appendChild(newCategory);}	<!--Adds the new category to the list-->
			document.querySelector("#empty_category").style.display = "none"; <!--Hides option, change "none" to "inline" to display-->
		  
		  var darkMode = document.querySelector("#darkMode");
			  

				//if the checkbox state is changed, run a funtion
			darkMode.addEventListener("change", function() {

					var element = document.body;
					element.classList.toggle("darkMode");
					for (let i=0; i < bookList.length; i++){
						let current_row = document.querySelector("#row"+i);	
						if (darkMode.checked) {
							if (current_row.style.backgroundColor == "cyan") {
								current_row.style.backgroundColor ="rgb(0, 0, 102)";
							} else {
								current_row.style.backgroundColor ="#808080";
							}
						} else {
							console.log("unchecked!");
							console.log(current_row.style.backgroundColor);
							if (current_row.style.backgroundColor == "rgb(0, 0, 102)") {
								console.log("hey it's gray so let's make it cyan");
								current_row.style.backgroundColor ="cyan";	<!--If not found, change it to white-->
							} else {
								current_row.style.backgroundColor ="#FFFFFF";
							}
							
						}
					}			
			});
			
			<!--Search feature-->
			const searchText = document.querySelector("#searchText");	<!--Creates the search object-->
			const searchButton = document.querySelector("#searchButton");	<!--Creates the search button object-->
			searchButton.onclick = () => {	<!--Search button being clicked-->
				let input = searchText.value;	<!--Stores input from user-->
				let counter = 0; <!--Counter for results-->
				for (let i=0; i < bookList.length; i++){	<!--For loop to iterate the search-->
					let current_row = document.querySelector("#row"+i);	<!--Gets the row's contents-->
					if (bookList[i].title.toLowerCase().includes(input.trim().toLowerCase())){	<!--Compares the input text and the titles, not case sensitive-->
											counter++;	<!--Increases counter if found-->
						console.log("DarkMode boolean "+darkMode.checked);
						if (!darkMode.checked) {
							if (input == "") continue;
							current_row.style.backgroundColor ="cyan";	<!--Changes the corresponding rows to cyan-->     
						} else {
							if (input == "") continue;
							current_row.style.backgroundColor ="rgb(0, 0, 102)";
						}
					 
					} else {
						if (!darkMode.checked) {
							current_row.style.backgroundColor ="#FFFFFF";	<!--If not found, change it to white-->
						} else {
							current_row.style.backgroundColor ="#808080";
						}
					}
				}
				if (counter == 0){
				  alert("No Results.");
				}
			}

			  //filter
			  var filterButton = document.querySelector("#filterButton");
			  filterButton.onclick = ()=>{
				//reset_checked_state(rows)
				let match = 0; //match counter
				for (let i=0; i<bookList.length; i++){
				  let current_row = document.querySelector("#row"+i);
				  if (category.value=="Category"){//reset filter: display all rows
					for (let i=0; i<bookList.length; i++){
					  document.querySelector("#row"+i).style.display = "";
					}
					break;
				  }
				  if (category.value==bookList[i].category){
					current_row.style.display = "";
					match += 1;
				  }else{
					current_row.style.display = "none" //hide rows
				  }
				}
			 
				if (match == 0 && category.value != "Category"){// if empty category

					document.querySelector("#empty_category").style.display = "";
						   console.log(document.querySelector("#empty_category"))
				}else {
					document.querySelector("#empty_category").style.display = "none";
				}
				uncheck(rows);
			  }

			  //add to cart
			  var cart_items = [];  //items in cart
			  var addButton = document.querySelector("#addButton");
			  var cartNumber = document.querySelector("#cartNumber");
			  addButton.onclick = ()=>{
				var counteridk = 0;
				console.log(rows.length);
				for (let i=0; i<rows.length; i++){
					let current_row = document.querySelector("#row"+i);	<!--Gets the row's contents-->
					if(current_row != null){   // allow duplicate items
						if (current_row.querySelector("#checkbox").checked == true) {
							console.log("hey we get here" + counteridk++);
							cart_items.push(rows[i])
						}
				  }
				}
				console.log("Length be " + cart_items.length);
				cartNumber.innerHTML = "("+ cart_items.length + ")";
				uncheck(rows);
			  }

			  //reset cart
			  var resetButton = document.querySelector("#resetButton");
			  uncheck(rows);
			  resetButton.onclick = () => {
				if(confirm("This will Empty Your Shopping Cart. Proceed?")){
				  cart_items = [];
				  cartNumber.innerHTML = "("+ cart_items.length + ")";
				  alert("Your Shopping Cart is Empty!");
				  //reset_checked_state(rows);
				}else{
				  alert("Operation Cancelled.");
				}
			  }
		},
		function(xhr) { console.error(xhr); }
	);
}
// clear all checked state
		function uncheck(rows){
		  for (let i=0; i<rows.length; i++){
				let current_row = document.querySelector("#row"+i);	<!--Gets the row's contents-->
				if(current_row != null){   // allow duplicate items
						current_row.querySelector("#checkbox").checked = false;
			  }
			}
		}