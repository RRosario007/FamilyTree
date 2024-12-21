import { loadFromStorage, addChild, addPartner, addSibling, addParents, updateBirthDate, updateName, updateGender, getGender, getBirthDate, getPartnerId, getName, hasChildren, getIndexofId, getPartnerName, hasPartner, familyInfo, addPerson, } from "../../data/person.js";
import { drawLine } from "./coordinates.js";

/*
The function to either load or start a new tree
I check which button is clicked and if there isn't a existing tree
in localstorage, then create a new tree with an empty person.

[need to update the create ne tree button to check if there is an existing tree,
and if they want to overwrite it or use the saved one]
*/
export function startTree(){
  document.querySelector('.js-create-fam-button').addEventListener('click', () =>{
    addPerson();
    generateTree(familyInfo[0].id);
    generatesSidePreview(familyInfo[0].id);
    mouseDragTest();
  });
  document.querySelector('.js-load-fam-button').addEventListener('click', () =>{
    loadFromStorage();
    generateTree(familyInfo[0].id);
    generatesSidePreview(familyInfo[0].id);
    mouseDragTest();
  });
}


/**
 * Generates the family tree of personId.
 * @param {Number} personId The person's id
 */
function generateTree(personId) {
  let html = ``;
  const highestId = findHighest(personId);
  html += `
    ${addPersonToTree(highestId)}
  `
  document.querySelector('.js-familyTree').innerHTML = html;
  drawLine(highestId);
  document.querySelectorAll('.js-person').forEach((person) => {
  person.addEventListener('click', ()=> {
    const idPerson = person.dataset.personId;
    generatesSidePreview(Number(idPerson));
    if(personId != Number(idPerson)) {
      generateTree(Number(idPerson));
    }
  })
})
}

/**
 * Function to move the family tree around by clicking and dragging it.
 */
function mouseDragTest(){
  let isMouseDown = false;
  let startX;
  let startY;
  let diffX = 0;
  let diffY = 0;
  document.querySelector('.js-main').addEventListener('mousedown', function (event) {
    startX = event.pageX;
    startY = event.pageY;
    isMouseDown = true;
  });

  document.querySelector('.js-main').addEventListener('mousemove', function (event) {
    if(isMouseDown) {
      diffX += event.pageX-startX;
      diffY += event.pageY-startY;
      document.querySelector('.js-familyTree').style.left = `${diffX}px`;
      document.querySelector('.js-familyTree').style.top = `${diffY}px`;
      startX = event.pageX;
      startY = event.pageY;
    }
  });

  document.querySelector('.js-main').addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  document.querySelector('.js-main').addEventListener('mouseout',() => {
    isMouseDown = false;
  });

}


/**
 * Under construction
 * Function in order to zoom in and out of the tree
 */
function zoomInZoomOut(){
  window.addEventListener('wheel', (event) => {
   if(event.deltaY < 0){
    let fileNum = Number(document.getElementById('personStyles').getAttribute('href').replace(/[^0-9]/g, ''));
    fileNum += 1;
    if(fileNum <= 6){
      const fileName = document.getElementById('personStyles').getAttribute('href').replace(/[0-9]/g, fileNum);
      document.getElementById('personStyles').setAttribute('href', fileName);
    }
   }else if(event.deltaY > 0){
    let fileNum = Number(document.getElementById('personStyles').getAttribute('href').replace(/[^0-9]/g, ''));
    fileNum -= 1;
    if(fileNum >= 2){
      const fileName = document.getElementById('personStyles').getAttribute('href').replace(/[0-9]/g, fileNum);
      document.getElementById('personStyles').setAttribute('href', fileName);   
    }
  }
  });
}

/**
 * Loop through the data starting at the top of the family tree and working down
 * check if each person has a partner and children
 * if they do use recursion until they don't have a partner or children
 * @param {Number} id The person's id
 * @returns HTML string of the data organized by how they are related
 */
function addPersonToTree(id) {
  let html = ``;
  if(hasPartner(id)){
    html += `
    
    <div class='partner'>
      <div class='person js-person js-${id}'
      data-person-id='${id}'>
        <p>${getName(id)} </p>
      </div>
      <div class='person js-person js-${getPartnerId(id)}'
      data-person-id='${getPartnerId(id)}'>
        <p>${getPartnerName(id)}</p>
      </div>
    </div>
    `;
    if(hasChildren(id)){
      html += `
      <div class='children'>`;
        familyInfo[getIndexofId(id)].childrenId.forEach((childId) =>{
          if(hasChildren(childId)){
            html += `
            <div class = 'familyTree'>
            `;
          }
          html += addPersonToTree(childId);
          if(hasChildren(childId)){
            html += `
            </div>
            `;
          }
        })
      html += `
      </div>`;
    }
    return html;
  }else{
    return `
    <div class='person js-person js-${id}'
    data-person-id='${id}'>
      <p>${getName(id)} </p>
    </div>
    `
  }

}

/**Finds the highest grandparent that is directly related to the given person using the id
 * and returns the id of the highest grandparent
 * I used recursion by using the left and right parents. If there was no parents then that was the exit clause
 * I checked the returned id to the parent id of the current person being checked.
 * That is how I knew which person was the highest
 * I needed this in order to create divs from the top down of the family tree
 * 
 * @param {Number} id The person's ID 
 * @returns The id of the person that is the oldest in the person's id family tree
 */
function findHighest(id){
  const leftPersonIndex = familyInfo.findIndex(v => v.id === id);
  if(familyInfo[leftPersonIndex].parentsId.leftParent === ''){
    return id;
  }

  const tempOne = findHighest(familyInfo[leftPersonIndex].parentsId.leftParent);
  const tempTwo =  findHighest(familyInfo[leftPersonIndex].parentsId.rightParent);


  if(familyInfo[leftPersonIndex].parentsId.leftParent === tempOne && familyInfo[leftPersonIndex].parentsId.rightParent === tempTwo){
    return familyInfo[leftPersonIndex].parentsId.leftParent;
  }else if(familyInfo[leftPersonIndex].parentsId.leftParent != tempOne && familyInfo[leftPersonIndex].parentsId.rightParent === tempTwo){
    return tempOne;
  }else if(familyInfo[leftPersonIndex].parentsId.leftParent === tempOne && familyInfo[leftPersonIndex].parentsId.rightParent != tempTwo){
    return tempTwo;
  }else{
    return tempOne;
  }
}

/**
 * Check the data to see what gender the person is and loads it into a radio input field
 * @param {Number} personId The person's ID
 * @returns HTML for the radio input of the gender section
 */
function generateGenderHTML(personId){
  const gender = getGender(personId);

  if(gender === ''){
    return `
      <input class='js-gender' data-gender-id='Male-${personId}' type="radio" id="Male" name="contact" value="Male"/>
      <label for="Male">Male</label>
      <input class='js-gender' data-gender-id='Female-${personId}' type="radio" id="Female" name="contact" value="Female"/>
      <label for="Female">Female</label>
    `
  }else if(gender === 'Male'){
    return `
      <input class='js-gender' data-gender-id='Male-${personId}' type="radio" id="Male" name="contact" value="Male" checked/>
      <label for="Male">Male</label>
      <input class='js-gender' data-gender-id='Female-${personId}' type="radio" id="Female" name="contact" value="Female"/>
      <label for="Female">Female</label>
    `
  }else{
    return `
      <input class='js-gender' data-gender-id='Male-${personId}' data-gender-id='12334' type="radio" id="Male" name="contact" value="Male"/>
      <label for="Male">Male</label>
      <input class='js-gender' data-gender-id='Female-${personId}' type="radio" id="Female" name="contact" value="Female" checked/>
      <label for="Female">Female</label>
    `
  }


}


/**
 * Calls the function to generate parents for the given ID
 * and alerts if the person already has parents
 * @param {Number} personId The person's ID
 */
function addParentsToData(personId){
  if(!addParents(personId)){
    alert('Person already has parents');
  } 
}

/**
 * Calls the function to add a sibling for the given ID
 * @param {Number} personId The person's ID 
 */
function addSiblingToTree(personId){
  addSibling(personId);
}

/**
 * Calls the function to add partner for the given ID, and alerts if the person already has a partner
 * @param {Number} personId The person's ID
 */
function addPartnerToPerson(personId){
  if(!addPartner(personId)){
    alert('Person already has a partner');
  }
}

/**
 * Calls the function to add children for the given ID
 * @param {Number} personId The person's ID
 */
function addChildToPerson(personId){
  addChild(personId);
}

/**
 * Generates the HTML for the side view of the person that was clicked on. The side view includes the info
 * and the buttons to add more family members
 * @param {Number} personId The person's ID
 */
function generatesSidePreview(personId) {
  let html= `
    <div class="side-bar">
      <div class="person-side-bar">
          <img class="person-img" src="./data/pictures/rick.png">
          <div class="personal-info">
            <p>Name: <input class='js-side-bar-name' id='${personId}' placeholder='Enter Name' value='${getName(personId)}'></p>
            <p>Gender:
            ${generateGenderHTML(personId)}
            </p> 
            <p>Birth Date
            <input class='js-side-bar-birthdate' id='${personId}' type='date' value=${getBirthDate(personId)}>
            </p>
          </div>
          <button class="button1">Edit Personal Info</button>
      </div>
      <div class="add-family-options">
        <button class='js-add-children-button'>Add Children</button>
        <button class='js-add-parents-button'>Add Parents</button>
        <button class='js-add-sibling-button'>Add Sibling</button>
        <button class='js-add-partner-button'>Add Partner</button>
      </div>
    </div>`;

    document.querySelector('.js-side-bar').innerHTML = html;
  
    /**
     * Detects when the user clicks on the gender input and calls function to save the gender.
     */
    document.querySelectorAll('.js-gender').forEach((gender) => {
      gender.addEventListener('click', () =>{
        const genderAndId = gender.dataset.genderId.split('-');
        updateGender(Number(genderAndId[1]), genderAndId[0]);
      });

    });

    /**
     * Detects when the user clicks out of the date input and calls function to update the birthday.
     */
    document.querySelector('.js-side-bar-birthdate').addEventListener('blur', () =>{
      const tempDate = document.querySelector('.js-side-bar-birthdate');
      updateBirthDate(Number(tempDate.id), tempDate.value);
    });

    /**
     * Detects when the user clicks on the add children button and calls function to add a child.
     * Then it calls generate tree to reload the tree.
     */
    document.querySelector('.js-add-children-button').addEventListener('click', ()=>{
      const inputSelector = document.querySelector('.js-side-bar-name');
      addChildToPerson(Number(inputSelector.id));
      generateTree(personId);
    });

    /**
     * Detects when the user clicks on the add parents button and calls the function to add parents.
     * Then it calls generate tree to reload the tree. 
     */
    document.querySelector('.js-add-parents-button').addEventListener('click', ()=>{
      const inputSelector = document.querySelector('.js-side-bar-name');
      addParentsToData(Number(inputSelector.id));
      generateTree(personId);
    });

    /**
     * Detects when the user clicks on the add partner button and calls the function to add a partner.
     * Then it calls generate tree to reload the tree. 
     */
    document.querySelector('.js-add-partner-button').addEventListener('click', ()=>{
      const inputSelector = document.querySelector('.js-side-bar-name');
      addPartnerToPerson(Number(inputSelector.id));
      generateTree(personId);
    });

    /**
     * Detects when the user clicks on the add sibling button and calls the function to add a sibling.
     * Then it calls generate tree to reload the tree. 
     */
    document.querySelector('.js-add-sibling-button').addEventListener('click', ()=>{
      const inputSelector = document.querySelector('.js-side-bar-name');
      addSiblingToTree(Number(inputSelector.id));
      generateTree(personId);
    });

    /**
     * Detects when the user clicks out of the name input and calls function to update the name.
     * Then generates the tree
     * 
     * [need to update so that the name is updating as the person is typing]
     */
    document.querySelector('.js-side-bar-name').addEventListener('blur', () =>{
      const tempInput = document.querySelector('.js-side-bar-name');
      updateName(Number(tempInput.id), tempInput.value);
      generateTree(Number(tempInput.id));
    });

}






