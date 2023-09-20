let NumberOfNotifications = 0;
const UserName = document.querySelector("#User-name");
const UserPassword = document.querySelector("#User-password");
const UserMail = document.querySelector("#User-email");
let persons = [];
//sign in

//get the persons stored  from local storage
function getdata() {
  persons = JSON.parse(localStorage.getItem("persons"));
}
getdata();
//store the signUp detail
function signUp() {
  if (persons == null) {
    persons = [];
  }
  if (isAdminAdd() === false) {
    UserRole = getRole();
    let newPer = {
      name: UserName.value,
      password: UserPassword.value,
      mail: UserMail.value,
      role: UserRole,
      isDetailAdd: "No",
      isApprove: "No",
    };
    persons.push(newPer);
    storeData();

    successMessage("SignUp Successfully").then(() => {
      window.location.href = "SignIn.html";
    });
  } else {
    failMessage("Admin already exist!").then(() => {
      window.location.href = "Role.html";
    });
  }
}
//is admin add
function isAdminAdd() {
  if (getUserRole() === "Admin") {
    persons.forEach((per) => {
      if (per.role === "Admin") {
        return true;
      }
    });
  }
  return false;
}
//sign in method
function signIn() {
  signintoApp();
}
//call the function for signin
function signintoApp() {
  let isUserExist = compareDetail();
  if (isUserExist === true) {
    successMessage("SignIn Successfully").then(() => {
      // After the success message is displayed for 2 seconds, this code will execute.
      callPage();
    });
  } else {
    failMessage("Invalid UserName and Password!");
  }
}
//fail message show
function failMessage(Message) {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: Message,
  });
}
function deleteMessage() {}
//call the current person page
function callPage() {
  //check the condition
  const CurrentPersonrole = getCurrentPerson().role;
  console.log(CurrentPersonrole);
  if (CurrentPersonrole === "Candidate") {
    window.location.href = "Candidate.html";
  } else if (CurrentPersonrole === "Voter") {
    window.location.href = "Voter.html";
  } else if (CurrentPersonrole === "PartyHead") {
    window.location.href = "PartyHead.html";
  } else if (CurrentPersonrole === "Admin") {
    window.location.href = "Admin.html";
  }
}
//store role in local storage
function setRole(role) {
  localStorage.setItem("UserRole", JSON.stringify(role));
  window.location.href = "SignUp.html";
}
//return role from local storage
function getRole() {
  return JSON.parse(localStorage.getItem("UserRole"));
}
//store the persons detail
function storeData() {
  localStorage.setItem("persons", JSON.stringify(persons));
}
//compare the detail
function compareDetail() {
  let isUserExist;
  for (let per of persons) {
    if (
      per.name === UserName.value &&
      per.password === UserPassword.value &&
      per.role === getRole()
    ) {
      setCurrentPerson(per);
      isUserExist = true;
      break;
    } else {
      isUserExist = false;
    }
  }
  return isUserExist;
}

//set the current person in local storage
function setCurrentPerson(person) {
  localStorage.setItem("CurrentPerson", JSON.stringify(person));
}

//return the current person from local storage
function getCurrentPerson() {
  return JSON.parse(localStorage.getItem("CurrentPerson"));
}

//call the registration form
function gotoRegistrationForm() {
  if (getCurrentPerson() !== null) {
    if (getUserRole() !== "Voter") {
      callRegistrationForm();
    } else {
      if (isElectionStart === "yes") {
        callRegistrationForm();
      } else {
        console.log("Election is not start yet");
      }
    }
  } else {
    window.location.href = "RegistrationForm.html";
  }
}
function callRegistrationForm() {
  if (getCurrentPerson().isDetailAdd === "No") {
    window.location.href = "RegistrationForm.html";
  } else {
    failMessage("You already add your details");
  }
}

//call the party head registration form
function gotoPartyHeadRegistrationForm() {
  if (getCurrentPerson().isDetailAdd === "No") {
    window.location.href = "PartyHeadRegistrationForm.html";
  } else {
    failMessage("You already add your details");
  }
}
const Cinc = document.querySelector("#cinc-in");
const DOB = document.querySelector("#DOB-in");
const Gender = document.querySelector("#Select-gender");
const City = document.querySelector("#City-in");
const PhoneNumber = document.querySelector("#Phone-in");
const MessageToAdmin = document.querySelector("#Message-in");
const PartyName = document.querySelector(".party-in");
//add detail for vote
function addDetailForVote() {
  let CurrentPerson = getCurrentPerson();
  // let VoterObj = new Object();
  if (checkDate(DOB.value) === true) {
    if (getUserRole() === "Voter") {
      registeredDetail(CurrentPerson); //check that kvoter adds
      successMessage("Details Add").then(() => {
        window.location.href = "Voter.html";
      });
    } else if (CurrentPerson.role === "Candidate") {
      registeredDetail(CurrentPerson); //check that candidate adds
      successMessage("Details Add").then(() => {
        window.location.href = "Candidate.html";
      });
    } else if (CurrentPerson.role === "PartyHead") {
      registeredDetail(CurrentPerson); //check that partyHead adds
      successMessage("Details Add").then(() => {
        window.location.href = "PartyHead.html";
      });
    } else if (CurrentPerson.role === "Admin") {
      registeredDetail(CurrentPerson); //check that admin adds
      successMessage.then(() => {
        window.location.href = "Admin.html";
      });
    }
  } else {
    failMessage("Age must be greater then 18!");
  }
}

//call for  edit profile
function editDetail() {
  window.location.href = "RegistrationForm.html";
}

function setEditDetail(CurrentPerson) {
  if (
    Cinc !== null &&
    City !== null &&
    DOB !== null &&
    PhoneNumber !== null &&
    MessageToAdmin !== null &&
    Gender !== null &&
    CurrentPerson.City !== undefined &&
    CurrentPerson.DOB !== undefined
  ) {
    Cinc.value = CurrentPerson.Cinc;
    City.value = CurrentPerson.City;
    DOB.value = CurrentPerson.DOB;
    PhoneNumber.value = CurrentPerson.PhoneNumber;
    MessageToAdmin.value = CurrentPerson.MessageToAdmin;
    Gender.value = CurrentPerson.Gender;
  }
}

//get the user role from local storage
function getUserRole() {
  return JSON.parse(localStorage.getItem("UserRole"));
}
//registered data person list
function registeredDetail(CurrentPerson) {
  setDetail(CurrentPerson);
  setCurrentPerson(CurrentPerson);
  UpdateDetailInPersonList();
}
//set the detail of voter
function setDetail(CurrentPerson) {
  CurrentPerson.isDetailAdd = "yes";
  CurrentPerson.Cinc = Cinc.value;
  CurrentPerson.City = City.value;
  CurrentPerson.DOB = DOB.value;
  CurrentPerson.PhoneNumber = PhoneNumber.value;
  CurrentPerson.MessageToAdmin = MessageToAdmin.value;
  CurrentPerson.Gender = Gender.value;
  if (CurrentPerson.role === "PartyHead") {
    CurrentPerson.partyName = PartyName.value;
  }
}
//update the voter in person list
function UpdateDetailInPersonList() {
  let CurrentPerson = getCurrentPerson();

  for (let per of persons) {
    if (
      per.name === CurrentPerson.name &&
      per.role === CurrentPerson.role &&
      per.password &&
      CurrentPerson.password
    ) {
      setDetail(per);
      break;
    }
  }
  storeData();
}
//decalre the variable here
var months = "",
  days = "",
  year = "";
//check the validation of details
function checkDate(DOB) {
  const DOB_Array = DOB.split("-");
  year = DOB_Array[0];
  months = DOB_Array[1];
  days = DOB_Array[2];
  return IsEligibleForVote();
}
//check the eligibilty of voter
function IsEligibleForVote() {
  let DaysIn18Years = 6480;
  let totalDays = getDayInMonths() + getDayInYear() + parseInt(days);
  if (totalDays >= DaysIn18Years) {
    return true;
  } else {
    return false;
  }
}
//return the total days in months
function getDayInMonths() {
  let totalDays = parseInt(months) * 30;
  return totalDays;
}
//return the total days in year
function getDayInYear() {
  let totalDays = (2023 - parseInt(year)) * 12 * 60;
  return totalDays;
}

//set the detail empty
function setVoterDetailEmpty() {
  Cinc.value = "";
  PhoneNumber.value = "";
  DOB.value = "";
  City.value = "";
  MessageToAdmin.value = "";
  Gender.value = "";
}

//DOM values
const TotalVoter = document.querySelector(".Voters");
const TotalCandidate = document.querySelector(".Pending-Candidate");
const TotalPartyHead = document.querySelector(".Pending-PartyHeads");
const TotalApprovedPartyHead = document.querySelector(".PartyHeads");
const TotalApprovedCandidate = document.querySelector(".Candidates");
const CandidateOfSpecificCity = document.querySelector(".City-Candidates");
const TicketWaitingCandidate = document.querySelector(
  ".Ticket-waiting-Candidate"
);
const notif = document.querySelector(".Notification-count");
const PartyVoters = document.querySelector(".party-Voters");
const PartyNameOfPartyHead = document.querySelector(".party-Name");
const PartyNameOfCandidate = document.querySelector(".Candidate-party-Name");
const TicketHolderCandidate = document.querySelector(
  ".Ticket-Holder-Candidate"
);
const competetorCandidate = document.querySelector(".Competetor-Candidate");
const SamePartyCandidate = document.querySelector(".Same-Party-Candidate");
//update the dashboard of candidate
let CandidateVoters = 0;
//set candidate dashboard
function CandidateDashboard() {
  let totalVoterOfCandidate = document.querySelector(".Candidate-Voter");
  if (getCurrentPerson() !== null) {
    if (getCurrentPerson().role === "Candidate") {
      if (getCurrentPerson().Voters !== undefined) {
        CandidateVoters = getCurrentPerson().Voters.length;
      }
    }
    if (totalVoterOfCandidate !== null) {
      totalVoterOfCandidate.innerHTML = CandidateVoters;
    }
  }
}

//set the admin name porfile portal
function setName() {
  const NameElement = document.querySelector(".profile-name");
  const PrfoileRole = document.querySelector(".role");

  if (NameElement !== null && PrfoileRole !== null) {
    NameElement.innerHTML = getCurrentPerson().name;
    PrfoileRole.innerHTML = getCurrentPerson().role;
  }
}
setName();

//set the total numbers of voter
if (getCurrentPerson() !== null) {
  function showDetailInAdminDashBoard() {
    let ApprovedCandidateCount = 0;
    let ApprovedPartyHeadCount = 0;
    let voterCount = 0;
    let CandidateCount = 0;
    let PartyHeadCount = 0;
    let CandidateOfCity = 0;
    let TicketWaitingCan = 0;
    let PartyVotersCount = 0;
    let NumberOfTicketHolderCandidate = 0;
    let numberOfCompetetorCandidate = 0;
    let numberSamePartyCandidate = 0;

    //compare the role and count the persons
    console.log("dashboard");
    persons.forEach((per) => {
      if (per.role === "Voter") {
        voterCount++;
      }
      if (per.role === "PartyHead" && per.isApprove === "No") {
        PartyHeadCount++;
      }
      if (per.role === "Candidate" && per.isApprove === "No") {
        CandidateCount++;
      }
      if (per.role === "Candidate" && per.isApprove === "yes") {
        ApprovedCandidateCount++;
      }
      if (per.role === "PartyHead" && per.isApprove === "yes") {
        ApprovedPartyHeadCount++;
      }
      if (getCurrentPerson() !== null) {
        if (
          per.role === "Candidate" &&
          per.isApprove == "yes" &&
          per.partyName !== undefined &&
          per.City === getCurrentPerson().City &&
          per.City !== undefined
        ) {
          CandidateOfCity++;
        }
      }
      if (
        per.role === "Candidate" &&
        per.partyName === undefined &&
        per.isApprove === "yes"
      ) {
        TicketWaitingCan++;
      }
      if (
        per.role === "Voter" &&
        per.partyName === getCurrentPerson().partyName &&
        getCurrentPerson().partyName !== undefined
      ) {
        PartyVotersCount++;
      }
      if (
        per.role === "Candidate" &&
        per.partyName === getCurrentPerson().partyName &&
        getCurrentPerson().partyName !== undefined
      ) {
        NumberOfTicketHolderCandidate++;
      }
      if (
        per.role === "Candidate" &&
        per.isApprove === "yes" &&
        per.City === getCurrentPerson().City &&
        per.partyName !== undefined &&
        getCurrentPerson().City !== undefined
      ) {
        if (per.partyName !== getCurrentPerson().partyName) {
          numberOfCompetetorCandidate++;
        } else if (per.partyName === getCurrentPerson().partyName) {
          numberSamePartyCandidate++;
        }
      }
      setDashBoard(
        numberSamePartyCandidate,
        numberOfCompetetorCandidate,
        NumberOfTicketHolderCandidate,
        TicketWaitingCan,
        voterCount,
        ApprovedCandidateCount,
        ApprovedPartyHeadCount,
        CandidateCount,
        PartyHeadCount,
        ApprovedPartyHeadCount,
        CandidateOfCity,
        PartyVotersCount
      );
    });
  }
}
//set detail in dashboard
function setDashBoard(
  numberSamePartyCandidate,
  numberOfCompetetorCandidate,
  NumberOfTicketHolderCandidate,
  TicketWaitingCan,
  voterCount,
  ApprovedCandidateCount,
  ApprovedPartyHeadCount,
  CandidateCount,
  PartyHeadCount,
  ApprovedPartyHeadCount,
  CandidateOfCity,
  PartyVotersCount
) {
  if (SamePartyCandidate !== null) {
    SamePartyCandidate.innerHTML = numberSamePartyCandidate;
  }
  if (competetorCandidate !== null) {
    competetorCandidate.innerHTML = numberOfCompetetorCandidate;
  }
  if (TicketHolderCandidate !== null) {
    TicketHolderCandidate.innerHTML = NumberOfTicketHolderCandidate;
  }
  if (
    PartyNameOfPartyHead !== null &&
    getCurrentPerson().partyName !== undefined
  ) {
    PartyNameOfPartyHead.innerHTML = getCurrentPerson().partyName;
  }
  if (
    PartyNameOfCandidate !== null &&
    getCurrentPerson().partyName !== undefined
  ) {
    PartyNameOfCandidate.innerHTML = getCurrentPerson().partyName;
  }
  if (TicketWaitingCandidate !== null) {
    TicketWaitingCandidate.innerHTML = TicketWaitingCan;
  }
  if (TotalVoter !== null) {
    TotalVoter.innerHTML = voterCount;
  }
  if (notif !== null) {
    notif.innerHTML = getRemainingNotification();
  }
  if (TotalApprovedCandidate !== null) {
    TotalApprovedCandidate.innerHTML = ApprovedCandidateCount;
  }
  if (TotalCandidate !== null) {
    TotalCandidate.innerHTML = CandidateCount;
  }
  if (TotalPartyHead !== null) {
    TotalPartyHead.innerHTML = PartyHeadCount;
  }
  if (TotalApprovedPartyHead !== null) {
    TotalApprovedPartyHead.innerHTML = ApprovedPartyHeadCount;
  }
  if (CandidateOfSpecificCity !== null) {
    CandidateOfSpecificCity.innerHTML = CandidateOfCity;
  }
  if (PartyVoters !== null) {
    PartyVoters.innerHTML = PartyVotersCount;
  }
}
//get reaminig notifications
function getRemainingNotification() {
  let RemainingNumber;
  let CurrentPerson = getCurrentPerson();
  if (getCurrentPerson().Notifications === undefined) {
    RemainingNumber = 0;
  } else {
    if (CurrentPerson.previuosNotification === undefined) {
      CurrentPerson.previuosNotification = 0;
    }
    RemainingNumber =
      CurrentPerson.Notifications.length - CurrentPerson.previuosNotification;
    setCurrentPerson(CurrentPerson);
    Update(CurrentPerson);
  }
  return RemainingNumber;
}

function storeNotificationInLocalStorage(TotalNotifications) {
  if (getCurrentPerson().Notifications !== undefined) {
    localStorage.setItem("Notification", JSON.stringify(TotalNotifications));
  }
}
function getNotification() {
  NumberOfNotifications = localStorage.getItem("Notification");
}
let PersonRole, PersonisApprove, PersonHasParty, PersontableFor;

//set Voter Detail in Table
function createTableHead(usedFor) {
  console.log(usedFor);
  let partyName = "";
  let City = getFilterForCity();
  let Action = getActionHead();
  if (
    usedFor === "Voter" ||
    usedFor === "competetorCandidate" ||
    usedFor === "SamePartyCandidate" ||
    usedFor === "VoteOfAdmin"
  ) {
    if (getCurrentPerson().isVoteAdd === "yes") {
      Action = "";
    }
    partyName = `<th>Party Name
    </th>`;
  }
  if (
    usedFor === "admin" ||
    getCurrentPerson().role === "Voter" ||
    usedFor === "VoteOfAdmin"
  ) {
    partyName = `<th>Party Name
    <select id="PartyName-dropdown">
    <option value="option1" selected class="options"> </option>
    ${getAllPartiesOption("PartyHead")}
    </select>
    </th>`;
  }
  if (
    getCurrentPerson().role === "Candidate" ||
    getCurrentPerson().role === "PartyHead"
  ) {
    Action = "";
  }
  if (usedFor === "PartyHeadOfCandidate" || usedFor === "WaitingCandidate") {
    Action = getActionHead();
  }
  if (getCurrentPerson().role === "Voter") {
    City = `<th> City</th>`;
  }

  const thead = `<thead class="Voter-head">
    <tr>
      <th class="Name-col">Name</th>
      <th>Password</th>
      <th>CINC</th>
      <th>Phone Number</th>
      <th>Date Of Birth</th>
      <th>Email</th>
      <th>Message</th>
      <th>Gender
      <select id="Gender-dropdown">
      <option value="option1" selected class="options"> </option>
      <option value="option2" class="options">Male</option>
      <option value="option3" class="options">Female</option>
      <option value="option4" class="options">Others</option>
      </select></th>
      ${City}
      ${partyName}
      ${Action}
    </tr>
  </thead>`;
  return thead;
}
function getFilterForCity() {
  let city = `<th>City
      <select id="city-dropdown">
      <option value="option1" selected class="options"> </option>
      ${getAllCityOptions()}
      </select>
      </th>`;
  return city;
}

let FilterParty = "",
  FilterGender = "",
  FilterCity = "";
//check option change and call for updation
function checkOptionChange(role, isApprove, HasParty, tableFor) {
  //get the option drop down
  console.log("enter");
  let partyOPtion;
  let cityOption;
  if (
    getCurrentPerson().role !== "PartyHead" ||
    getCurrentPerson().role !== "Candidate"
  ) {
    partyOPtion = document.querySelector("#PartyName-dropdown");
  }

  const maleOPtion = document.querySelector("#Gender-dropdown");
  if (
    getCurrentPerson().role !== "Candidate" &&
    getCurrentPerson().role !== "Voter"
  ) {
    cityOption = document.querySelector("#city-dropdown");
  }

  //get the selected one option and set it
  if (
    (partyOPtion !== undefined || getCurrentPerson().role === "PartyHead") &&
    maleOPtion !== undefined &&
    (cityOption !== undefined ||
      getCurrentPerson().role === "Candidate" ||
      getCurrentPerson().role === "Voter")
  ) {
    if (
      getCurrentPerson().role !== "PartyHead" &&
      getCurrentPerson().role !== "Candidate"
    ) {
      getOptionText(partyOPtion, role, "Party", isApprove, HasParty, tableFor);
    }

    getOptionText(maleOPtion, role, "Gender", isApprove, HasParty, tableFor);
    if (
      getCurrentPerson().role !== "Candidate" &&
      getCurrentPerson().role !== "Voter"
    ) {
      getOptionText(cityOption, role, "City", isApprove, HasParty, tableFor);
    }
  }
}

//call filter table
let OptionText;
function getOptionText(
  InputOption,
  role,
  usedFor,
  isApprove,
  HasParty,
  tableFor
) {
  InputOption.addEventListener("change", function (event) {
    OptionText = event.target.options[event.target.selectedIndex].text;
    setValues(usedFor);
    filterTable(role, isApprove, HasParty, tableFor);
  });
}
function setValues(usedFor) {
  if (usedFor === "Party") {
    FilterParty = OptionText;
  } else if (usedFor === "Gender") {
    FilterGender = OptionText;
  } else if (usedFor === "City") {
    FilterCity = OptionText;
  }
}
let PartiesSet = new Set();

function getAllParty() {
  persons.forEach((per) => {
    if (per.role === "PartyHead") {
      PartiesSet.add(per.partyName);
    }
  });
}
getAllParty();
//get option of all Parties
function getAllPartiesOption(role) {
  let options = "";
  for (let Parti of PartiesSet) {
    options += createOption(Parti);
  }
  return options;
}
//get the options of all city
function getAllCityOptions() {
  let Options = "";
  for (let ci of CandidateCities) {
    Options += createOption(ci);
  }
  return Options;
}

//create randomly options
function createOption(PartyName) {
  const opt = `<option value="option1" class="options">${PartyName}</option>`;
  return opt;
}

//get action head
function getActionHead() {
  return `<th>Action</th>`;
}
//set and create row for voter table
function CreateTableRow(per, role, isApprove, HasParty, tableFor) {
  //declare the variable
  let ApproveBtn = "";
  let TicketBtn = "";
  let PartyNameRow = "";
  let VoteBtn = "";
  let deleteBtn = getDeleteBtn();
  let returnTicket = "";
  if (tableFor === "PartyHeadOfCandidate") {
    returnTicket = getReturnTicket();
  }
  //check the eligibilty of approve btn
  if (role === per.role && isApprove === "No" && role !== "Voter") {
    ApproveBtn = getApproveBtn();
  }
  //check the eligiblity of ticket btn
  if (role === per.role && isApprove === "yes" && HasParty === "No") {
    TicketBtn = getTicketBtn();
    deleteBtn = "";
  }
  if (tableFor === "Voter" || tableFor === "VoteOfAdmin") {
    PartyNameRow = `<td>${per.partyName} </td>`;
    if (getCurrentPerson().isVoteAdd === "yes") {
      VoteBtn = "";
      deleteBtn = "";
    } else {
      deleteBtn = "";
      VoteBtn = getVoteBtn();
    }
  }
  if (
    getCurrentPerson().role === "Candidate" ||
    getCurrentPerson().role === "PartyHead"
  ) {
    deleteBtn = "";
  }
  if (
    tableFor === "admin" ||
    tableFor === "competetorCandidate" ||
    tableFor === "SamePartyCandidate"
  ) {
    if (per.partyName !== undefined) {
      PartyNameRow = `<td>${per.partyName} </td>`;
    } else {
      PartyNameRow = `<td>Not Found </td>`;
    }
  }

  const row = `<tr class="table-row">
  <td id="Name">${per.name}</td>
  <td id="Password">${per.password}</td>
  <td id="Cinc">${per.Cinc}</td>
  <td>${per.PhoneNumber}</td>
  <td>${per.DOB}</td>
  <td>${per.mail}</td>
  <td>${per.MessageToAdmin}</td>
  <td>${per.Gender}</td>
  <td>${per.City}</td>
  ${PartyNameRow};
  <td>${ApproveBtn}${deleteBtn}${TicketBtn}${VoteBtn}${returnTicket}</td>
  </tr>`;
  return row;
}
//create the Results Options
function CreateOptionForResult() {
  getCandidateCity();
  const CitySelect = document.querySelector("#City-select");
  const PartySelect = document.querySelector("#Party-select");
  if (CitySelect !== null && PartySelect !== null) {
    CitySelect.insertAdjacentHTML("beforeend", getAllCityOptions());
    PartySelect.insertAdjacentHTML("beforeend", getAllPartiesOption());
    CitySelect.addEventListener("change", function (event) {
      let CityName = event.target.options[event.target.selectedIndex].text;
      createCityResultData(CityName);
    });
    PartySelect.addEventListener("change", function (event) {
      let PartyName = event.target.options[event.target.selectedIndex].text;
      createPartyResultData(PartyName);
    });
  }
}

//go to filter table
function gotoFilterTable(role, isApprove, HasParty, tableFor) {
  setDashboardEmpty();
  setTableDetail(role, isApprove, HasParty, tableFor);
  const table = document.querySelector(".table");
  const theadHtml = createTableHead(tableFor);
  table.insertAdjacentHTML("beforeend", theadHtml);
  filterTable(role, isApprove, HasParty, tableFor);
  checkOptionChange(role, isApprove, HasParty, tableFor);
}
function createCandidateVoter(role, isApprove, HasParty, tableFor) {
  let CurrentPerson = getCurrentPerson();
  if (CurrentPerson.Voters !== undefined) {
    CurrentPerson.Voters.forEach((CanVoter) => {
      addrowConditions(CanVoter, role, isApprove, HasParty, tableFor);
    });
  }
}

//set the details of table that require to make a table
function setTableDetail(rol, isApp, HasPar, tblFor) {
  PersonRole = rol;
  PersonisApprove = isApp;
  PersonHasParty = HasPar;
  PersontableFor = tblFor;
}

//create the filteration method
function filterTable(role, isApprove, HasParty, tableFor) {
  const tbody = document.querySelector(".table-body");
  tbody.innerHTML = "";
  persons.forEach((per) => {
    if (tableFor === "WaitingCandidate" && per.partyName === undefined) {
      addrowConditions(per, role, isApprove, HasParty, tableFor);
    } else if (
      (tableFor === "Voter" || tableFor === "VoteOfAdmin") &&
      per.partyName !== undefined &&
      per.City === getCurrentPerson().City &&
      per.City !== undefined
    ) {
      addrowConditions(per, role, isApprove, HasParty, tableFor);
    } else if (
      tableFor === "PartyHeadOfCandidate" &&
      per.partyName === getCurrentPerson().partyName &&
      getCurrentPerson().partyName !== undefined
    ) {
      addrowConditions(per, role, isApprove, HasParty, tableFor);
    } else if (
      tableFor === "PartyHeadVoter" &&
      per.partyName === getCurrentPerson().partyName &&
      getCurrentPerson().partyName !== undefined
    ) {
      addrowConditions(per, role, isApprove, HasParty, tableFor);
    } else if (tableFor === "admin") {
      addrowConditions(per, role, isApprove, HasParty, tableFor);
    } else if (
      per.partyName !== undefined && // Ensure the person has a party name
      per.City === getCurrentPerson().City
    ) {
      if (
        tableFor === "competetorCandidate" &&
        per.partyName !== getCurrentPerson().partyName
      ) {
        addrowConditions(per, role, isApprove, HasParty, tableFor);
      } else if (
        tableFor === "SamePartyCandidate" &&
        per.partyName === getCurrentPerson().partyName
      ) {
        addrowConditions(per, role, isApprove, HasParty, tableFor);
      }
    }
  });
  if (getCurrentPerson().role === "Candidate") {
    createCandidateVoter(role, isApprove, HasParty, tableFor);
  }
  calltheAction(role);
}

let NumberOfRowsInCurrentTable = 0;

//create list and then return the list
function createList(count) {
  const list = ` <li class="value" id="List-count">${count}</li>`;
  return list;
}

//set the number of rows and visibiilty of the container
function setNumberOfRows() {
  const CountContainer = document.querySelector(".table-rows-container");
  const PaginationContainer = document.querySelector(".pagination");
  if (CountContainer !== null) {
    CountContainer.style.display = "block";
  }
  if (PaginationContainer !== null) {
    PaginationContainer.style.visibility = "visible";
  }
  const tableRows = document.querySelector(".table-rows");
  tableRows.innerHTML = NumberOfRowsInCurrentTable;
}
//add list in unordered list
function addList() {
  setListEmpty();
  const unorderdList = document.querySelector(".pagination-list");
  let NumberOfPages = parseInt(NumberOfRowsInCurrentTable) / 5;
  for (let pageNumber = 0; pageNumber < NumberOfPages; pageNumber++) {
    if (NumberOfPages < 5) {
      let PagNu = pageNumber + 1;
      unorderdList.insertAdjacentHTML("beforeend", createList(PagNu));
    }
  }
  NumberOfRowsInCurrentTable = 0;
}

// function setEmpty the unordered list
function setListEmpty() {
  const ul = document.querySelector(".pagination-list");
  ul.innerHTML = "";
}
let RowsCount = 0;
//set row in table according to the conditions
function addrowConditions(per, role, isApprove, HasParty, tableFor) {
  if (
    per.role === role &&
    per.isApprove === isApprove &&
    (FilterParty === "" || per.partyName === FilterParty) &&
    (FilterCity === "" || per.City === FilterCity) &&
    (FilterGender === "" || per.Gender === FilterGender)
  ) {
    if (NumberOfRowsInCurrentTable >= skipCount) {
      setRowInTable(per, per.role, isApprove, HasParty, tableFor);
      setNumberOfRows();
    }
    NumberOfRowsInCurrentTable++;
  }
}

let skipCount = 0;
//skip the number of rows that are not required
function checkPaginationClick() {
  let inputNumber;
  const paginationList = document.querySelectorAll("#List-count");
  if (paginationList.length > 0) {
    paginationList.forEach((PgNu) => {
      PgNu.addEventListener("click", function (event) {
        RowsCount = 0;
        inputNumber = event.target.innerHTML;
        setSkipCount(inputNumber);
      });
    });
  } else {
    console.log("Empty List ");
  }
}
let isElectionStart = "No";
//set the number of rows which we want to skip
function setSkipCount(inputNumber) {
  skipCount = inputNumber * 5 - 5;
  filterTable(PersonRole, PersonisApprove, PersonHasParty, PersontableFor);
  skipCount = 0;
}
function logoutFromPortal() {
  successMessage("Successfully Logout").then(() => {
    window.location.href = "Role.html";
  });
}
//start the election
function startELection() {
  let CurrentPerson = getCurrentPerson();
  isElectionStart = "yes";
  storeElectionStart();
  let message = getMessage("", "Election");
  updateNotifications(CurrentPerson, message);
  setNotificationToAll(message);
  setCurrentPerson(CurrentPerson);
  showDetailInAdminDashBoard();
}
//update notification
function updateNotifications(CurrentPerson, message) {
  pushNotification(CurrentPerson, message);
  Update(CurrentPerson);
}
//set notifications to all
function setNotificationToAll(message) {
  persons.forEach((per) => {
    if (per.role !== "Admin") {
      updateNotifications(per, message);
    }
  });
  showDetailInAdminDashBoard();
}

//stop the election by setting the variable and store it in local stroage
function stopELection() {
  let CurrentPerson = getCurrentPerson();
  isElectionStart = "No";
  storeElectionStart();
  let message = getMessage("", "Election");
  updateNotifications(CurrentPerson, message);
  setNotificationToAll(message);
  setCurrentPerson(CurrentPerson);
  showDetailInAdminDashBoard();
}

//load the start election result
function loadElectionStart() {
  isElectionStart = localStorage.getItem("ElectionStart");
}
//store the election result
function storeElectionStart() {
  localStorage.setItem("ElectionStart", isElectionStart);
}
loadElectionStart();

//get ticket retrun button
function getReturnTicket() {
  return `<button class="return-ticket" id="table-btn">Return Ticket</button>`;
}
//return the delete button
function getDeleteBtn() {
  return `<button class="delete-btn" id="table-btn">Delete</button>`;
}
//return approve btn
function getApproveBtn() {
  return `<button class="Approve-btn" id="table-btn" >Approve</button>`;
}
//return ticket btn
function getTicketBtn() {
  return `<button class="Party-btn" id="table-btn" >Give Ticket</button>`;
}
//return Vote btn
function getVoteBtn() {
  return `<button class="Vote-btn" id="table-btn" >Add Vote</button>`;
}
//set the dashboard empty
function setDashboardEmpty() {
  const dashboard = document.querySelector(".dashboard-card");
  const dashboardTitle = document.querySelector(".dashboard-title");
  if (dashboard !== null) {
    dashboard.style.display = "none";
  }
  if (dashboardTitle !== null) {
    dashboardTitle.style.display = "none";
  }
  if (dashboard !== null) {
    dashboard.innerHTML = "";
  }
}
//dashboard reload
function dashboard() {
  location.reload();
}
//call the action
function calltheAction(role) {
  deleteBtn(role);
  approveCandidate(role);
  setTicket(role);
  setVote(role);
  takeTicketFromCandidate(role);
  setNumberOfRows();
  addList();
  checkPaginationClick();
  RowsCount = 0;
}
let isNotificationOpen = false;
//notification tables
function createNotificationTable() {
  debugger;
  if (isNotificationOpen === false) {
    isNotificationOpen = true;
    setDashboardEmpty();
    let CurrentPerson = getCurrentPerson();
    if (CurrentPerson.Notifications !== undefined) {
      CurrentPerson.previuosNotification = CurrentPerson.Notifications.length;
      setCurrentPerson(CurrentPerson);
      Update(CurrentPerson);
      notif.innerHTML = "";
      const table = document.querySelector(".table");
      const theadHtml = createNotificationTableHead();
      table.insertAdjacentHTML("beforeend", theadHtml);
      createNotificationTableBody();
      deletebtnForNotification();
    }
  }
}
//create notification table head
function createNotificationTableHead() {
  const thead = `<thead class="Voter-head">
    <tr>
      <th class="Name-col">Name</th>
      <th class="Action-btn">Actions</th>
    </tr>
  </thead>`;
  return thead;
}
//create notification table body
function createNotificationTableBody() {
  const TableBody = document.querySelector(".table-body");
  let CurrentPerson = getCurrentPerson();
  CurrentPerson.Notifications.forEach((message) => {
    const row = createNotificationTableRow(message);
    TableBody.insertAdjacentHTML("beforeend", row);
  });
}
//create notification table row
function createNotificationTableRow(message) {
  const row = `<tr class="table-row">
    <td class="Notification">${message}</td>
    <td>${getDeleteBtn()}</td>`;
  return row;
}
//set row in table
function setRowInTable(per, role, isApprove, HasParty, tableFor) {
  if (RowsCount < 5) {
    const tbody = document.querySelector(".table-body");
    const row = CreateTableRow(per, role, isApprove, HasParty, tableFor);
    tbody.insertAdjacentHTML("beforeend", row);
  }
  RowsCount++;
}
//delete button from table
function deleteBtn(role) {
  const deletBtnList = document.querySelectorAll(".delete-btn");
  deletBtnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      Validate("Yes, delete it !", "Deleted!", "Delete Successfully").then(
        () => {
          const row = btn.closest(".table-row");
          deleteRow(row, role);
          row.remove(role);
          setNumberOfRows();
        }
      );
    });
  });
}
function deletebtnForNotification() {
  const deleteBtnList = document.querySelectorAll(".delete-btn");
  deleteBtnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      successMessage("Notification is deleted !").then(() => {
        const row = btn.closest(".table-row");
        deleteNotification(row);
        row.remove();
      });
    });
  });
}
//delete notification from the party head notification list
function deleteNotification(row) {
  let CurrentPerson = getCurrentPerson();
  const notification = row.querySelector(".Notification");
  let index = CurrentPerson.Notifications.findIndex(
    (note) => note === notification.textContent
  );
  CurrentPerson.Notifications.splice(index, 1);
  CurrentPerson.previuosNotification = CurrentPerson.Notifications.length;
  setCurrentPerson(CurrentPerson);
  Update(CurrentPerson);
  showDetailInAdminDashBoard();
}

//compare and delete row from persons array
function deleteRow(row, role) {
  const Name = row.querySelector("#Name").textContent;
  const Password = row.querySelector("#Password").textContent;
  for (let per in persons) {
    if (
      persons[per].name === Name &&
      persons[per].role === role &&
      persons[per].password === Password
    ) {
      addNotificationForDeletionOfCandidate(persons[per], "delete");
      persons.splice(per, 1);
      break;
    }
  }
  storeData();
  showDetailInAdminDashBoard();
}
function Validate(buttonMessage, titleMessage, text) {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: buttonMessage,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(titleMessage, text, "success").then(() => {
          resolve(); // Resolve the Promise when the user confirms
        });
      } else {
        reject(); // Reject the Promise when the user cancels or closes the dialog
      }
    });
  });
}
//add notification for deletion of candidate to Party head
function addNotificationForDeletionOfCandidate(CurrentPerson, usedFor) {
  persons.forEach((per) => {
    if (per.role === "PartyHead" && per.partyName === CurrentPerson.partyName) {
      setNotification(per, usedFor, CurrentPerson);
    }
  });
}
//approve the Candidates
function approveCandidate(role) {
  const approveBtnList = document.querySelectorAll(".Approve-btn");
  approveBtnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      Validate("Yes, approve it !", "Approved!", `${role} has been approved.`);
      const row = btn.closest(".table-row");
      UpdateCandidateInArray(row, role, "Approve");
      row.remove();
      if (role === "PartyHead") {
        addApproveNotification(role, row);
      }
      addApproveNotification(role, row);
    });
  });
}
//add approve notification
function addApproveNotification(role, row, notificationFor) {
  const Name = row.querySelector("#Name").textContent;
  const Password = row.querySelector("#Password").textContent;
  for (let per in persons) {
    if (
      persons[per].role === role &&
      persons[per].name === Name &&
      persons[per].password === Password
    ) {
      setNotification(persons[per], notificationFor, getCurrentPerson());
      break;
    }
  }
  showDetailInAdminDashBoard();
}
//set the candidate to approved
function UpdateCandidateInArray(row, role, usedFor) {
  const Name = row.querySelector("#Name").textContent;
  const Password = row.querySelector("#Password").textContent;
  let CurrentPerson = getCurrentPerson();
  for (let per of persons) {
    if (per.name === Name && per.password === Password && per.role === role) {
      if (usedFor === "Approve") {
        per.isApprove = "yes";
      } else if (usedFor === "PartyName") {
        per.partyName = CurrentPerson.partyName;
      } else if (usedFor === "Votes") {
        if (!per.Voters) {
          // Initialize the Voters array if it doesn't exist
          per.Voters = [];
        }

        CurrentPerson.partyName = per.partyName;
        setCurrentPerson(CurrentPerson);
        Update(CurrentPerson);
        per.Voters.push(CurrentPerson);
      } else if (usedFor === "ReturnTicketFromCandidate") {
        per.HasParty = "No";
        per.partyName = undefined;
      }
      Update(per);
      break;
    }
  }
  showDetailInAdminDashBoard();
}
function successMessage(Message) {
  return Swal.fire({
    position: "center",
    icon: "success",
    title: Message,
    showConfirmButton: false,
    timer: 1500,
  });
}
//update a object
function Update(per) {
  for (let i = 0; i < persons.length; i++) {
    if (persons[i].name === per.name && persons[i].password == per.password) {
      persons[i] = per;
      break;
    }
  }
  storeData();
}
//set notification to election comissioner

//set notification
function setNotification(CurrentPerson, notificationFor, candidate) {
  let message = "";
  message = getMessage(CurrentPerson, notificationFor, candidate);
  pushNotification(CurrentPerson, message);
  Update(CurrentPerson);
  printNot(CurrentPerson);
}
function printNot(CurrentPerson) {
  CurrentPerson.Notifications.forEach((no) => {
    console.log(no);
  });
}

//push the message in notification array of current person
function pushNotification(CurrentPerson, message) {
  if (!CurrentPerson.Notifications) {
    CurrentPerson.Notifications = [];
  }
  CurrentPerson.Notifications.push(message);
}
function getMessage(CurrentPerson, notificationFor, candidate) {
  let message;
  if (notificationFor === "delete") {
    message = `${candidate.name}` + "   is deleted by Admin"; //set notificaation of deletion from admin
  } else if (notificationFor === "AddVotes") {
    message = `${candidate.name}` + "    added a vote to  you";
  } else if (CurrentPerson.isApprove === "yes") {
    message = "Congratulations!You are approved from Election Comission"; //set notification of approval from admin
  } else if (notificationFor === "Election") {
    if (isElectionStart === "yes") {
      message = `Election Start by Election Comissioner  ${
        getCurrentPerson().name
      }`;
    } else {
      message = `Election Stop by Election Comissioner ${
        getCurrentPerson().name
      }`;
    }
  } else if (notificationFor === "Result") {
    if (isResultPublish === "yes") {
      message = `Result Published by   ${getCurrentPerson().name}`;
    } else if (isResultPublish === "No") {
      message = `Result is hide by ${getCurrentPerson().name}`;
    }
  }
  return message;
}

//pending
function storeNotification() {
  const table = document.querySelector(".table");
  const theadHtml = createNotificationTableHead();
  table.insertAdjacentHTML("beforeend", theadHtml);
  TableBody(role, isApprove);
  deleteBtn(role);
  approveCandidate(role);
}
//Create Head for notification table
function createNotificationTableHead() {
  const head = `<thead class="Notification-head">
  <tr>
    <th>Notification</th>
    <th>Action</th>
  </tr>
</thead>`;
  return head;
}

//set the ticket button
function setTicket(role) {
  const ticketBtnList = document.querySelectorAll(".Party-btn");
  ticketBtnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      successMessage("Ticket is Added").then(() => {
        const row = btn.closest(".table-row");
        row.remove();
        UpdateCandidateInArray(row, role, "PartyName");
      });
    });
  });
}

//take ticket from Candidate
function takeTicketFromCandidate(role) {
  const returnTicketBtnList = document.querySelectorAll(".return-ticket");
  returnTicketBtnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      Validate(
        "Yes, return it !",
        "Return Ticket!",
        "Your Ticket has been returned."
      )
        .then(() => {
          const row = btn.closest(".table-row");
          row.remove();
          UpdateCandidateInArray(row, role, "ReturnTicketFromCandidate");
        })
        .catch(() => {
          // Handle rejection (user canceled or closed the dialog)
        });
    });
  });
}

//set the vote button
function setVote(role) {
  const VoteBtnList = document.querySelectorAll(".Vote-btn");
  let CurrentPerson = getCurrentPerson();
  VoteBtnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      Validate("Yes,give it !", "Give Vote!", "Your Vote has been added.")
        .then(() => {
          const row = btn.closest(".table-row");
          row.remove();
          CurrentPerson.isVoteAdd = "yes";
          setCurrentPerson(CurrentPerson);
          Update(CurrentPerson);
          UpdateCandidateInArray(row, role, "Votes");
          addApproveNotification("Candidate", row, "AddVotes");
          location.reload();
        })
        .catch(() => {});
    });
  });
}

//create Card for cities
function createCardForCity(
  PartyName,
  CandidateName,
  NumberOfVotes,
  PostionNumber,
  CityName,
  Message,
  Email,
  image
) {
  const Card = `  
    <div class="Card" onclick="setDetailInCard('${image}','${CandidateName}','${PartyName}','${Message}','${CityName}','${NumberOfVotes}','${Email}')">
    <div id="Card-Details">
    <span class="Position-Number">${(PostionNumber = PostionNumber + 1)} </span>
     <span class="Party-name">${PartyName}</span>
     <div class="Personal-Detail">
     Position in the city of ${CityName}
     </div>
     </div>
    <div id="Card-voters">
    <span class="Number-of-Voters">
    ${NumberOfVotes}</span>
    Number of votes
    </div>
    </div>`;
  return Card;
}

//create card for parties
function createCardForParty(Votes, PartyName, Position) {
  const PartyCard = `<div class="Party-card">
  <div class="Position-Detail"><span class="Position-number">${(Position =
    Position + 1)}</span><p>
    Position in Election is
    <span class="Party-name" id="PartyCard-party">${PartyName}</span>
    </p>
    </div>
   <div class="Party-detail-Card">
   <span class="Number-of-Voters">${Votes}</span>
   Number of Votes
   </div>
   </div>`;
  return PartyCard;
}

//create head of result card container
function getHeadOfCard(City) {
  const CardHead = `<div class="result-head">${City}</div>`;
  return CardHead;
}

//create body of the result card
function createBody() {
  const body = document.createElement("div");
  body.classList.add("result-body");
  return body;
}

let CandidateCities = new Set();
//get the candidates of city
function getCandidateCity() {
  persons.map((per) => {
    if (per.role === "Candidate") {
      CandidateCities.add(per.City);
    }
  });
}

//create the result data
function createCityResultData(citNam) {
  let ResultData = [];
  persons.forEach((per) => {
    if (
      per.City === citNam &&
      per.role === "Candidate" &&
      per.Voters !== undefined
    ) {
      let obj = {
        Name: per.name,
        NumberOfVoters: per.Voters.length,
        PartyName: per.partyName,
        CityName: citNam,
        Email: per.mail,
        Message: per.message,
        CanImage: per.ProfileImage,
      };
      ResultData.push(obj);
    }
  });
  ResultData.sort((a, b) => b.NumberOfVoters - a.NumberOfVoters);
  setCardInContainer(ResultData);
}
loadImage();
//load the profile image
function loadImage() {
  let CurrentPerson = JSON.parse(localStorage.getItem("CurrentPerson"));
  const imageSrc = CurrentPerson.ProfileImage;
  const ProfileImage = document.querySelector("#profile-image");
  if (ProfileImage !== null && imageSrc !== null) {
    if (imageSrc !== undefined) {
      ProfileImage.setAttribute("src", imageSrc);
    } else {
      ProfileImage.setAttribute("src", "default.jpg");
    }
  }
}
//create party result data
function createPartyResultData(PartNa) {
  let ResultData = [];
  persons.forEach((per) => {
    if (
      per.partyName === PartNa &&
      per.role === "Candidate" &&
      per.Voters !== undefined
    ) {
      let obj = {
        Name: per.name,
        NumberOfVoters: per.Voters.length,
        CityName: per.City,
        PartyName: PartNa,
      };
      ResultData.push(obj);
    }
  });
  ResultData.sort((a, b) => b.NumberOfVoters - a.NumberOfVoters);
  setCardInContainer(ResultData);
}
//set card in container
function setCardInContainer(ResultData) {
  const container = document.querySelector(".result-container");
  container.innerHTML = "";
  for (let index = 0; index < ResultData.length; index++) {
    Card = createCardForCity(
      ResultData[index].PartyName,
      ResultData[index].Name,
      ResultData[index].NumberOfVoters,
      index,
      ResultData[index].CityName,
      ResultData[index].Message,
      ResultData[index].Email,
      ResultData[index].CanImage
    );
    const CardElement = getCardElement(Card);
    CardElement.classList.add("Card");
    if (index === 0) {
      CardElement.classList.add("Winner");
    }
    container.appendChild(CardElement);
  }
}

//create the party result card
function createFinalResult() {
  const container = document.querySelector(".result-container");
  container.innerHTML = "";
  let ResultData = [];
  let votes = 0;
  if (container !== null) {
    persons.forEach((per) => {
      if (per.role === "PartyHead" && per.partyName !== undefined) {
        if (isCityadd(ResultData, per.partyName) === false) {
          votes = getVotesOfParty(per.partyName);
          let perObj = {
            PartyName: per.partyName,
            NumberOfVotes: votes,
          };
          ResultData.push(perObj);
        }
      }
    });
    ResultData.sort((a, b) => b.NumberOfVotes - a.NumberOfVotes);
    for (let index = 0; index < ResultData.length; index++) {
      let card = createCardForParty(
        ResultData[index].NumberOfVotes,
        ResultData[index].PartyName,
        index
      );
      const CardElement = getCardElement(card);
      if (index === 0) {
        CardElement.classList.add("Winner");
      }
      container.appendChild(CardElement);
    }
  }
}
//set publish button
function setPublishButton() {
  const publisBtn = document.querySelector(".publish-result");
  if (publisBtn !== null) {
    if (getCurrentPerson().role === "Admin") {
      publisBtn.style.visibility = "visible";
    }
  }
}
//hide publish button
function hidePublishBtn() {
  const pubBtn = document.querySelector("#show");
  const hideBtn = document.querySelector("#Hide");
  if (pubBtn !== null && hideBtn !== null) {
    pubBtn.style.visibility = "hidden";
    hideBtn.style.visibility = "visible";
  }
}
//show publish  button
function showPublishBtn() {
  const pubBtn = document.querySelector("#show");
  const hideBtn = document.querySelector("#Hide");
  if (pubBtn !== null && hideBtn !== null) {
    pubBtn.style.visibility = "visible";
    hideBtn.style.visibility = "hidden";
  }
}

//pubish result of election when election is stop
let isResultPublish = "No";
//give notifications to all users and store publish result label in local storage
function publishResult() {
  if (isElectionStart === "No") {
    hidePublishBtn();
    isResultPublish = "yes";
    setResultNotification();
  } else {
    console.log("Election not start yet");
  }
}

//set current state of publish button
function setCurrentStateOfPublishbtn() {
  if (getCurrentPerson().role === "Admin") {
    if (isResultPublish === "yes") {
      hidePublishBtn();
    } else if (isResultPublish === "No") {
      showPublishBtn();
    }
  }
}

//set the result notification
function setResultNotification() {
  let message = getMessage("", "Result");
  let CurrentPerson = getCurrentPerson();
  updateNotifications(CurrentPerson, message);
  setCurrentPerson(CurrentPerson);
  setNotificationToAll(message);
  storePublishResultLabel();
}

//hide the publish result from creditationals
function HidePublishResult() {
  showPublishBtn();
  isResultPublish = "No";
  setResultNotification();
}
let isNavOpen = "No";
//close nav  bar
function closeNavbr() {
  const navBr = document.querySelector(".sideBar-container");
  const btn = document.querySelectorAll("#btn-title");
  const sideBar = document.querySelector(".menu");
  const logo = document.querySelector(".logo-title");
  const logoPara = document.querySelector(".subtitile");
  const dashboard = document.querySelector(".dashboard-card");
  const DasboardTitle = document.querySelector(".dashboard-title");
  if (isNavOpen === "No") {
    isNavOpen = "yes";
    btn.forEach((b) => {
      b.style.display = "block";
    });
    logoPara.style.display = "block";
    navBr.style.width = "18%";
    sideBar.style.left = "6rem";
    logo.style.fontSize = "28px";
    dashboard.style.left = "250px";
    dashboard.style.width = "78%";
    DasboardTitle.style.left = "17rem";
    DasboardTitle.style.fontSize = "1.5rem";
  } else if (isNavOpen === "yes") {
    btn.forEach((b) => {
      b.style.display = "none";
    });
    isNavOpen = "No";
    logoPara.style.display = "none";
    navBr.style.width = "6%";
    logo.style.fontSize = "20px";
    dashboard.style.left = "123px";
    dashboard.style.height = "70%";
    dashboard.style.width = "82%";
    DasboardTitle.style.left = "7rem";
    DasboardTitle.style.fontSize = "2rem";
  }
}
//get label and side bar container
const dashLabel = document.querySelector(".dashboard-label");
const dashboardHo = document.querySelector(".dashboard");
const AddVoteLabel = document.querySelector(".AddVote-label");
const AddVote = document.querySelector(".Add-Vote");
const AddDetailLabel = document.querySelector(".Add-Detail-label");
const AddDetail = document.querySelector(".Add-Detail");
const StopElectionLabel = document.querySelector(".Stop-Election-label");
const StopElection = document.querySelector(".Election-stop");
const StartElectionLabel = document.querySelector(".Start-Election-label");
const StartElection = document.querySelector(".Election-start");
//call the toggle with differnet labbels with the pause of 10 ms
let intervalId = setInterval(() => {
  callToggle(dashLabel, dashboardHo);
  callToggle(AddVoteLabel, AddVote);
  callToggle(AddDetailLabel, AddDetail);
  callToggle(StopElectionLabel, StopElection);
  callToggle(StopElectionLabel, StopElection);
  callToggle(StartElectionLabel, StartElection);
}, 10);

//dashboard hover effect
function callToggle(dashLabel, dashboard) {
  if (isNavOpen === "No") {
    if (dashboard !== null && dashboard !== undefined) {
      dashboard.addEventListener("mouseover", function () {
        dashLabel.style.display = "block";
      });
      dashboard.addEventListener("mouseout", function () {
        dashLabel.style.display = "none";
      });
    }
  } else {
    dashboard.addEventListener("mouseover", function () {
      dashLabel.style.display = "none";
    });
  }
}

//store the publish result label in local storage
function storePublishResultLabel() {
  localStorage.setItem("ResPublish", isResultPublish);
}

//load the publish result label from local storage
function loadPublishResultLabel() {
  isResultPublish = localStorage.getItem("ResPublish");
}
loadPublishResultLabel();

//generate  card element and then return it
function getCardElement(card) {
  const CardElement = document.createElement("div");
  CardElement.innerHTML = card;
  return CardElement;
}
//check that city already add in the  result array
function isCityadd(ResultData, PartyName) {
  for (let a of ResultData) {
    if (a.PartyName === PartyName) {
      return true;
    }
  }
  return false;
}
//check the Nunber of city
function getNumberOfCity(CityName) {
  let NumberOfCity = 0;
  if (CityName !== undefined) {
    persons.forEach((per) => {
      if (
        per.City === CityName &&
        per.role === "Candidate" &&
        per.Voters !== undefined
      ) {
        NumberOfCity++;
      }
    });
  }

  return NumberOfCity;
}
//get the parent
function getParent(Votes) {
  const VoterParent = Votes.parentElement;
  const suParent = VoterParent.parentElement;
  return suParent;
}

//get the total votes of party
function getVotesOfParty(PartyName) {
  let CountVotes = 0;
  persons.forEach((per) => {
    if (per.role === "Voter" && per.partyName === PartyName) {
      CountVotes++;
    }
  });
  return CountVotes;
}

//go to city result portal
function goToResultPortal() {
  if (isResultPublish === "yes" || getCurrentPerson().role === "Admin") {
    window.location.href = "ResultPortal.html";
  } else {
    failMessage("Result is not announced till yet!");
  }
}
//go to party Result Poratl
function gotoPartyResult() {
  window.location.href = "PartyResult.html";
}
//take image as input and store it in local storage
function setImageInLocalStorage() {
  const input = document.querySelector("#file-upload");
  if (input !== null) {
    input.addEventListener("change", (event) => {
      const image = event.target.files[0];
      var filesize = getFileSize(event.target.files[0]);
      if (filesize < 2) {
        if (image) {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.addEventListener("load", () => {
            storeProfileImage(reader.result);
            successMessage("Profile image is updated").then(() => {
              location.reload();
            });
          });
        } else {
          failMessage("Upload valid file");
        }
      } else {
        failMessage("File size is too large");
      }
    });
  }
}
//store the profile image
function storeProfileImage(imageUrl) {
  let CurrentPerson = getCurrentPerson();
  CurrentPerson.ProfileImage = imageUrl;
  setCurrentPerson(CurrentPerson);
  Update(CurrentPerson);
}
let IsCardOpen = "No";
//detail card open
//create variable for card componenet
const footer = document.querySelector(".portfolio-footer");
const CardMessage = document.querySelector(".message-detail");
const detail = document.querySelector(".person-detail");
const portfolio = document.querySelector(".portfolio");
const iconsDiv = document.querySelector(".icons-div");
const icon = document.querySelector("#down-icon");
//set detail animations
function DetailCardAnimation() {
  if (IsCardOpen === "No") {
    IsCardOpen = "yes";
    icon.classList.add("fa-angle-up");
    iconsDiv.style.bottom = "-1rem";
    portfolio.style.height = "285px";
    footer.style.visibility = "visible";
    CardMessage.style.display = "block";
    detail.style.display = "block";
  } else if (IsCardOpen === "yes") {
    IsCardOpen = "No";
    setDefulatCardPosition();
  }
}

//defult card position
function setDefulatCardPosition() {
  icon.classList.remove("fa-angle-up");
  icon.classList.add("fa-angle-down");
  iconsDiv.style.bottom = "-0.8rem";
  portfolio.style.height = "70px";
  footer.style.visibility = "hidden";
  CardMessage.style.display = "none";
  detail.style.display = "none";
}
//close card detail
function closeDetailCard() {
  const Card = document.querySelector(".portfolio");
  const Cardfooter = document.querySelector(".portfolio-footer");
  setDefulatCardPosition();
  Card.style.visibility = "hidden";
  Cardfooter.style.visibility = "hidden";
  removeBlur();
}
//set detail in Card
function setDetailInCard(
  image,
  name,
  partyName,
  Message,
  Cityname,
  Votes,
  Email
) {
  const Card = document.querySelector(".portfolio");
  const CardImage = document.querySelector("#Card-profile-image");
  const CardName = document.querySelector(".Card-name");
  const PartyName = document.querySelector("#Card-party");
  const CardMessage = document.querySelector("#Card-Message");
  const CityName = document.querySelector(".City-name");
  const NumberOfVotes = document.querySelector(".Total-voter");
  const CardMail = document.querySelector(".Card-mail");
  addBlur();
  Card.style.visibility = "visible";
  if (image !== "undefined") {
    CardImage.setAttribute("src", image);
  } else {
    CardImage.setAttribute("src", "default.jpg");
  }
  CardName.innerHTML = name;
  PartyName.innerHTML = partyName;
  CardMessage.innerHTML = Message;
  NumberOfVotes.innerHTML = Votes;
  CardMail.innerHTML = Email;
  CityName.innerHTML = Cityname;
}
//add blurness to the result card
function addBlur() {
  const ResultCard = document.querySelector(".result-card");
  ResultCard.style.filter = "blur(2px)";
}
//remove blurness from result card
function removeBlur() {
  const ResultCard = document.querySelector(".result-card");
  ResultCard.style.filter = "none";
}

//get the file size
function getFileSize(files) {
  return (files.size / 1024 / 1024).toFixed(4);
}

//update the function
window.addEventListener("load", setEditDetail(getCurrentPerson()));
window.addEventListener("load", CandidateDashboard());
window.addEventListener("load", CreateOptionForResult());
window.addEventListener("load", setPublishButton());
window.addEventListener("load", setCurrentStateOfPublishbtn());
window.addEventListener("load", showDetailInAdminDashBoard());
