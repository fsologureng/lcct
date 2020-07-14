$(document).ready(function(){
	if(window.matchMedia('(max-device-height: 279px)').matches){
		$('#height').text('max-device-height: 279px');
	}
	else if(window.matchMedia('(max-device-height: 320px)').matches){
		$('#height').text('max-device-height: 320px');
	}
	else if(window.matchMedia('(max-device-height: 350px)').matches){
		$('#height').text('max-device-height: 350px');
	}
	else if(window.matchMedia('(max-device-height: 375px)').matches){
		$('#height').text('max-device-height: 375px');
	}
	else if(window.matchMedia('(max-device-height: 411px)').matches){
		$('#height').text('max-device-height: 411px');
	}
	else if(window.matchMedia('(max-device-height: 568px)').matches){
		$('#height').text('max-device-height: 568px');
	}
	else if(window.matchMedia('(max-device-height: 720px)').matches){
		$('#height').text('max-device-height: 720px');
	}
	else if(window.matchMedia('(max-device-height: 768px)').matches){
		$('#height').text('max-device-height: 768px');
	}
	else {
		$('#height').text('higher than 768px');
	}
	if(window.matchMedia('(max-device-width: 279px)').matches){
		$('#width').text('max-device-width: 279px');
	}
	else if(window.matchMedia('(max-device-width: 320px)').matches){
		$('#width').text('max-device-width: 320px');
	}
	else if(window.matchMedia('(max-device-width: 350px)').matches){
		$('#width').text('max-device-width: 350px');
	}
	else if(window.matchMedia('(max-device-width: 375px)').matches){
		$('#width').text('max-device-width: 375px');
	}
	else if(window.matchMedia('(max-device-width: 411px)').matches){
		$('#width').text('max-device-width: 411px');
	}
	else if(window.matchMedia('(max-device-width: 568px)').matches){
		$('#width').text('max-device-width: 568px');
	}
	else if(window.matchMedia('(max-device-width: 720px)').matches){
		$('#width').text('max-device-width: 720px');
	}
	else if(window.matchMedia('(max-device-width: 768px)').matches){
		$('#width').text('max-device-width: 768px');
	}
	else {
		$('#width').text('wider than 768px');
	}
});

