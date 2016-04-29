$(function(){
  
  $('#search-term').submit(function(event){
    event.preventDefault();
    var searchTerm = $('#query').val();
    getFbRequest(location);
  });
});

function getFbRequest(location){
  var params = {
    q: 'restaurant',
    type: 'place',
    center: '37.76,-122.427', //location
    distance: '1000',
    access_token: '233927430308786|_YCpJw95ivh62Whtfq5rSS7m_Ms'
  };
  url = 'https://graph.facebook.com/search';

  $.getJSON(url, params, function(data){
    recordIds(data.data);
  });
}

function recordIds(results){
  var fbIds = [];
  $.each(results, function(index,value){
    fbIds.push(value.id);
  });
  getInstaIds(fbIds);
}

function getInstaIds(fbIds){
  $.each(fbIds, function(index, value){
    var params = {
      facebook_places_id: value,
      access_token: '350763428.1677ed0.93ad0f614ce74560b6538cca9ce32736',
    };
    url = 'https://api.instagram.com/v1/locations/search';

    $.getJSON(url, params, function(data){
      getRecentInsta(data.data[0].id);
    });
  });
}

function getRecentInsta(instaId) {
  var params = {
    access_token: '350763428.1677ed0.93ad0f614ce74560b6538cca9ce32736'
  };
  url = 'https://api.instagram.com/v1/locations/' + instaId + '/media/recent';

  $.getJSON(url, params, function(data){
    var image, location;
    //console.log(data);
    $.each(data.data, function(index, value){
      //console.log(value.tags);
      var tags = value.tags;
      for (var i = 1; i <= tags.length; i++) {
        if (tags[i-1].indexOf('food') !== -1) {
          image = value.images.standard_resolution.url;
          location = value.location.name;
          console.log(tags[i-1]);
          $('#search-results').append('<img src="' + image + '"><p>' + location + '</p>');
          return false;
        }
      }
      });
    });
}


