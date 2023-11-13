
import axios, {isCancel, AxiosError} from 'axios';
import _ from 'lodash'

// variables
const searchGroup = document.getElementById("searchbar")
const searchInput = document.getElementById("search")
const grid = document.getElementById("grid")
const modal = document.getElementById("modal")
const closeBtn = document.getElementById("close__modal")
const modalText = document.getElementById("description")
const error = document.getElementById("error__div")
const errorBtn = document.getElementById("error__close")
const spinner = document.getElementById("loader")
const heroTxt = document.getElementById("hero__title")

// event listener
closeBtn.addEventListener("click", closeModal)
errorBtn.addEventListener("click", closeError)

// searchbar
function searchBar(){
  searchInput.addEventListener("change", e =>{
  closeHeroTxt()
  loader();
  const subject = e.target.value
  if(subject == ""){
    openError()
    endLoader()
  }else{
    getApi(subject.replace(/\s/g, ''))
    closeError()
  }
  while (grid.firstChild){ 
  grid.removeChild(grid.firstChild)
  } 
  })
}



// Api

  
function getApi(subjects){
    try{
        return axios.get(`https://openlibrary.org/subjects/${subjects}.json`)
        .then(data =>{
          const obj = data.data.works
          if(obj == 0){
            openError()
            endLoader()
          }
          Object.keys(obj).forEach(key =>{
          let bookWorks =_.get(obj, [key, "key"])
          let bookName = _.get(obj, [key, "title"])
          let bookAuthor = _.get(obj, [key, "authors", "0", "name"])
          genarateCards(bookAuthor, bookName, bookWorks)
          })
        })

      }catch(err){
     console.log(err)
    }
    }
  

 async function getDescription(bookWorks){
  try{
    await axios.get(`https://openlibrary.org${bookWorks}.json`)
    .then(data =>{
      let description = _.get(data, "data.description")
      let dataValue = _.get(data, "data.description.value")
      openModal(description, dataValue)
    })
  }catch(err){
    console.log(err)
  }

}

// // Card
function genarateCards(){
  const args = Array.from(arguments)
  if (args == undefined) { 
    grid.style.display = "hidden";
  }else{ 
    endLoader();
    const card = document.createElement("div")
    card.className = "card"
    grid.appendChild(card)

    const title = document.createElement("h3")
    title.className = "card__title"
    title.innerHTML = `${args[1]}`
    card.appendChild(title)

    const author = document.createElement("p")
    author.className = "card__content"
    author.innerHTML = `${args[0]}`
    card.appendChild(author)

    const button = document.createElement("button")
    button.className = "button"
    button.innerHTML = "More"
    card.appendChild(button)
    button.addEventListener("click",  ()  => getDescription(args[2])) 
 } 
 } 

// modal

function openModal(description, dataValue){
  modal.style.display = "block"
  grid.classList.add("active")
  if(typeof description !== "string"){
   return modalText.innerHTML = `<h4>Description:</h4> ${dataValue}`
  }else{
    return modalText.innerHTML = `<h4>Description:</h4> ${description}`
  }
}


function closeModal(){
  modal.style.display = "none"
  grid.classList.remove("active")
}

// error
function openError(){
  error.style.display = "flex"
}
function closeError(){
  error.style.display = "none"
}

function loader(){
  spinner.style.display = "block"
}
function endLoader(){
  spinner.style.display = "none"
}
function closeHeroTxt(){
  heroTxt.style.display = "none"
  document.body.style.height = "fit-content"
  searchGroup.style.marginTop = "3rem"
}

searchBar()