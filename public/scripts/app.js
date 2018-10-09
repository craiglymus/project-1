
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
  let addBugDescription = $('#addBugDescription').val();
  let addedBug = {
    description: addBugDescription
  };
  $.ajax({
    method: 'POST',
    url: '/api/insects',
    data: addedBug,
    success: (response)=>{
      console.log(`Submitted ${addedBug}`);
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
