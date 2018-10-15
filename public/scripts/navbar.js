console.log('Sanity check!');

// Store all header interaction here
$('.mobile-nav-toggle').on('click', () => {
  $('.navLinks').toggleClass('show');
})

/* Auto playing slideshow on the homepage*/
$('.introImg').hide();

//Selects the first image in the slideshow
let $this = $('.introImg').first();
$this.show();
let i = 0;

//Iterates through each slide, fading between the slides every 5 seconds
setInterval(() => {
  $this.fadeOut(1000);
  if ($this.is(':last-child')) {
    $this = $('.introImg').first();
  } else {
    $this = $this.next();
  }
  setTimeout(() => {
    $this.fadeIn(1000)
  }, 1000);
}, 5000);
