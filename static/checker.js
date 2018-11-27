document.addEventListener("DOMContentLoaded", function() {
  let rbp = document.querySelector('#rbp');
  let sc = document.querySelector('#sc');
  let mhra = document.querySelector('#mhra');
  let std = document.querySelector('#std');
  let f = document.querySelector('#f');

  let rbpSlider = document.querySelector('#rbp-slider');
  let scSlider = document.querySelector('#sc-slider');
  let mhraSlider = document.querySelector('#mhra-slider');
  let stdSlider = document.querySelector('#std-slider');
  let fSlider = document.querySelector('#f-slider');

  let form = document.querySelector('#heart-form');

  let nameInput = document.querySelector('#name-input');
  let ageInput = document.querySelector('#age-input');

  let titleResult = document.querySelector('#title-result');
  let diseaseResult = document.querySelector('#disease-result');

  let input = document.querySelector('#form-input');
  let output = document.querySelector('#form-output');
  let loader = document.querySelector("#loader");

  let back = document.querySelector('#back');

  addInputChangeListener(nameInput, (event) => {
    let value = event.target.value;
    if (value.length < 4) nameInput.classList.add('is-danger');
    else nameInput.classList.remove('is-danger'); 
  });
  addInputChangeListener(ageInput, (event) => {
    let value = event.target.value;
    let regex = /^[1-9][0-9]{0,1}$/;
    if (!value.match(regex)) ageInput.classList.add('is-danger');
    else ageInput.classList.remove('is-danger'); 
  });

  addSliderChangeListener(rbpSlider, rbp);
  addSliderChangeListener(scSlider, sc);
  addSliderChangeListener(mhraSlider, mhra);
  addSliderChangeListener(stdSlider, std);
  addSliderChangeListener(fSlider, f);

  back.addEventListener("click", () => {
    input.style.display = "block";
    output.style.display = "none";
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    let form = document.forms["heart-form"].elements;
    let payload = {};
    for (let val of form) {
      if ((val.type !== 'radio' || val.checked) && val.type !== 'submit') {
        payload[`${val.name}`] = val.value;
      } 
    }
    console.log(payload);
    if (!checkInput(payload, nameInput, ageInput)) return false;
    let response = await fetch('/api/prediction', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    let data = await response.json();
    console.log(data);
    // Put result to display
    input.style.display = "none";
    loader.style.display = "block";
    titleResult.innerHTML = `Hello ${data.name}!!`;
    diseaseResult.innerHTML = data.prediction;
    if (data.prediction != 0) {
      document.querySelector('#info-result').innerHTML = 'Ups.. You have heart disease..';
    } else {
      document.querySelector('#info-result').innerHTML = "It means you're healthy!";
    }
    // To making things beautiful
    setTimeout(() => {
      loader.style.display = "none";
      output.style.display = "block";
    }, 2000);
    // Chart
    $('#pie-chart').remove();
    $('#result-chart').append('<canvas id="pie-chart" width="500" height="500"></canvas>');
    let canvas = document.querySelector('#pie-chart').getContext("2d");
    let chart = new Chart(canvas, {
      type: 'pie',
      data: {
        datasets: [{
          data: [data.percentage[0], data.percentage[1], data.percentage[2], data.percentage[3], data.percentage[4]],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)'
          ]
        }],
        labels: ['Stage 0', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4']
      },
      options: {
        responsive: false
      }
    });
  })
}, false);

function addSliderChangeListener(slider, html) {
  slider.addEventListener('change', (event) => {
    html.innerHTML = event.target.value;
  })
}

function addInputChangeListener(input, callback) {
  input.addEventListener('change', callback);
}

function checkInput(payload, nameInput, ageInput) {
  let status = true;
  if (payload.name.length < 4) {
    nameInput.classList.add('is-danger');
    status = false;
  }
  let regex = /^[1-9][0-9]{0,1}$/;
  if (!payload.age.match(regex)) {
    ageInput.classList.add('is-danger');
    status = false;
  }
  return status
}