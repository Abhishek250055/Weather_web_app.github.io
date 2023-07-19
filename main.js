/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
window.onload=function(){
    const form = document.querySelector(".top-banner form");
    const input = document.querySelector(".top-banner input");
    const msg = document.querySelector(".top-banner .msg");
    const list = document.querySelector(".ajax-section .cities");// this usd to connct dyn.. data set in html
    
    const apiKey = "58dc7411ca15341b13b6fcc645f90234";  // this will get from openweathermap.org this site under API key section
    
    form.addEventListener("submit", e => {
      e.preventDefault();
      let inputVal = input.value; // inpput city
    
      //check if there's already a city
      const listItems = list.querySelectorAll(".ajax-section .city");
      const listItemsArray = Array.from(listItems);
    
      if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
          let content = "";
          //athens,gr
          if (inputVal.includes(",")) {
            //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
            if (inputVal.split(",")[1].length > 2) {
              inputVal = inputVal.split(",")[0];
              content = el
                .querySelector(".city-name span")
                .textContent.toLowerCase();

            } else {
              content = el.querySelector(".city-name").dataset.name.toLowerCase();
            }
          } else {
            //athens
            content = el.querySelector(".city-name span").textContent.toLowerCase();
          }
          return content == inputVal.toLowerCase();
        });
    
        if (filteredArray.length > 0) {
          msg.textContent = ` Weather for ${
            filteredArray[0].querySelector(".city-name span").textContent
          } is already displayed. `;
          form.reset();
          input.focus();
          return;
        }
      }
    
      //ajax here
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    
      fetch(url)
        .then(response => response.json()) //api all informetion in json files
        .then(data => {
          const { main, name, sys, weather } = data;
          const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
            weather[0]["icon"]
          }.svg`;
    
          const li = document.createElement("li");
          li.classList.add("city");
          const markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
              <span>${name}</span>
              <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
              <img class="city-icon" src="${icon}" alt="${
            weather[0]["description"]
          }">
              <figcaption>${weather[0]["description"]}</figcaption>
            </figure>
          `;
          li.innerHTML = markup;
          list.appendChild(li);
        })
        .catch(() => {
          msg.textContent = "This city doesn't exist. Please search for a valid city.";
        });
    
      msg.textContent = "";
      form.reset();
      input.focus();
    });
    }