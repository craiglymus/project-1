
const render = (insect) =>{
  console.log(insect);
  $('.bugData').append(`
    <li class="insect" id="${insect._id}">
      <p class="description">${insect.description}</p>
      <i class="edit fas fa-edit"></i>
      <i class="delete fas fa-trash-alt"></i>
    </li>`)
}

$(document).on('click', '.edit', (e)=>{

  let editedInsect= $(e.target).parents('.insect');

  let description = editedInsect.find('.description').html();
  $(editedInsect).html(`
      <form id='editBug'>
        <input type"text" id="editBugDescription" name="description" value="${description}"/>
        <input type="submit" placeholder="Submit"/>
      </form>
    `);
});

$(document).on('submit', '#editBug', (e)=>{
  let editedInsect= $(e.target).parents('.insect');
  let editedId = editedInsect.attr('id');

  let description = $('#editBugDescription').val();

  let posting = {
    description: description
  };
  console.log(posting);

  $.ajax({
    method: 'PUT',
    url: `/api/insects/${editedId}`,
    data: posting,
    success: ()=>{
      console.log('Putted');
    },
    error: ()=>{
      console.log('Error');
    }
  })
});


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
