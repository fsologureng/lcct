// Viewer OpenSeadragon
var viewer = OpenSeadragon({
	id: "foto",
	prefixUrl: "/js/images/",
	minZoomLevel: 78,
	viewportMargins: {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	tileSources: "/iipsrv/iipsrv.fcgi?DeepZoom=lcct.tif.dzi",
	overlays: Object.values(overlays),
	visibilityRatio: 1.0,
	constrainDuringPan: true,
	showNavigator: true,
	navigatorId: 'navigator',
	navigatorMaintainSizeRatio: true,
	navigatorAutoResize: true,
	navigatorAutoFade: false,
	navigatorDisplayRegionColor: '#14FF64',
	showNavigationControl: true,
	zoomInButton : "zoom-in",
	zoomOutButton : "zoom-out",
	fullPageButton : "full-page",
//	animationTime: 0.1,
	gestureSettingsMouse: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: false
	},
	gestureSettingsTouch: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: false
	},
	gestureSettingsPen: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: false
	},
	gestureSettingsUnknown: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: false
	}
});

function showTip(point){
	// console.log('[showTip] point='+point);
	var tip = $('#'+$(point).attr('aria-controls'));
	tip.show(); //Show tooltip
}
function needPanTip(e){
	var point = e.target
	console.log('[needPanTip] point=',point);
	var bounds = viewer.viewport.getBounds(); 
	// console.log('[needPanTip] bounds=',bounds);
	var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
	console.log('[needPanTip] viewerTopLeft=',viewerTopLeft);
	var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
	console.log('[needPanTip] viewerBottomRight=',viewerBottomRight);
	var asterisk = $(point).children('div.asterisk').get(0);
	console.log('[needPanTip] asterisk=',asterisk);
	var leftPos = asterisk.getBoundingClientRect().left + $(window)['scrollLeft']();
	console.log('[needPanTip] leftPos=',leftPos);
	var rightPos = asterisk.getBoundingClientRect().right + $(window)['scrollLeft']();
	console.log('[needPanTip] rightPos=',rightPos);
	var tip = $('#'+$(point).attr('aria-controls'));
	var tipWidth = tip.outerWidth(); //Find width of tooltip
	console.log('[needPanTip] tipWidth=',tipWidth);
	var marginFactor = 1.05;
	var tipHeight = tip.outerHeight(); //Find height of tooltip
	var tipVisX;
	var tipVisY = (viewerBottomRight.y - tipHeight)/2;
	// debug
	/*
	var debug1 = document.createElement('div');
	point.appendChild(debug1);
	$(debug1).css({
		position: 'fixed',
		left: leftPos,
		top: 0,
		width: rightPos - leftPos,
		height: viewerBottomRight.y-1,
		border: 'red solid 1px',
		'pointer-events': 'none'
	});*/

	// panning to give space
	if ( ( viewerBottomRight.x - rightPos < tipWidth*marginFactor ) && ( leftPos - viewerTopLeft.x < tipWidth*marginFactor ) ){ // center
		if ( leftPos - viewerTopLeft.x < viewerBottomRight.x - rightPos ) {
			// mover punto de vista hacia la derecha 
			console.log('[needPanTip] move asterisk to left');
			var delta = new OpenSeadragon.Point(Math.min(tipWidth*marginFactor - (viewerBottomRight.x - rightPos),Math.ceil(e.pageX+(rightPos-leftPos))),0);
			console.log('[needPanTip] delta=',delta);
			viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(delta), false);
		}
		else {
			// mover punto de vista hacia la izquierda 
			console.log('[needPanTip] move point to right');
			var delta = new OpenSeadragon.Point(tipWidth*marginFactor - (leftPos - viewerTopLeft.x),0);
			console.log('[needPanTip] delta=',delta);
			viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(delta.rotate(180)), false);
		}
		$(point).addClass('pending');
		return true;
	}
	else {
		console.log('[needPanTip] no panning');
		return false;
	}
}

function showLasers(asterisk){
	$(asterisk).children('.mask').show();
	$(asterisk).children('.laser').show();
};

var panningStep = 50;
var isMousePanning = false;
var panningFunction = function(){};
var leftPanning = function(){
	var oldBounds = viewer.viewport.getBounds();
	if ( oldBounds.x > viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(panningStep,0)).x ) {
		viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(-panningStep,0)), false);
	}
	else if ( oldBounds.x > 0 ) {
		viewer.viewport.panBy(new OpenSeadragon.Point(-oldBounds.x,0), false);
	}
}
var rightPanning = function(){
	var oldBounds = viewer.viewport.getBounds();
	if ( oldBounds.x + oldBounds.width < viewer.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(lcct_width - panningStep,0)).x ) {
		viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(panningStep,0)), false);
	}
	else if ( oldBounds.x + oldBounds.width < viewer.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(lcct_width,0)).x ) {
		viewer.viewport.panBy(new OpenSeadragon.Point(viewer.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(lcct_width,0)).x - oldBounds.x - oldBounds.width,0), false);
	}
}
var load = undefined;
var fragment = document.location.hash;
viewer.addHandler('animation-start', function(event) {
	console.log('[animation-start handler]');
	//Hide tooltip
	$('.lcct-note:visible').hide();
	$('.mask:visible').hide();
	$('.laser:visible').hide();
})
var first = false;
viewer.addHandler('animation-finish', function(event) {
	console.log('[animation-finish handler]');
	if ( first ) {
		// Starting point
		var oldBounds = viewer.viewport.getBounds();
		console.log('oldBounds=',oldBounds);
		var newBounds = new OpenSeadragon.Rect(0, oldBounds.y, oldBounds.width, oldBounds.height,0); 
		console.log('newBounds=',newBounds);
		viewer.viewport.fitBoundsWithConstraints(newBounds, true);
		first = false;
	}
	else if ( load ){
		let note = load;
		load = undefined;
		history.pushState({'note': note},'Note '+note,document.location.href);
		goToNote( note );
	}
	else {
		var point = $('div.pending');
		// console.log('[animation-finish handler] point=',point);
		if ( point.length > 0 ){
			// mostrar nota asociada
			point.children('.mask').show();
			showLasers(point.get(0));
			showTip(point.get(0));
			point.removeClass('pending');
		}
		else if ( isMousePanning ) {
			console.log('continue panning');
			panningFunction();
		}
	}
});

// Bind a note
function bindtooltip(note){
	var tip = $(note);
//	console.log('[bindtooltip] tip=',tip);
	var id = overlays[tip.prop('id')].id;
//	console.log('bindtooltip] id='+id);
	var tracker = new OpenSeadragon.MouseTracker({
		element: document.getElementById(id),
		clickHandler: function(e) {
			console.log('e.originalEvent.target='+e.originalEvent.target);
			e.originalEvent.stopImmediatePropagation();
			if( tip.filter(':visible').length > 0 ){
				tip.hide(); //Hide tooltip
				$(e.originalEvent.target).children('.laser').hide();
				$(e.originalEvent.target).children('.mask').hide();
			}
			else {
				$(e.originalEvent.target).children('.mask').show();
				showLasers(e.originalEvent.target);
				showTip(e.originalEvent.target);
			}
//			document.location.hash=tip.attr('id');
			history.pushState({'note':tip.attr('id')},'Note '+tip.attr('id'),'#'+tip.attr('id'));
		}
	});
}

// send email
function sendMail(){
	var subject = encodeURIComponent('Mensaje desde LCCT');
	var body = encodeURIComponent(document.forms.feedback.message.value);
	window.open("mailto:laciudadcomotexto2019@gmail.com?subject="+subject+"&body="+body,"_blank");
	return false;
}

viewer.addHandler('animate', function(event) {
	// The canvas-click event gives us a position in web coordinates.
	var webPoint = event.position;

	// Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
	var viewportPoint = viewer.viewport.pointFromPixel(webPoint);

	// Convert from viewport coordinates to image coordinates.
	var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

	// Show the results.
	console.log('web=',webPoint.toString(),'viewport=', viewportPoint.toString(), 'image=',imagePoint.toString());
});

// dragging
viewer.addHandler('canvas-drag', function(event) {
	$('#foto').css({cursor: 'grabbing'});
});
viewer.addHandler('canvas-drag-end', function(event) {
	$('#foto').css({cursor: 'grab'});
});

// focus on a note
function goToNote(note){ // invariant: always fitted vertically
	// Starting point
	var oldBounds = viewer.viewport.getBounds();
//	console.log('oldBounds=',oldBounds);
	// always fit with displacement
	var X = overlays[note].x <= oldBounds.width*0.5 ? 0 : overlays[note].x >= lcct_width - oldBounds.width*0.5 ? lcct_width - oldBounds.width : overlays[note].x-oldBounds.width*0.5;
	if ( oldBounds.x != X ){
		$('#'+overlays[note].id).addClass('pending');
		var newBounds = new OpenSeadragon.Rect(X, oldBounds.y, oldBounds.width, oldBounds.height,0); 
//		console.log('newBounds=',newBounds);
		viewer.viewport.fitBoundsWithConstraints(newBounds, true);
	}
	else {
		// mostrar nota asociada
		var point = $('#'+overlays[note].id);
		point.children('.mask').show();
		showLasers(point.get(0));
		showTip(point.get(0));
	}
}
// inicio del viewer
viewer.addHandler('open', function(event) {
	// fit vertically
	viewer.viewport.fitVertically(true);
	// Bind notes
	$('.lcct-note').each(function(idx,note){
		bindtooltip(note);
	});
	// Posicionamiento en nota
	// console.log('fragment=',fragment);
	if ( fragment.match(/^\#N\d\d/g) && ( fragment >= '#N01' && fragment <= '#N42' ) || fragment == '#Epilogo' ){
		console.log('fragment is a valid point');
		let note = fragment.replace(/^\#(.*)$/,'$1'); 
		load = note;
	}
	else {
		// Mark starting point
		first = true;
	}
});
// history
window.onpopstate = function(e) {
	console.log("[onpopstate] history state: " + JSON.stringify(e.state));
	// fit vertically
	if ( e.state !== null ){
		// Hide lightbox if visible
		$('.lightbox:visible').hide();
		$('.mask:visible').hide();
		$('.laser:visible').hide();
		$('#mask:visible').hide("fast",function(){console.log("deactivate mask")});
		$('div.notes:visible').hide("fast",function(){console.log("deactivate notes")});
		if ( e.state.hasOwnProperty('note') ){
			console.log("[onpopstate] is a note");
			// fit vertically
			viewer.viewport.fitVertically(true);
			goToNote(e.state.note);
		}
		else if ( e.state.hasOwnProperty('section') ){
			console.log("[onpopstate] is a section");
			$('#'+e.state.section).show("fast",function(){console.log("activa ",e.state.section)}).addClass('show');
			$('#mask').show("fast",function(){console.log("activa máscara")});
		}
		else {
			// fit vertically
			viewer.viewport.fitVertically(true);
			// Starting point
			var oldBounds = viewer.viewport.getBounds();
			// console.log('[onpopstate] oldBounds=',oldBounds);
			viewer.viewport.panBy(new OpenSeadragon.Point(-oldBounds.x,0), false);
		}
	}
};

var isMobile = window.matchMedia("(pointer: coarse)").matches;
$(document).ready(function(){
	if (isMobile){
		// remove hover style of button
		$('#button > div').hide();
		// bind menú button
		$('#button > a').on('click',function(e){
			e.preventDefault();
			$('#menu').toggle("fast",function(){
				console.log("menu click");
			});
			// Hide tooltip
			$('.lcct-note:visible').hide();
			$('.mask:visible').hide();
			$('.laser:visible').hide();
		});
	}
	else {
		// disable button
		$('#button > a').on('click',function(e){
			e.preventDefault();
		});
	}
	// access and exit from each section
	$('.lcct-section').each(function(idx,el){
		var id = el.id;
		// console.log('id=',id);
		$('#menu a[href="#'+id+'"]').on('click',function(e){
			console.log('click ',id);
			if (isMobile){
				$('#menu').hide("fast",function(e){
					console.log("esconde menu");
				});
			}
			// Hide lightbox if visible
			$('.lightbox:visible').hide();
			$('.mask:visible').hide();
			$('.laser:visible').hide();
			$('#'+id).show("fast",function(){console.log("activa ",id)}).addClass('show');
			$('#mask').show("fast",function(){console.log("activa máscara")});
			history.pushState({'section':id}, 'Section '+id, '#'+id);
		});
		$('#'+id+' nav button').on('click',function(e){
			console.log('click cierra ',id);
			$('#mask').hide("fast",function(){console.log("desactiva máscara")});
			$('#'+id).hide("fast",function(){console.log("desactiva ",id)}).removeClass('show');
		});
	});
	// out with click on mask
	$('#mask').on('click',function(e){
		console.log('click mascara');
		$('.lightbox.show').hide("fast",function(){console.log("desactiva lightbox desde la máscara")}).removeClass('show');
		$('#mask').hide("fast",function(){console.log("desactiva máscara")});
	});
	$('.mask').on('click',function(e){
		e.stopImmediatePropagation();
		mask = e.target;
		var tip = $('#'+$(mask).parent().attr('aria-controls'));
		tip.hide(); //Hide tooltip
		$(mask).siblings('div.laser').hide();
		$(mask).hide();
	});
	$('.mask').on('pointerdown',function(e){
		e.stopImmediatePropagation();
	});
	$('.laser').on('pointerdown',function(e){
		e.stopImmediatePropagation();
	});
	// bind notes access
	$('a.lcct-link').on('click',function(e){
		// console.log('click ',e);
		// console.log('target.hash=',e.target.hash);
		// fit vertically
		viewer.viewport.fitVertically(true);
		$('#mask').hide("fast",function(){console.log("deactivate mask")});
		$('div.notes').hide("fast",function(){console.log("deactivate notes")});
		let note = e.target.hash.replace(/^\#(.*)$/,'$1'); 
		console.log('[lcct-link] note=',note);
		console.log('[lcct-link] new history location='+ document.location.hash.replace(/#(notas|notes)$/,'#'+note));
		history.replaceState({'note':note}, 'Note '+note, '#'+note);
		goToNote(note);
	});
	// note close button
	$('div.lcct-note > nav > button').on('click',function(e){
		let btn = e.target;
		let tip = $(btn).parent().parent();
		tip.hide(); //Hide tooltip
		let point = $('#'+tip.attr('aria-owns')); 
		$(point).children('div.laser').hide();
		$(point).children('div.mask').hide();
	});
	// click on logo
	$('#logo').on('click',function(){
		// fit vertically
		viewer.viewport.fitVertically(true);
		// Starting point
		var oldBounds = viewer.viewport.getBounds();
		console.log('oldBounds=',oldBounds);
		viewer.viewport.panBy(new OpenSeadragon.Point(-oldBounds.x,0), false);
		history.pushState({}, 'Init', '/');
	});
	// click on left
	$('#left').on('mousedown',function(){
		console.log('[left]');
		isMousePanning = true;
		panningFunction = leftPanning;
		panningFunction();
	});
	// click on right
	$('#right').on('mousedown',function(){
		console.log('[right]');
		isMousePanning = true;
		panningFunction = rightPanning;
		panningFunction();
	});
	// mousedown on body
	$('body').on('mouseup', function(e){
		console.log("mouse is up");
		isMousePanning = false;
	})
	// email
	var email = "Y2Fyb2xhLnVtYXJpbkBnbWFpbC5jb20=";
	$('#email').attr('href',"mailto:"+atob(email));
	$('#email').text(atob(email));
	var email_project = "bGFjaXVkYWRjb21vdGV4dG8yMDE5QGdtYWlsLmNvbQ==";
	$('#email_project').attr('href',"mailto:"+atob(email_project));
	$('#email_project').text(atob(email_project));
	// counter
	console.log('[counter] hits='+hits);
	let digits = (hits+'').split('');
	console.log('[counter] #digits='+digits.length);
	for ( ; digits.length < 5; ) {
		digits.unshift('0');
	}
	console.log('[counter] #digits='+digits.length);
	let counter = digits.map(d => '<span>'+d+'</span>');
	console.log('[counter] mask='+counter);
	$('#counter > p').html(counter);
	// map
	$('div.map').on('click',function(e){
		console.log('close map');
		$('div.map').hide();
		history.replaceState({}, 'Init', '/');
		if ( document.querySelector("body").requestFullscreen ) {
			document.querySelector("body").requestFullscreen().catch(err => {
				alert(`Error attempting to enable full-screen mode.`);
			});
		}
		else if (document.querySelector("body").webkitRequestFullscreen) {
			document.querySelector("body").webkitRequestFullscreen().catch(err => {
				alert(`Error attempting to enable full-screen mode.`);
			});
		}
	});
	// Posicionamiento en sección
	// console.log('fragment=',fragment);
	if (fragment.length > 0 ) {
		history.replaceState({}, 'Init', '/');
		if ( $(''+fragment+'.lcct-section').length > 0 ){
			$('a[aria-controls="'+fragment.substring(1)+'"]').trigger('click');
		}
		else if ( $(''+fragment+'.lcct-note').length > 0 ){
			$('div[aria-controls="'+fragment.substring(1)+'"]').addClass('pending');
		}
	}
	else {
		$('div.map').show();
	}
	// fullscreen
	$('a.fullscreen').on('click',function(e){
		if ( document.querySelector("body").requestFullscreen ) {
			document.querySelector("body").requestFullscreen().catch(err => {
				alert(`Error attempting to enable full-screen mode.`);
			});
		}
		else if (document.querySelector("body").webkitRequestFullscreen) {
			document.querySelector("body").webkitRequestFullscreen().catch(err => {
				alert(`Error attempting to enable full-screen mode.`);
			});
		}
	});
});

