/**
 * The array where all the people are stored and their information
 */
export let familyInfo = [];

/**
 * Checks localStorage for FamArray and if it doens't exists, 
 * creates a famArray of 1 person
 */
export function loadFromStorage() {
  familyInfo = JSON.parse(localStorage.getItem('famInfoArray'));
  if(!familyInfo) {
    alert('Family Tree does not exist, creating a new family tree');
    familyInfo = [];
    addPerson();
  }
}

/**
 * Checks the localStorage for faminfoarray and alerts the user that one exists if it exists.
 * @returns Boolean true if the user wants to delete the array stored in localStorage.
 */
export function isFamTreeInStorage(){
  familyInfo = JSON.parse(localStorage.getItem('famInfoArray'));
  if(familyInfo){
    let result = confirm("Family Tree exists in local storage, do you want to delete and create a new family tree?");
    if(result){
      familyInfo = [];
      return result;
    }else{
      return result;
    }
  }
}

/**
 * Saves FamilyInfo array into localStorage
 */
function saveToStorage() {
  localStorage.setItem('famInfoArray', JSON.stringify(familyInfo));
}
 

/**
 * Creates an person object with only an ID generated and pushes it to FamilyInfo 
 */
export function addPerson(){
  let temp = {
    id: Date.now() * Math.random() *100000,
    name: '',
    birthdate: '',
    image: '',
    gender: '',
    parentsId: {
      leftParent: '',
      rightParent: '',
    },
    childrenId: [],
    partnerId: ''
  }

  familyInfo.push(temp);
}

/**
 * Under construction.
 * This should delete the person with the given ID
 * @param {Number} id The person's ID
 */
function deletePerson(id) {
  familyInfo.splice(familyInfo.findIndex(v => v.id === id), 1);
}

/**
 * Search for the index of the ID, and then updates the name. Then it saves it to storage.
 * @param {Number} id The person's ID
 * @param {String} name The new name that will be assigned to the person with this ID
 */
export function updateName(id, name){
  const index = getIndexofId(id);
  familyInfo[index].name = name;
  saveToStorage();
}

/**
 * Search for the index of the ID, and then updates the birthdate. Then it saves it to storage.
 * @param {Number} id The person's ID
 * @param {Date} birthdate The date of the ID's birthday
 */
export function updateBirthDate(id, birthdate){
  const index = getIndexofId(id);
  familyInfo[index].birthdate = birthdate;
  saveToStorage();
}

/**
 * Search for the index of the ID, and then updates the gender. Then it saves it to storage.
 * @param {Number} id The person's ID
 * @param {String} gender The person's gender
 */
export function updateGender(id, gender){
  const index = getIndexofId(id);
  familyInfo[index].gender = gender;
  saveToStorage();
}

/**
 * Search for the index of the ID, and then updates the Left and Right parent.
 * @param {Number} id The person's ID of whom is being updated
 * @param {Number} lId The left parent's ID of the person
 * @param {Number} rId The right parent's ID of the person
 */
function updateParents(id,lId, rId){
  const index = getIndexofId(id);
  familyInfo[index].parentsId.leftParent = lId;
  familyInfo[index].parentsId.rightParent = rId;
}

/**
 * Under construction
 * Update where the src of the img is
 * @param {String} imgLocation Location of the image file
 */
function updateImg(imgLocation){

}

/**
 * Search for the index of the ID, and checks if they have parents or not.
 * @param {Number} id The person's ID
 * @returns Boolean yes or no if the person has parents
 */
function hasParents(id){
  const index = getIndexofId(id);

  if(familyInfo[index].parentsId.leftParent === ''){
    return false;
  }else{
    return true;
  }

}

/**
 * Search for the index of the ID, and check if they have a partner or not.
 * @param {Number} id The person's ID
 * @returns Boolean yes or no if the person has a partner
 */
export function hasPartner(id){
  const index = getIndexofId(id);

  if(familyInfo[index].partnerId=== ''){
    return false;
  }else{
    return true;
  }
}

/**
 * Search for the index of the ID, and check if they have a child.
 * @param {Number} id The person's ID 
 * @returns Boolean yes or no if the person has any children.
 */
export function hasChildren(id){
  const index = getIndexofId(id);

  if(familyInfo[index].childrenId.length === 0){
    return false;
  }else{
    return true;
  }
}

/**
 * Search for the index of the ID, and return the name.
 * @param {Number} id The person's ID
 * @returns String the name of the ID
 */
export function getName(id) {
  const index = getIndexofId(id);
  return familyInfo[index].name;
}

/**
 * Calls function getPartnerID and returns
 * the name of the partner.
 * @param {Number} id The person's ID
 * @returns String the name of the partner of the ID
 */
export function getPartnerName(id){
  const tempid = getPartnerId(id);
  return familyInfo[getIndexofId(tempid)].name;
}

/**
 * Finds and returns the person's partner's ID
 * @param {Number} id The person's ID 
 * @returns Number the person's partner's ID
 */
export function getPartnerId(id) {
  return familyInfo[getIndexofId(id)].partnerId;
}

/**
 * Uses the array to find the person's ID and return the index
 * @param {Number} id the Person's ID
 * @returns Number the index where the person is located
 */
export function getIndexofId(id){
  return familyInfo.findIndex(v => v.id === id);
}

/**
 * Finds the person's date and returns it as a string.
 * @param {Number} id The person's ID
 * @returns Date the birthday of the person
 */
export function getBirthDate(id) {
  if(familyInfo[getIndexofId(id)].birthdate === ''){
   return '';
  }else{
    const tempDate = new Date(familyInfo[getIndexofId(id)].birthdate);
    let temp = tempDate.getFullYear() + '-';
    temp += ((tempDate.getUTCMonth() + 1) >=10 ? tempDate.getUTCMonth() + 1 : '0' + (tempDate.getUTCMonth() + 1)) + '-';
    temp += tempDate.getUTCDate();
    return temp;
  }
  
}

/**
 * Checks and creates parents of the given ID, and links the parents as partners
 * and saves it to storage.
 * @param {Number} id The person's ID
 * @returns Boolean yes or no if parents were created
 */
export function addParents(id){

  if(!hasParents(id)){
    addPerson();
    familyInfo[familyInfo.length-1].childrenId.push(id);
    familyInfo[familyInfo.length-1].gender = 'Female';
    addPerson();
    familyInfo[familyInfo.length-1].childrenId.push(id);
    familyInfo[familyInfo.length-1].gender = 'Male';

    familyInfo[familyInfo.length-1].partnerId = familyInfo[familyInfo.length-2].id;
    familyInfo[familyInfo.length-2].partnerId = familyInfo[familyInfo.length-1].id;
    familyInfo[getIndexofId(id)].parentsId.leftParent = familyInfo[familyInfo.length-2].id;
    familyInfo[getIndexofId(id)].parentsId.rightParent  = familyInfo[familyInfo.length-1].id;
    saveToStorage();
    return true;
  }else{
    return false;
  }
}

/**
 * Checks to see if the person has parents or needs to create them.
 * Then it generates a new person and links them to the parents.
 * Then it saves to storage.
 * @param {Number} id The person's ID
 */
export function addSibling(id){
  if(!hasParents(id)){
    addParents(id);
  }

  const leftParenId = familyInfo[getIndexofId(id)].parentsId.leftParent;
  const righParentId = familyInfo[getIndexofId(id)].parentsId.rightParent;

  addPerson();

  updateParents(familyInfo[familyInfo.length-1].id, leftParenId, righParentId);

  familyInfo[getIndexofId(leftParenId)].childrenId.push(familyInfo[familyInfo.length-1].id);
  familyInfo[getIndexofId(righParentId)].childrenId.push(familyInfo[familyInfo.length-1].id);
  saveToStorage();
}

/**
 * Checks if the person has a partner already or creates one.
 * @param {Number} id The person's ID
 * @returns Boolean yes or no if the partner was created
 */
export function addPartner(id){
  if(!hasPartner(id)){
    addPerson();
    familyInfo[familyInfo.length-1].partnerId = id;
    familyInfo[getIndexofId(id)].partnerId = familyInfo[familyInfo.length-1].id;
    saveToStorage();
    return true;
  }else{
    return false;
  }
}

/**
 * Checks to see if the person has a partner, then it creates a new person 
 * and links them to the parents in the data and then saves to storage.
 * @param {Number} id The person's ID
 */
export function addChild(id){
  if(!hasPartner(id)){
    addPartner(id);
  }
  const partnerIdTemp = familyInfo[getIndexofId(id)].partnerId;
  addPerson();

  updateParents(familyInfo[familyInfo.length-1].id, id, partnerIdTemp);

  familyInfo[getIndexofId(id)].childrenId.push(familyInfo[familyInfo.length-1].id);
  familyInfo[getIndexofId(partnerIdTemp)].childrenId.push(familyInfo[familyInfo.length-1].id);
  saveToStorage();
}

/**
 * Finds and returns the gender of the person.
 * @param {Number} id The person's ID
 * @returns String the gender of the person
 */
export function getGender(id) {
  return familyInfo[getIndexofId(id)].gender;
}
