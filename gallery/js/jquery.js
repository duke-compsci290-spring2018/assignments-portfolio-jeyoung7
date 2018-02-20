
/*
 * Simple gallery generator in jQuery.
 *
 * @author Jacob Young
 */

$(function() {
    // possible gallery questions will be loaded dynamically using JSON
    var photos = [];
    var allPhotos = [];

    var titles = [""];
    var checkedboxes = [];
    var gallery = $('#gallery');
    var slideshow = $('#slideshow');

    var counter = 0;


    // returns a random [hoto from a given list
    function randomElement(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    // return question data user is working on now
    function currentPhoto() {
        return photos[counter];
    }


    // create div that contains question and the possible answers
    function createPhoto(photoData) {
        if (photoData !== null ){
        return $('<div>').append($('<img>').attr('src','images/'+photoData.filename))
            .attr('id', 'question').click(function(){ onlyShow(''+photoData.tags);})


            }
    }

    // displays current question
    function displayPhoto() {
        createPhoto(currentPhoto()).appendTo(slideshow);
        var header = $('<h2> ' + currentPhoto().title + '</h2>');
        console.log(currentPhoto().title);
        slideshow.append(header);
    }
    function displayThumbnails() {
        for (var i = 0; i < photos.length; i++) {
            photos[i].pos = i;

            createThumbnail(photos[i]).appendTo(gallery);
            if (!contains(titles,photos[i].tags)) {
                createCheckBox(photos[i].tags);
                titles.push(photos[i].tags);
            }
        }
    }
    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    function createThumbnail(photoData) {
        if (photoData!==null) {
            return $('<div>').append($('<img>').attr('src', 'images/' + photoData.thumbnail))
                .attr('class', 'image');
        }
    }


    // check if user's response is correct or not
    function checkResponse() {
        var choice = getChoice();
        if (choice < 0) {
            alert('Please make a selection!');
        } else if (choice === currentQuestion().correctAnswer) {
            alert('Correct!');
        } else {
            alert('Sorry, try again!');
        }
        return false;
    }

    // moves to next question by removing the current one
    function nextPhoto() {
        counter += 1;
        slideshow.empty();
        if (counter === photos.length) {
            /*
            slideshow.html('<h2>You completed the gallery!<h2>');
            $('#submit').hide();
            $('#next').hide();
            $('#start').show();
            */
            counter = 0;
            displayPhoto();

        } else {
            displayPhoto();
        }
    }

    //last question
    function lastPhoto() {
        counter -= 1;
        slideshow.empty();
        if (counter === -1) {
            /*
            slideshow.html('<h2>You completed the gallery!<h2>');
            $('#submit').hide();
            $('#next').hide();
            $('#start').show();
            */
            counter= photos.length-1;
            displayPhoto();

        } else {
            displayPhoto();
        }
    }
    // start gallery by displaying standard gallery buttons and loading data
    function startGallery(pos) {
        $('#submit').show();
        $('#next').show();
        $('#start').hide();
        gallery.empty();
        counter = pos;
        displayPhoto();
    }

    function startThumbnailGallery(url) {
        $('#submit').hide();
        $('#next').hide();
        $('#start').hide();
        gallery.empty();
        counter = 0;
        loadPhotos(url);
    }


    // load the questions data structure from a JSON file
    function loadPhotos(url) {
        $.getJSON(url, function (data) {
            photos = data;
            console.log(JSON.stringify(data));

        })
            .error(function () {
                console.log('error: json not loaded');
            })
            .done(function () {
            console.log("JSON loaded!");
            console.log(photos[0].height);
            startGallery(0);
            displayThumbnails();

        });
    }

    function createCheckBox(title) {
        if (title === undefined)
        {
            title = "blank";
        }
        $("#checkBox").append("<p>"+title+"</p>");
    $("#checkBox").append("<input type='checkbox'' class='checkbox' id='"+title+"'>");
}

    $(document).on('change', '.checkbox', function() {  //when the box is checked
        if(this.checked) {
            checkedboxes.push(this.id);
            //$(".ch").hide();
            for(i=0; i<checkedboxes.length; i++){
                $("."+checkedboxes[i]).show();
            }
            cutPhotos();
        }
        else{

           // $(".ch").show();
            removeTags(this.id);
            cutPhotos();

            if(checkedboxes.length !== 0){
                $(".ch").hide();
                for(i=0; i<checkedboxes.length; i++){
                    $("."+checkedboxes[i]).show();
                }
            }
        }
    });
    function removeTags(val) {
        var temp = [];
        for (var i = 0; i < checkedboxes.length; i++)
        {
            if (val===checkedboxes[i])
            {
                continue;
            }
            temp.push(checkedboxes[i]);
        }
        checkedboxes=temp;
    }
    function onlyShow(val) {
        console.log(val);
        var temp = [];

                temp.push(val);

        checkedboxes=temp;

        reload('./data/photos.json');
    }
    function hideExtra() {

    }

    function reload(url) {
        $.getJSON(url, function (data) {
            allPhotos = data;
            console.log(JSON.stringify(data));

        })
            .error(function () {
                console.log('error: json not loaded');
            })
            .done(function () {
                reboot();

            });
    }
    function cutPhotos()
    {

        reload('./data/photos.json');

    }
    function reboot()
    {
        var newPhotos = [];
        for (var x = 0; x < allPhotos.length; x++)
        {
            var photo = allPhotos[x];
            console.log(photo);
            for (var i = 0; i< checkedboxes.length; i++)
            {
                if (photo.tags === checkedboxes[i])
                {
                    newPhotos.push(allPhotos[x]);
                    break;
                }
            }
        }
        photos = newPhotos;
        slideshow.empty();
        gallery.empty();
        displayThumbnails();
        counter=0;
        displayPhoto();
    }

    // add interactivity to HTML elements once
    $('#back').on('click', lastPhoto);
    $('#next').on('click', nextPhoto);
    $('#backToGallery').on('click', function () {
        slideshow.empty();
        startThumbnailGallery('./data/photos.json');
    });

/*
    $(document).ready(function() {
         var thumbs = [];
         thumbs = document.querySelectorAll(".image");


        for(i=0; i<thumbs.length; i++){
        thumbs[i].addEventListener('click', function () {
            startGallery(i);
        });
    }
        console.log(thumbs);
    });
    */
    // display initial question
    startThumbnailGallery('./data/photos.json');
    startGallery(0);

});
