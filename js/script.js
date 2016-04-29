$(function(){
  
  $('#search-term').submit(function(event){
    event.preventDefault();
    var searchTerm = $('#query').val();
    getFbRequest(location);
  });
});

function getFbRequest(location){
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: "https://graph.facebook.com/search",
    data: {
      q: 'restaurant',
      type: 'place',
      center: '37.76,-122.427', //location
      distance: '1000',
      access_token: '233927430308786|_YCpJw95ivh62Whtfq5rSS7m_Ms'
    }
  }).done(function(data){
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
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: "https://api.instagram.com/v1/locations/search",
      data: {
        facebook_places_id: value,
        access_token: '350763428.1677ed0.93ad0f614ce74560b6538cca9ce32736'
      }
    }).done(function(data){
      if (parseInt(data.data[0].id) !== 0) {
        getRecentInsta(data.data[0].id);
      }
    });
  });
}

function getRecentInsta(instaId) {
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: "https://api.instagram.com/v1/locations/" + instaId + "/media/recent",
    data: {
      access_token: '350763428.1677ed0.93ad0f614ce74560b6538cca9ce32736'
    }
  }).done(function(data){
    showResults(data);
  });
}

function showResults(recentPosts) {
  var image, location;
  $.each(recentPosts.data, function(index, value){
    var tags = value.tags;
    for (var i = 1; i <= tags.length; i++) {
      if (tags[i-1].indexOf('food') !== -1) {
        image = value.images.standard_resolution.url;
        location = value.location.name;
        $('#search-results').append('<img src="' + image + '"><p>' + location + '</p>');
        return false;
      }
    }
  });
}


