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
      console.log(response);
      let summary = response.extract;
      let image = response.originalimage.source
      title.summary = summary;
      image.summary = image;
    },
    error: (err) =>{
      console.log('Error occurred');
    }
  });
}

const render = (insect) =>{
  console.log(insect);
  $('.bugData').append(`
    <li class="insect" id="${insect._id}">
      <p>${insect.description}</p>
      <i class="edit fas fa-edit"></i>
      <i class="delete fas fa-trash-alt"></i>
    </li>`)
}

$('#addBug').on('submit', (e)=>{
  e.preventDefault()
  let addBugDescription = $('#addBugDescription').val();
  let addedBug = {
    description: addBugDescription
  };
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
});

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

$('.hamburger').on('click', ()=>{
  $('.navLinks').slideToggle();
})

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
}
setUp();
