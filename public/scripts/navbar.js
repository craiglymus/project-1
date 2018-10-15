console.log("Sanity check!");

// Store all header interaction here
$('.mobile-nav-toggle').on('click', ()=>{
  $('.navLinks').toggleClass("show");
})

var slideshow = 0;
 let slideIndex =0;
showSlides();

function plusSlides(n) {
  goToSlide(slideIndex += n);
}


function showSlides() {
    var i;
    var slides = document.getElementsByClassName("introImg");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;

    if (slideIndex > slides.length) { slideIndex = 1 }

    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 3000);
}

function goToSlide(n) {
  var i;
  var slides = document.getElementsByClassName("introImg");

  if (n > slides.length) { slideIndex = 1 }

  if (n < 1) { slideIndex = slides.length }

  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }

  slides[slideIndex-1].style.display = "block";
}
