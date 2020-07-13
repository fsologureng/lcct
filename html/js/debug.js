$(document).ready(function(){
	if(window.matchMedia('(max-device-height: 279px)').matches){
		$('#size').text('max-device-height: 279px');
	}
	else if(window.matchMedia('(max-device-height: 320px)').matches){
		$('#size').text('max-device-height: 320px');
	}
	else if(window.matchMedia('(max-device-height: 350px)').matches){
		$('#size').text('max-device-height: 350px');
	}
	else if(window.matchMedia('(max-device-height: 375px)').matches){
		$('#size').text('max-device-height: 375px');
	}
	else if(window.matchMedia('(max-device-height: 411px)').matches){
		$('#size').text('max-device-height: 411px');
	}
	else if(window.matchMedia('(max-device-height: 720px)').matches){
		$('#size').text('max-device-height: 720px');
	}
	else if(window.matchMedia('(max-device-height: 768px)').matches){
		$('#size').text('max-device-height: 768px');
	}
	else {
		$('#size').text('taller then 768px');
	}
});

