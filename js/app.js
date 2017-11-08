(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // Get movie info base on search results.

  // Set variables.
  let input = $('#search');
  let button = $('.btn-large');


  // Click event set on button when user submits search query.
  button.click(function (event) {
    // console.log(input.val());
    if (input.val() === "") {
      // Alert is search bar is blank and submit button is clicked.
      alert('Not a valid input!!!');
      return;
    } else {
      // Get request to return array of objects from database based on
      // search query.
      let $xhr = $.getJSON(`https://omdb-api.now.sh/?s=${input.val()}`);
      console.log('Search bar data:', $xhr);

      // Retreive data from server.  Below is a successful promise.
      $xhr.done(function(data) {
        if ($xhr.status !== 200) {
          return;
        } else {
          // Loop over data returned from server, and assign Object keys from
          // each movie with the data needed, and push to new Object to be
          // rendered on screen.
          for (let i = 0; i < data.Search.length; i++) {
            let movieObj = {};

            movieObj.id = data.Search[i].imdbID;
            movieObj.poster = data.Search[i].Poster;
            movieObj.title = data.Search[i].Title;
            movieObj.year = data.Search[i].Year;

            // Retreive movie plot data from server to update modal.
            let $xhr = $.getJSON(`https://omdb-api.now.sh/?i=${data.Search[i].imdbID}&plot=full`);
            console.log('Movie ID returned: ', $xhr);

            $xhr.done(function(data2) {
              // The plot text comes from data2, which was returned from the
              // get request on line 96.
              movieObj.plot = data2.Plot;
              // console.log(movieObj.plot);
            });
            console.log('Movie obj w plot: ', movieObj);

            movies.push(movieObj);
          }
        }
        renderMovies();
      });
    
      // Alert if there is a failed promise
      $xhr.fail(function(err) {
        alert(err);
      });

    }

    // Clear search bar after response from server.
    input.val('');

    // Prevent default behavior, i.e., prevent other event handlers from
    // executing after .click is fired.
    event.preventDefault();

  });

})();
