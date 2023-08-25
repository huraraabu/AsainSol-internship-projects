//sign up

//call the history for load the alraedy saved data
window.onload = function() {
  console.log("Hello");
  history();
};

//get the username and password
const nameInput = document.getElementById("user-name");
const passwordInput = document.getElementById("user-password");
const errorMessage = document.querySelector(".error");
const nextBtn = document.querySelector(".signUp-next");
//call the sign up function
function signUp() {
  window.location.href =
    "signUp.html";
}

persons = [];

//store the object of new person in array

function signUpDetail() {
  persons = localStorage.getItem("persons")
  ? JSON.parse(localStorage.getItem("persons"))
  : [];
  let newP = {
    name: nameInput.value,
    password: passwordInput.value,
    UpdateDetail: [],
  };
  persons.push(newP);
  storeData();
  nameInput.value = "";
  passwordInput.value = "";
  window.location.href = "signIn.html";
}
//call the signup function
function signIn() {
  const signUpLink = document.getElementById("sign-Up-link");
  signUpLink.addEventListener("click", signUp);
}

//store data in local storage
function storeData() {
  localStorage.setItem("persons", JSON.stringify(persons));
}
//load the data of persons
function loadData() {
  let per = localStorage.getItem("persons");
  persons = JSON.parse(per);
}

//compare the detail of person

function compareDetail() {
  for (let pObj of persons) {
    if (
      pObj.name === nameInput.value &&
      pObj.password === passwordInput.value
    ) {
      localStorage.setItem("CurrentPerson", JSON.stringify(pObj));
      gotoCrud();
    }
  }
}
//go to crud page
function gotoCrud() {
  
  window.location.href = "crud.html";

}




loadData();
signIn();

//crud  operation start from here

function crud() {

  const Number = document.getElementById("Name-input");
  const Address = document.getElementById("address-input");
  const Age = document.getElementById("age-input");
  const Email = document.getElementById("email");
  const errorMessage = document.querySelector(".Empty_error");
  var currentPerson = JSON.parse(localStorage.getItem("CurrentPerson"));
  checkEmpty(errorMessage, Number, Address, Age, Email, currentPerson);
}

//check that inputs are not empty

function checkEmpty(errorMessage, Number, Address, Age, Email, currentPerson) {
  if (
    Number.value != "" &&
    Address.value != "" &&
    Age.value != "" &&
    Email.value != ""
  ) {
  errorMessage.style.display="none";
  addDetail(currentPerson, Number, Address, Age, Email);
  editDetail(currentPerson, Number, Age, Email, Address);
  deleteDetail(currentPerson);

  } else {
    errorMessage.style.display = "block";
  }
}

//add detail of user
function addDetail(currentPerson, Number, Address, Age, Email) {
  //update the deatils

  if (currentPerson.UpdateDetail == null) {
    currentPerson.UpdateDetail = [];
  }
  //add object for extra detail
  let ExtraDetail = {
    Age: Age.value,
    Address: Address.value,
    Number: Number.value,
    Email: Email.value,
  };

  currentPerson.UpdateDetail.push(ExtraDetail);//push extra detail object in update array
  storeUpdateData(currentPerson);
  storeData();
  addRowInTable(ExtraDetail);
  //set empty values
  Number.value = "";
  Age.value = "";
  Address.value = "";
  Email.value = "";
}
function storeUpdateData(currentPerson) {
  //store  the updated data back to local storage
  persons.forEach(function (value) {
    if (value.name === currentPerson.name) {
      value.UpdateDetail = currentPerson.UpdateDetail;
    }
  });
}

//create a new row 

function createRow(currentPerson) {
  const row = `<tr class="table-row">
   <td class="table-data">${currentPerson.Number}</td>
   <td class="table-data">${currentPerson.Age}</td>
   <td class="table-data">${currentPerson.Address}</td>
   <td class="table-data">${currentPerson.Email}</td>
   <td class="table-data">
    <button class="btn" id="edit-btn">
      Edit 
    </button>
    <button class="btn" id="delete-btn">
     Delete
    </button></td>
    </tr>`;
  return row;
}


// add a new row in table

function addRowInTable(ExtraDetail) {
  
  const tableBody = document.querySelector(".table-body");
  const newRow = createRow(ExtraDetail);
  tableBody.insertAdjacentHTML("beforeend", newRow);
}
//perform the crud operation in history
function history()
{
  const Number = document.getElementById("Name-input");
  const Address = document.getElementById("address-input");
  const Age = document.getElementById("age-input");
  const Email = document.getElementById("email");
  let person=JSON.parse(localStorage.getItem("CurrentPerson"));
  addHistoryOfCrud(person);
  deleteDetail(person);
  editDetail(person,Number,Age,Email,Address); 
  setUserName();
}




//add the store data in table
function addHistoryOfCrud(currentPerson) {
  
  const tableBody = document.querySelector(".table-body");
  tableBody.classList.add("history-btn");
  for (let per of currentPerson.UpdateDetail) {
    const newRow = createRow(per);
    tableBody.insertAdjacentHTML("beforeend", newRow);
  }
}
//delete the detail 
function deleteDetail(currentPerson) {
  //get all edit buttons

  const deleteButtonList = document.querySelectorAll("#delete-btn");

  //check on click event

  deleteButtonList.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      const deleteRow = deleteBtn.closest(".table-row");
      deleteRow.remove();
      removeUpdateData(currentPerson, deleteRow);
    });
  });
}
//remove the data from update array

function removeUpdateData(currentPerson, row) {
  const cells = row.querySelectorAll(".table-data");
  for (let a in currentPerson.UpdateDetail) {
  if (cells[0].textContent === currentPerson.UpdateDetail[a].Number) {
      currentPerson.UpdateDetail.splice(a, 1);
      break;
    }
  }
  storeUpdateData(currentPerson);
  storeData();
}

//edit detail function

function editDetail(currentPerson, Number, Age, Email, Address) {
  const editButtonList = document.querySelectorAll("#edit-btn"); //get list of edit button
  editButtonList.forEach((editBtn) => {
    //check the click event
    editBtn.addEventListener("click", () => {
      const row = editBtn.closest(".table-row");
      setValue(currentPerson, row, Number, Age, Email, Address);
    });
  });
}

//set the value

function setValue(currentPerson, row, Number, Age, Email, Address) {
  const cells = row.querySelectorAll(".table-data"); // Get all table cells in the row

  // Assuming the order of the cells is: phoneNumber, Address, Age, Email
  Number.value = cells[0].textContent;
  Address.value = cells[2].textContent;
  Age.value = cells[1].textContent;
  Email.value = cells[3].textContent;
  row.remove();
  removeUpdateData(currentPerson, row);
  storeData();
}
//set the application user name in fronted
function setUserName()
{
  const userName=document.querySelector(".user-name");
  let currentPerson=JSON.parse(localStorage.getItem("CurrentPerson"));
  userName.innerHTML=currentPerson.name;
}