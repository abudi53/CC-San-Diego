(function($) {
 
    var SliceSlider = {
      
      /**
       * Settings Object
       */
      settings: {
        delta:              0,
        currentSlideIndex:  0,
        scrollThreshold:    40,
        slides:             $('.slide-ofertas'),
        numSlides:          $('.slide-ofertas').length,
        navPrev:            $('.js-prev'),
        navNext:            $('.js-next'),
      },
      
      /**
       * Init
       */
      init: function() {
        s = this.settings;
        this.bindEvents();
      },
      
      /**
       * Bind our click, scroll, key events
       */
      bindEvents: function(){
        
        // Scrollwheel & trackpad
        s.slides.on({
          'DOMMouseScroll mousewheel' : SliceSlider.handleScroll
        });
        // On click prev
        s.navPrev.on({
          'click' : SliceSlider.prevSlide
        });
        // On click next
        s.navNext.on({
          'click' : SliceSlider.nextSlide
        });
        // On Arrow keys
        $(document).keyup(function(e) {
          // Left or back arrows
          if ((e.which === 37) ||  (e.which === 38)){
            SliceSlider.prevSlide();
          }
          // Down or right
          if ((e.which === 39) ||  (e.which === 40)) {
            SliceSlider.nextSlide();
          }
        });
      },
      
      /** 
       * Interept scroll direction
       */
      handleScroll: function(e){
  
        // Scrolling up
        if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) { 
  
          s.delta--;
       
          if ( Math.abs(s.delta) >= s.scrollThreshold) {
            SliceSlider.prevSlide();
          }
        }
   
        // Scrolling Down
        else {
   
          s.delta++;
   
          if (s.delta >= s.scrollThreshold) {
            SliceSlider.nextSlide();
          }
        }
   
        // Prevent page from scrolling
        return false;
      },
  
      /**
       * Show Slide
       */
      showSlide: function(){ 
        // reset
        s.delta = 0;
        // Bail if we're already sliding
        if ($('body').hasClass('is-sliding')){
          return;
        }
        // Loop through our slides
        s.slides.each(function(i, slide) {
  
          // Toggle the is-active class to show slide
          $(slide).toggleClass('is-active', (i === s.currentSlideIndex)); 
          $(slide).toggleClass('is-prev', (i === s.currentSlideIndex - 1)); 
          $(slide).toggleClass('is-next', (i === s.currentSlideIndex + 1)); 
          
          // Add and remove is-sliding class
          $('body').addClass('is-sliding');
  
          setTimeout(function(){
              $('body').removeClass('is-sliding');
          }, 1000);
        });
      },
  
      /**
       * Previous Slide
       */
      prevSlide: function(){
        
        // If on first slide, loop to last
        if (s.currentSlideIndex <= 0) {
          s.currentSlideIndex = s.numSlides;
        }
        s.currentSlideIndex--;
        
        SliceSlider.showSlide();
      },
  
      /**
       * Next Slide
       */
      nextSlide: function(){
        
        s.currentSlideIndex++;
     
        // If on last slide, loop to first
        if (s.currentSlideIndex >= s.numSlides) { 
          s.currentSlideIndex = 0;
        }
   
        SliceSlider.showSlide();
      },
    };
    SliceSlider.init();
  })(jQuery);


  $(document).ready(function() {
  
    var $slider = $(".slider"),
        $slideBGs = $(".slide__bg"),
        diff = 0,
        curSlide = 0,
        numOfSlides = $(".slide").length-1,
        animating = false,
        animTime = 500,
        autoSlideTimeout,
        autoSlideDelay = 6000,
        $pagination = $(".slider-pagi");
    
    function createBullets() {
      for (var i = 0; i < numOfSlides+1; i++) {
        var $li = $("<li class='slider-pagi__elem'></li>");
        $li.addClass("slider-pagi__elem-"+i).data("page", i);
        if (!i) $li.addClass("active");
        $pagination.append($li);
      }
    };
    
    createBullets();
    
    function manageControls() {
      $(".slider-control").removeClass("inactive");
      if (!curSlide) $(".slider-control.left").addClass("inactive");
      if (curSlide === numOfSlides) $(".slider-control.right").addClass("inactive");
    };
    
    function autoSlide() {
      autoSlideTimeout = setTimeout(function() {
        curSlide++;
        if (curSlide > numOfSlides) curSlide = 0;
        changeSlides();
      }, autoSlideDelay);
    };
    
    autoSlide();
    
    function changeSlides(instant) {
      if (!instant) {
        animating = true;
        manageControls();
        $slider.addClass("animating");
        $slider.css("top");
        $(".slide").removeClass("active");
        $(".slide-"+curSlide).addClass("active");
        setTimeout(function() {
          $slider.removeClass("animating");
          animating = false;
        }, animTime);
      }
      window.clearTimeout(autoSlideTimeout);
      $(".slider-pagi__elem").removeClass("active");
      $(".slider-pagi__elem-"+curSlide).addClass("active");
      $slider.css("transform", "translate3d("+ -curSlide*100 +"%,0,0)");
      $slideBGs.css("transform", "translate3d("+ curSlide*50 +"%,0,0)");
      diff = 0;
      autoSlide();
    }
  
    function navigateLeft() {
      if (animating) return;
      if (curSlide > 0) curSlide--;
      changeSlides();
    }
  
    function navigateRight() {
      if (animating) return;
      if (curSlide < numOfSlides) curSlide++;
      changeSlides();
    }
  
    $(document).on("mousedown touchstart", ".slider", function(e) {
      if (animating) return;
      window.clearTimeout(autoSlideTimeout);
      var startX = e.pageX || e.originalEvent.touches[0].pageX,
          winW = $(window).width();
      diff = 0;
      
      $(document).on("mousemove touchmove", function(e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX;
        diff = (startX - x) / winW * 70;
        if ((!curSlide && diff < 0) || (curSlide === numOfSlides && diff > 0)) diff /= 2;
        $slider.css("transform", "translate3d("+ (-curSlide*100 - diff) +"%,0,0)");
        $slideBGs.css("transform", "translate3d("+ (curSlide*50 + diff/2) +"%,0,0)");
      });
    });
    
    $(document).on("mouseup touchend", function(e) {
      $(document).off("mousemove touchmove");
      if (animating) return;
      if (!diff) {
        changeSlides(true);
        return;
      }
      if (diff > -8 && diff < 8) {
        changeSlides();
        return;
      }
      if (diff <= -8) {
        navigateLeft();
      }
      if (diff >= 8) {
        navigateRight();
      }
    });
    
    $(document).on("click", ".slider-control", function() {
      if ($(this).hasClass("left")) {
        navigateLeft();
      } else {
        navigateRight();
      }
    });
    
    $(document).on("click", ".slider-pagi__elem", function() {
      curSlide = $(this).data("page");
      changeSlides();
    });
    
  });


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show")
        }else{
            entry.target.classList.remove("show")
        }
    })
})

const hiddenElements = document.querySelectorAll(".hidden");

hiddenElements.forEach((el) => observer.observe(el));

function queryStores(){

  let tablaRef = document.getElementById("store-table-body");
  tablaRef.innerHTML = '';

  fetch('http://127.0.0.1:8080/store/list', {
    method: 'GET'
  })
      .then((response) => response.json())
      .then((data) => {
            data.forEach(store => {

              let rowRef = tablaRef.insertRow(-1);

              let cellRef = rowRef.insertCell(0);
              cellRef.textContent = store.name;

              cellRef = rowRef.insertCell(1);
              cellRef.textContent = store.code;

              cellRef = rowRef.insertCell(2);
              cellRef.textContent = store.rif;

              cellRef = rowRef.insertCell(3);
              cellRef.textContent = store.responsible;

              cellRef = rowRef.insertCell(4);
              cellRef.textContent = store.email

              cellRef = rowRef.insertCell(5);
              cellRef.textContent = store.phoneNo;

            })
          }
      );

  // For testing, comment fetch and uncomment:

  // let data = [
  //   {
  //     name:"Ricardo Diaz Store",
  //     code:"IDKIDC",
  //     rif:"J-0123456789",
  //     responsible: "Ricardo Diaz",
  //     email: "rdiaz@ujap.com",
  //     phoneNo:"+58 4128805248"
  //   },
  //   {
  //     name:"Andres Santamaria Store",
  //     code:"IDKIDC2",
  //     rif:"J-0123456789",
  //     responsible: "Andres Santamaria",
  //     email: "asantamaria@ujap.com",
  //     phoneNo:"+58 4162301542"
  //   },
  // ]
  //
  // data.forEach(store => {
  //
  //               let rowRef = tablaRef.insertRow(-1);
  //
  //               let cellRef = rowRef.insertCell(0);
  //               cellRef.textContent = store.name;
  //
  //               cellRef = rowRef.insertCell(1);
  //               cellRef.textContent = store.code;
  //
  //               cellRef = rowRef.insertCell(2);
  //               cellRef.textContent = store.rif;
  //
  //               cellRef = rowRef.insertCell(3);
  //               cellRef.textContent = store.responsible;
  //
  //               cellRef = rowRef.insertCell(4);
  //               cellRef.textContent = store.email
  //
  //               cellRef = rowRef.insertCell(5);
  //               cellRef.textContent = store.phoneNo;
  //
  //             })
}

function queryContacts(){

  let tablaRef = document.getElementById("access-table-body");
  tablaRef.innerHTML = '';

  fetch('http://127.0.0.1:8080/contact/list', {
    method: 'GET'
  })
      .then((response) => response.json())
      .then((data) => {
            data.forEach(contact => {

              let rowRef = tablaRef.insertRow(-1);

              let cellRef = rowRef.insertCell(0);
              cellRef.textContent = contact.name;

              cellRef = rowRef.insertCell(1);
              cellRef.textContent = contact.email;

            })
          }
      );

  // // For testing, comment fetch and uncomment:
  //
  // let data = [
  //   {
  //     name:"Ricardo Diaz",
  //     email: "rdiaz@ujap.com"
  //   },
  //   {
  //     name:"Abdullah Fares",
  //     email:"afares@ujap.com"
  //   },
  // ]
  //
  // data.forEach(contact => {
  //
  //   let rowRef = tablaRef.insertRow(-1);
  //
  //   let cellRef = rowRef.insertCell(0);
  //   cellRef.textContent = contact.name;
  //
  //   cellRef = rowRef.insertCell(1);
  //   cellRef.textContent = contact.email;
  //
  // })
}

function openMaps(){
  window.open("https://goo.gl/maps/Jjzy5XNypzjYqmw38", "_blank")
}

function goIndex(){
  window.location.href = "index.html?_ijt=esv3shl6q883cfc032bpmmr8r0";
}

function goStores(){
  window.location.href = "stores.html?_ijt=esv3shl6q883cfc032bpmmr8r0";
}

function goCreateStores(){
  window.location.href = "create-store.html?_ijt=esv3shl6q883cfc032bpmmr8r0";
}

function goContact(){
  window.location.href = "contact.html?_ijt=esv3shl6q883cfc032bpmmr8r0";
}

function goAccessContacts(){
  window.location.href = "access.html?_ijt=esv3shl6q883cfc032bpmmr8r0";
}

let form = document.getElementById("form");

if (form){
  form.addEventListener("submit", function(eve){
    eve.preventDefault();

    let contactForm = new FormData(form);

    const data = {
      name: contactForm.get("name"),
      email: contactForm.get("email"),
    }

    fetch('http://127.0.0.1:8080/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then( (response) =>{
          if (response.ok){
            goIndex();
          } else {
            alert("Algo mal ha ocurrido enviando el formulario")
          }
        }
    )

  });
}


let storeForm = document.getElementById("store-form");

if(storeForm){
  storeForm.addEventListener("submit", function(eve){
    eve.preventDefault();

    console.log("called")
    let createStoreForm = new FormData(storeForm);

    const data = {
      name: createStoreForm.get("name"),
      code: createStoreForm.get("code"),
      rif: createStoreForm.get("rif"),
      responsible: createStoreForm.get("responsible"),
      email: createStoreForm.get("email"),
      phoneNo: createStoreForm.get("phoneNo"),
    }

    console.log(data);

    fetch('http://127.0.0.1:8080/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then( (response) =>{
          if (response.ok){
            queryStores();
          } else {
            alert("Algo mal ha ocurrido enviando el formulario")
          }
        }
    )

  });
}


function goAccess(){
  let username=prompt('Por Favor Logueate, Usuario:','');
  fetch('http://127.0.0.1:8080/user/exists?username=' + username , {
    method: 'GET'
  }).then((response) => {
      if(response.ok){
        let password = prompt('Indique contraseña: ','');
        fetch('http://127.0.0.1:8080/user/authenticate?username=' + username +"&password=" + password, {
          method: 'GET'
        }).then((response) => {
          if(response.ok){
            window.location.href = "access.html?_ijt=esv3shl6q883cfc032bpmmr8r0";
          } else {
            alert("Contraseña incorrecta");
          }
        })
      } else{
        alert("Usuario inválido");
      }
    });
}



