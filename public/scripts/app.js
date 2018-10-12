/* Populates seed data with Wikipedia summary and image, using MediaWiki's API */
const wikiBaseUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

/* Returns the top photo from the article. */
const getWiki = (item) =>{
  let title = item.commonName ? item.commonName : item.scientificName;
  title = title.trim().split(' ').join('_');
  $.ajax({
    method: 'GET',
    url: `${wikiBaseUrl}${title}`,
    success: (response) =>{
      if (response.content_urls) item.link = response.content_urls.desktop.page
      if(response.extract) item.summary = response.extract;
      if(response.originalimage.source) item.image = response.originalimage.source;
      console.log(response);
    },
    error: (err) =>{
      console.log('Error occurred');
    }
  });
}

const render = (insect) =>{
  console.log(insect);
  $('.bugData').append(`
    <div class="insect" id="${insect._id}">
      <img src="${insect.image}">

      <div class="insect-info-container">
        <p>${insect.commonName}</p>
        <p>${insect.scientificName}</p>
        <p>${insect.familyName}</p>
        <p>${insect.description}</p>
        <p>${insect.summary}</p>
      </div>

      <form class="hidden-form edit-form">
        <input id="insectEditCommonName" type="text" name="commonName" value="${insect.commonName}">
        <input id="insectEditScientificName" type="text" name="scientificName" value="${insect.scientificName}">
        <input id="insectEditFamilyName" type="text" name="familyName" value="${insect.familyName}">
        <input id="insectEditDescription" type="text" name="description" value="${insect.description}">
        <input id="insectEditSummary" type="text" name="summary" value="${insect.summary}">
        <input type="submit" value="Edit this bug!">
      </form>

      <i class="edit fas fa-edit"></i>
      <i class="delete fas fa-trash-alt"></i>
    </div>`)
}

//Searches for an individual bug by its common name
const searchByName = (name) => {
  name = name.toLowerCase();
  console.log(`asking for ${name}`);
  $.ajax({
    method: 'GET',
    url: `/api/insects/${name}`,
    success: (response) =>{
      $('.bugData').html('');
      console.log(response)
      if(response !== null){
        render(response);
      } else {
        $('.bugData').html(`
          <h1>Sorry, we couldn't find what you were looking for!</h1>
        `);
      }
    }
  })
}

$('#search').on('submit', (e)=>{
  e.preventDefault();
  let searchName = $('#searchName').val();
  console.log(`asking for ${searchName}`)
  searchByName(searchName);
})

//Needs to take all of the info (including name, family name, and scientific name)
//Needs to connect this to the correct family -- server.js
//Pull wiki information
$('#addBug').on('submit', (e)=>{
  e.preventDefault()
  let addBugCommonName = $('#addBugCommonName').val();
  let addBugScientificName = $('#addBugScientificName').val();
  let addBugFamilyName = $('#addBugFamilyName').val();
  let addBugDescription = $('#addBugDescription').val();
  let addedBug = {
    commonName: addBugCommonName.toLowerCase(),
    scientificName: addBugScientificName.toLowerCase(),
    familyName: addBugFamilyName,
    description: addBugDescription
  };

  let title = addedBug.commonName ? addedBug.commonName : addedBug.scientificName;
  title = title.trim().split(' ').join('_');

  $.ajax({
    method: 'GET',
    url: `${wikiBaseUrl}${title}`,
    success: (response) =>{
      if (response.content_urls) addedBug.link = response.content_urls.desktop.page
      if (response.extract) addedBug.summary = response.extract;
      if (response.originalimage.source) addedBug.image = response.originalimage.source;
      $.ajax({
        method: 'POST',
        url: '/api/insects',
        data: addedBug,
        success: (response) => {
          $('.submitted').show();
        },
        error: ()=>{
          console.log('Error');
        }
      })
    },
    error: (err) =>{
      console.log('Error occurred');
    }
  });

});

//Create edit function on entries
$(document).on('click', '.edit', (e) => {
  e.preventDefault();
  // capture the bug ID
  let id = e.target.parentElement.id;

  // hide .insect-info-container
  $(`#${id}`).children()[1].style.display = "none";
  $(`#${id}`).children()[2].style.display = "block";
});

$(document).on('submit', '.edit-form', (e) => {
  e.preventDefault();
  let id = e.target.parentElement.id;

  let insectEditCommonName = $('#insectEditCommonName').val();
  let insectEditScientificName = $('#insectEditScientificName').val();
  let insectEditFamilyName = $('#insectEditFamilyName').val();
  let insectEditDescription = $('#insectEditDescription').val();
  let insectEditSummary = $('#insectEditSummary').val();

  let editFormData = {
    commonName: insectEditCommonName,
    scientificName: insectEditScientificName,
    familyName: insectEditFamilyName,
    description: insectEditDescription,
    summary: insectEditSummary
  }

  $.ajax({
    method: "PUT",
    url: `/api/insects/${id}`,
    data: editFormData,
    success: (response) => {
      console.log("success");
    },
    error: (err) => {
      console.log("no success");
    },
    complete: (response) => {
      console.log("ajax has completed!");
    }
  })
})

//Delete
$(document).on('click', '.delete', (e) => {
    e.preventDefault();
  let deletedId = $(e.target).parents('.insect').attr('id');
  console.log(deletedId);

  let queryString = `/api/insects/${deletedId}`;
  $.ajax({
    method: 'DELETE',
    url: queryString,
    success: () => {
      $(`#${deletedId}`).remove();
    },
    error: (err) => {
      console.log(err);
    }
  });
});

const setUp = () =>{
  $.ajax({
    method: 'GET',
    url: '/api/insects',
    success: (response) =>{
      for(let i = 0; i < response.length; i++){
        render(response[i]);
      }
    }
  });

  //Populates dropdown menu in form to reflect Family Data
  $.ajax({
    method: 'GET',
    url: '/api/families',
    success: (response)=>{
      for(let i = 0; i < response.length; i++){
        $('#addBugFamilyName').append(`<option value="${response[i].name}">${response[i].name}</option>`);
      }
    }
  })
}
setUp();
