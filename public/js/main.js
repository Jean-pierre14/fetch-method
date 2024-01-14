const btn = Boolean(false);
let result = document.getElementById("results");
const myForm = document.getElementById("myForm"),
  error = document.getElementById("error");

// Selecting data using Fetch method
let output = ``;

let Init = async () => {
  await SelectAll().then(() => {
    getOneCourse();
  });
};

const SelectAll = async () => {
  output = "";
  btn = new Boolean(true);
  await fetch("http://localhost:7000/api")
    .then((res) => {
      return res.json().then((data) => {
        data.courses.forEach((course) => {
          output += `
              <div class="d-flex shadow-sm my-3 p-3 justify-content-between align-items-center">
                <span>${course.name}</span>
                <div class="btn-group">
                  <button type="button" id="${course._id}" class="edit btn btn-sm btn-info">Edit</button>    
                  <button type="button" id="${course._id}"class="delete btn btn-sm btn-danger">Delete</button>    
                </div>
              </div>
              `;
        });
        result.innerHTML = output;
      });
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      result.innerHTML =
        '<p class="alert alert-danger">You are not connect to the server.</p>';
    });
};

// BTN config
let btnEvent = document.getElementById("btn_submit");

if (btn) {
  btnEvent.textContent = "Register";
  btnEvent.classList.remove("btn-warning");
  btnEvent.classList.add("btn-primary");
} else {
  btnEvent.textContent = "Update";
  btnEvent.classList.remove("btn-primary");
  btnEvent.classList.add("btn-warning");
}

// Get one course
const getOneCourse = () => {
  // result.innerHTML = "";
  const get = document.querySelectorAll(".edit").forEach((el) => {
    el.onclick = (event) => {
      const element_ID = event.target.id;
      // console.log("Id: " + element_ID);
      btn = Boolean(false);
      result.innerHTML = '<p class=" alert alert-warning">Loading...</p>';

      fetch(`http://localhost:7000/api/${element_ID}`)
        .then((res) =>
          res.json().then((data) => {
            result.innerHTML = "";
            console.log(data);
            result.innerHTML = `
                <div class="card card-body shadow-sm">
                  <h3 class="nameValue">Name: ${data.courses.name}</h3>
                  <p><strong>Description:</strong> <span class="descValue">${data.courses.description}</span></p>
                  <div class="close">
                    <button class="btn btn-sm btn-info" type="button">Back to the list</button>  
                  </div>
                </div>`;

            const name = document.querySelector("#name"),
              desc = document.querySelector("#desc");

            name.value = data.courses.name;
            desc.value = data.courses.description;
          })
        )
        .catch((err) => {
          console.log("Error: " + err.message);
          // result.innerHTML =
          //   '<p class="alert alert-danger">You are not connect to the server.</p>';
        });
    };
  });
};

myForm.onsubmit = (event) => {
  event.preventDefault();

  const formData = new FormData(myForm),
    data = new URLSearchParams(formData);

  // console.log(formData.get("name"));

  // There no validation form here... :)

  fetch("http://localhost:7000/api", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (data.status === 200) {
        result.innerHTML = "";
        myForm.reset(0);
        Init();
      } else {
        return;
      }
    })
    .catch((err) => {
      error.innerHTML =
        '<p class="alert alert-danger">You are not connect to the server...</p>';
      console.log(`Error: ${err.message}`);
    });
};


function update(event){
  // PreventDefaut behavior
  
  event.preventDefault();
  
}

Init();
