import { familyInfo, hasPartner, hasChildren, getPartnerId, getIndexofId} from "../../data/person.js";

/**
 * Generates the lines that link how each person is related. If they are partners or children of someone.
 * Uses recursion by starting at the top of the family tree and going down the children.
 * @param {Number} personId The person's id
 */
export function drawLine(personId){

  if(hasPartner(personId)){
    checkOrientationofBoxes(personId, getPartnerId(personId));
  }


  /**
   * Search for the div of the 2 people and obtain their coordinates on the page
   * and call function to draw lines between them.
   * @param {Number} id1 First person's ID
   * @param {Number} id2 Second person's ID(Partner of the first person)
   */
  function checkOrientationofBoxes(id1, id2){
    const box1 = document.querySelector(`.js-${id1}`);
    const box2 = document.querySelector(`.js-${id2}`);

    const rect1 = box1.getBoundingClientRect();
    const rect2 = box2.getBoundingClientRect();
    const divbox = document.querySelector(`.js-familyTree`).getBoundingClientRect();
    if(rect2.x >rect1.x){
      drawLinebetweenPartners(rect1, rect2, id1, divbox)
    }else {
      drawLinebetweenPartners(rect2, rect1, id1, divbox)
    }
  }

  /**
   * Generates the horizontal line that connects the children together.
   * Calculates the location of the leftmost child and the rightmost child.
   * Also calculates in the occasion that there is only one child but they have a partner.
   * @param {Number} personId The person's ID
   * @param {Object} parentRec The object of the left parents div
   * @param {Object} parentRec2 The object of the right parents div
   * @param {Object} divbox The object of the div that contains all of the people's divs
   */
  function drawHorizontalLine(personId, parentRec, parentRec2, divbox){
    const indexofPerson = getIndexofId(personId);
    const leftRec = document.querySelector(`.js-${familyInfo[indexofPerson].childrenId[0]}`).getBoundingClientRect();
    const height = (leftRec.y-(parentRec.y+ parentRec.height))/2;
    if(familyInfo[indexofPerson].childrenId.length > 1){
      
      const rightRec = document.querySelector(`.js-${familyInfo[indexofPerson].childrenId[familyInfo[indexofPerson].childrenId.length-1]}`).getBoundingClientRect(); 
      const x1 = Math.abs((leftRec.left + leftRec.width/2) - divbox.left);
      const y1 = Math.abs(leftRec.top - divbox.y - height);

      const length = rightRec.x - leftRec.x;
        let htmlLine =  `<div class='js-lines' style='padding:0px; 
        margin:0px;
        height: 5px;
        background-color: #0F0;
        line-height:1px;
        position:absolute;
        left: ${x1}px;
        top: ${y1}px; 
        width: ${length}px; 
      '/>`
      document.querySelector('.js-familyTree').innerHTML += htmlLine;
    }else if(hasPartner(familyInfo[indexofPerson].childrenId[0])){
      const x1 = Math.abs((leftRec.left + leftRec.width/2) - divbox.left);
      const y1 = Math.abs(leftRec.top - divbox.y - height);
      const length = Math.abs(parentRec.right - parentRec2.left)/2+ leftRec.width/2;

        let htmlLine =  `<div class='js-lines' style='padding:0px; 
        margin:0px;
        height: 5px;
        background-color: #0F0;
        line-height:1px;
        position:absolute;
        left: ${x1}px;
        top: ${y1}px; 
        width: ${length}px; 
      '/>`
      document.querySelector('.js-familyTree').innerHTML += htmlLine;
    }
  }

  /**
   * Generates the vertical line that is in the middle of each child.
   * @param {Object} parentRec The object of the left parent that has the div's coordinates.
   * @param {Number} childId The ID of the child.
   * @param {Object} divbox The object of the div that contains the divs of all the people
   */
  function drawVerticalLine(parentRec, childId, divbox){
    const childRec = document.querySelector(`.js-${childId}`).getBoundingClientRect();
    const height = (childRec.y-(parentRec.y+ parentRec.height))/2;
    const x1 = Math.abs((childRec.left + childRec.width/2) - divbox.left);
    const y1 = Math.abs(childRec.top - divbox.y - height);
    
    let htmlLine =  `<div class='js-lines' style='padding:0px; 
    margin:0px;
    height: 5px;
    background-color: #0F0;
    line-height:1px;
    position:absolute;
    left: ${x1}px;
    top: ${y1}px; 
    width: ${height}px; 
    transform: rotate(90deg);
    transform-origin: top left;
    '/>`

  document.querySelector('.js-familyTree').innerHTML += htmlLine;
  }

  /**
   * Calculate the length and location of the lines that links the partners.
   * Then it checks to see if they have children and if they do, it calls the starting function.
   * 
   * @param {Object} rect1 The object of the first person that contains the cordinates of the div
   * @param {Object} rect2 The object of the second person that contains the cordinates of the div
   * @param {Number} id1 The ID of the first person
   * @param {Ojbect} divbox The object in which all of the persons divs are nested inside.
   */
  function drawLinebetweenPartners(rect1, rect2, id1, divbox) {
    
    const x1 = Math.abs(divbox.x - rect1.right);
    const length = Math.abs(rect1.right - rect2.left);
    const y1 = Math.abs((rect1.top + rect1.height/2) - divbox.y);

    let htmlLine =  `<div class='js-lines' style='padding:0px; 
    margin:0px;
    height: 5px;
    background-color: #0F0;
    line-height:1px;
    position:absolute;
    left: ${x1}px;
    top: ${y1}px; 
    width: ${length}px;' />`

    if(hasChildren(id1)){
      familyInfo[getIndexofId(id1)].childrenId.forEach((childId) => {
        drawVerticalLine(rect1, childId, divbox);
        drawLine(childId);
      });
      drawHorizontalLine(id1, rect1, rect2, divbox);
      
      /**
       * This creates the vertical line that connects parents to children.
       */
      const childRect = document.querySelector(`.js-${familyInfo[getIndexofId(id1)].childrenId[0]}`).getBoundingClientRect();
      const length2 = ((childRect.top - rect1.bottom)/2) + rect1.height/2;
      let htmlLine1 =  `<div class='js-lines' style='padding:0px; 
      margin:0px;
      height: 5px;
      background-color: #0F0;
      line-height:1px;
      position:absolute;
      left: ${x1+(length/2)}px;
      top: ${y1}px; 
      width: ${length2}px;
      transform: rotate(90deg);
      transform-origin: top left;
      ' />`
      
      document.querySelector('.js-familyTree').innerHTML += htmlLine1;
    }

    document.querySelector('.js-familyTree').innerHTML += htmlLine;
  }

}

/**
 * Deletes all of the lines 
 */
export function deleteLines(){
  document.querySelectorAll('.js-lines').forEach(e => e.remove());
}