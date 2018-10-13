/* Populates seed data with Wikipedia summary and image, using MediaWiki's API */
const wikiBaseUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

// const getWiki = (item) =>{
//   let title = item.commonName ? item.commonName : item.scientificName;
//   title = title.trim().split(' ').join('_');
//   $.ajax({
//     method: 'GET',
//     url: `${wikiBaseUrl}${title}`,
//     success: (response) =>{
//       console.log(response);
//       let summary = response.extract;
//       let image = response.originalimage.source
//       title.summary = summary;
//       image.summary = image;
//     },
//     error: (err) =>{
//       console.log('Error occurred');
//     }
//   });
// }

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
        <input id="editBugCommonName" type="text" name="commonName" value="${insect.commonName}">
        <input id="editBugScientificName" type="text" name="scientificName" value="${insect.scientificName}">
        <input id="editBugFamilyName" type="text" name="familyName" value="${insect.familyName}">
        <input id="editBugDescription" type="text" name="description" value="${insect.description}">
        <input type="submit" value="Edit this bug!">
      </form>

      <i class="edit fas fa-edit"></i>
      <i class="delete fas fa-trash-alt"></i>
    </li>`)
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
};

$('#search').on('submit', (e)=>{
  e.preventDefault();
  let searchName = $('#searchName').val();
  console.log(`asking for ${searchName}`)
  searchByName(searchName);
})


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
      if(response.extract) addedBug.summary = response.extract;
      if(response.originalimage.source) addedBug.image = response.originalimage.source;
      $.ajax({
        method: 'POST',
        url: '/api/insects',
        data: addedBug,
        success: (response)=>{
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
// Create edit function on entries
$(document).on('click', '.edit', (e) => {
  e.preventDefault();
  // capture the bug ID
  let id = e.target.parentElement.id;

  // hide .insect-info-container
  $(`#${id}`).children()[1].style.display = "none";
  $(`#${id}`).children()[2].style.display = "block";
});

// Stop form event from submitting, handle update with AJAX
$(document).on('submit', '.edit-form', (e) => {
  e.preventDefault();
  let id = e.target.parentElement.id;

  let editBugCommonName = $('#editBugCommonName').val();
  let editBugScientificName = $('#editBugScientificName').val();
  let editBugFamilyName = $('#editBugFamilyName').val();
  let editBugDescription = $('#editBugDescription').val();
  let editFormData = {
    commonName: editBugCommonName,
    scientificName: editBugScientificName,
    familyName: editBugFamilyName,
    description: editBugDescription,
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
});

//Delete
$(document).on('click', '.delete', (e) => {
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
});
}
setUp();
