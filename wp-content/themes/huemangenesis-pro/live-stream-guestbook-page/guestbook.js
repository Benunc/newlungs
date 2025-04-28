var $ = jQuery;

$(document).ready(function($){
	
	var form = $('#guestbook_form');
	
	form.on('submit', function(e) {
		e.preventDefault();
		
		$('#submit_guestbook').attr('disabled', 'disabled');
		
		var data = {
			'title': $('input#name').val(),
			'content': $('textarea#message').val(),
			'post_status': 'publish',
			'post_type' : 'guestbook',
			'private' : $('#private').prop('checked'),
			'location' : $('#location').val()
		}
		
		$.ajax({
			method: 'POST',
			url: guestbook_api.rest_url + 'wp/v2/guestbook',
			data: data
		})
		.done(function(res){
			form.fadeOut('slow');
			form.find('input').val('');
			form.find('textarea').val('');
			
			if( 'false' == res.private ) {
				var tmpl = '<article class="single-guestbook"><blockquote>' + res.new_guestbook_post.post_content + '</blockquote><em>- ' + res.new_guestbook_post.post_title + '</em> <a data-post-id="' + res.new_guestbook_post.id + '" href="#" class="flag" title="flag inappropriate"><i class="fa fa-flag"></i></a></article>';
				$('#guestbook').prepend( tmpl );
			}
			
		});
		
		
	});
	
	$('body').on('click', 'a.flag', function(e){
		e.preventDefault();
		var conf = confirm( 'Are you sure you want to flag this as inappropriate?' );
		if( ! conf ) { return false; }
		var id = $(this).data('post-id'),
			flag = $(this);
		
		data = {
			post_id: id
		};
		
		$.ajax({
			method: 'POST',
			url: guestbook_api.rest_url + 'wp/v2/guestbook/',
			data: data
		})
		.done(function(res){
			if( res.flagged ) {
				flag.parents('.single-guestbook').remove();
			}
			
		});
		
	});
	
	setInterval(function(){
		console.log( 'refresh init' );
		$.ajax({
			method: 'GET',
			url: guestbook_api.rest_url + 'wp/v2/guestbook?per_page=100',
		})
		.done(function(res){
			if( ! res.length ) { return false; }
			
			if( $('#guestbook').children().length < res.length ) {
				$('#guestbook').html('');
				for( var i=0; i < res.length; i++ ) {
						var post = res[i];
						var tmpl = '<article class="single-guestbook"><blockquote>' + post.content.rendered + '</blockquote><em>- ' + post.title.rendered + '</em> <a data-post-id="' + post.id + '" href="#" class="flag" title="flag inappropriate"><i class="fa fa-flag"></i></a></article>';
						$('#guestbook').append( tmpl );
				}
			}
			
		});
		
		
	}, 10000 );
	
});