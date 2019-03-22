$(document).ready(function () {
    var url = "https://sleepy-ravine-31922.herokuapp.com/movies";
    

    function getNewMovie(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
               
                var movie = JSON.parse(xhttp.responseText);
                console.log(xhttp.responseText);
    
                $('#title').text(movie.title);
                $('#poster').attr("src",movie.poster);
                $('#link').attr('href', movie.link);
                $('#rating').text(`Rating : ${movie.rating}/10`);
                $('#desc').text(movie.synopsis);
                if(movie.review){
                    $('#review').text(`${movie.date} : ${movie.review}`);
                }
                else{
                    $('#review').text('No review');
                }
                
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
        xhttp.send();
    };
    getNewMovie();

    $('#btn').on('click', (data) =>{
        getNewMovie();
    });

});