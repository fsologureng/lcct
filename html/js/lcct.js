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
	animationTime: 0.1,
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
	var tip = $('#'+$(point).attr('aria-controls'));
	var bounds = viewer.viewport.getBounds(); 
	var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
	console.log('[showTip] viewerTopLeft=',viewerTopLeft);
	var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
	console.log('[showTip] viewerBottomRight=',viewerBottomRight);
	var asterisk = $(point).children('div.asterisk').get(0);
	console.log('[showTip] point=',point);
	var leftPos = asterisk.getBoundingClientRect().left + $(window)['scrollLeft']();
	console.log('[showTip] leftPos=',leftPos);
	var rightPos = asterisk.getBoundingClientRect().right + $(window)['scrollLeft']();
	console.log('[showTip] rightPos=',rightPos);
	var tipWidth = tip.outerWidth(); //Find width of tooltip
	console.log('[needPanTip] tipWidth=',tipWidth);
	var tipHeight = tip.outerHeight(); //Find height of tooltip
	var tipVisX;
	var tipVisY = (viewerBottomRight.y - tipHeight)/2;
	if ( leftPos - viewerTopLeft.x < viewerBottomRight.x - rightPos ) {
		tipVisX = rightPos + (viewerBottomRight.x - rightPos - tipWidth)/2;
	}
	else {
		tipVisX = viewerTopLeft.x + (leftPos - tipWidth - viewerTopLeft.x)/2;
	}
	tip.css({
		left: tipVisX,
		top: tipVisY,
		position: 'absolute'
	});
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
viewer.addHandler('animation-start', function(event) {
	console.log('[animation-start handler]');
	//Hide tooltip
	$('.lcct-note:visible').hide();
	$('.mask:visible').hide();
	$('.laser:visible').hide();
})
viewer.addHandler('animation-finish', function(event) {
	console.log('[animation-finish handler]');
	var point = $('div.pending');
	console.log('[animation-finish handler] point=',point);
	if ( point.length > 0 ){
		// mostrar nota asociada
		point.children('.mask').show();
		showLasers(point.get(0));
		showTip(point.get(0));
		point.removeClass('pending');
		var tip = $('#'+$(point).attr('aria-controls'));
	}
	else if ( isMousePanning ) {
		console.log('continue panning');
		panningFunction();
	}
});

// Bind a note
function bindtooltip(note){
	var tip = $(note);
	console.log('[bindtooltip] tip=',tip);
	var id = overlays[tip.prop('id')].id;
	console.log('bindtooltip] id='+id);
	$("#"+id).on('click', function(e) {
		e.stopImmediatePropagation();
		if( tip.filter(':visible').length > 0 ){
			tip.hide(); //Hide tooltip
			$(e.target).children('.laser').hide();
			$(e.target).children('.mask').hide();
		}
		else {
			if(!needPanTip(e)){
				$(e.target).children('.mask').show();
				showLasers(e.target);
				showTip(e.target);
			}
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

// focus on a note
function goToNote(note){ // invariant: always fitted vertically
	// Starting point
	var oldBounds = viewer.viewport.getBounds();
	console.log('oldBounds=',oldBounds);
	// always fit with displacement
	var X = overlays[note].x < oldBounds.width*0.3 ? 0 : overlays[note].x > lcct_width - oldBounds.width*0.3 ? lcct_width - oldBounds.width : overlays[note].x-oldBounds.width*0.3;
	var newBounds = new OpenSeadragon.Rect(X, oldBounds.y, oldBounds.width, oldBounds.height,0); 
	console.log('newBounds=',newBounds);
	viewer.viewport.fitBoundsWithConstraints(newBounds, true);
}

// move point to left or right depending on focus
function panPoint(point){
	var leftPos = point.getBoundingClientRect().left + $(window)['scrollLeft']();
	var rightPos = point.getBoundingClientRect().right + $(window)['scrollLeft']();
	var note_width = $('#'+point.prop('aria-controls')).width();
	if ( ( $('#foto').width() - rightPos ) < note_width || ( $('#foto').width() - leftPos ) < note_width ){ // center
		if ( leftPos > ($('#foto').width() - rightPos ) ) {
			// mover a la izquierda 
			console.log('[panPoint] move to left');
			viewer.viewport.panBy(new OpenSeadragon.Point(-(note_width - ($('#foto').width() - leftPos))/lcct_width,0), false);
		}
		else {
			// mover a la derecha 
			console.log('[panPoint] move to right');
			viewer.viewport.panBy(new OpenSeadragon.Point((note_width - ($('#foto').width() - rightPos))/lcct_width,0), false);
		}
	}
}
// inicio del viewer
viewer.addHandler('open', function(event) {
	// fit vertically
	viewer.viewport.fitVertically();
	// Bind notes
	$('.lcct-note').each(function(idx,note){
		bindtooltip(note);
	});
	// Posicionamiento en nota
	var fragment = document.location.hash;
	console.log('fragment=',fragment);
	if ( fragment.match(/^\#N\d\d/g) && ( fragment >= '#N01' && fragment <= '#N37' ) || fragment == '#Epilogo' ){
		console.log('fragment is a valid point');
		goToNote(fragment.replace(/^\#(.*)$/,'$1'));
	}
	else {
		// Starting point
		var oldBounds = viewer.viewport.getBounds();
		console.log('oldBounds=',oldBounds);
		var newBounds = new OpenSeadragon.Rect(0, oldBounds.y, oldBounds.width, oldBounds.height,0); 
		console.log('newBounds=',newBounds);
		viewer.viewport.fitBoundsWithConstraints(newBounds, true);
	}
});

var isMobile = window.matchMedia("(pointer: coarse)").matches;
$(document).ready(function(){
	if (isMobile){
		// bind menú button
		$('#button > a').on('click',function(e){
			$('#menu').toggle("fast",function(){console.log("menu click")});
			// Hide tooltip
			$('.lcct-note:visible').hide();
			$('.mask:visible').hide();
			$('.laser:visible').hide();
			return false;
		});
	}
	// access and exit from each section
	$('.lightbox').each(function(idx,el){
		var id = el.id;
		console.log('id=',id);
		$('#menu a[href="#'+id+'"]').on('click',function(e){
			console.log('click ',id);
			if (isMobile){
				$('#menu').hide("fast",function(){console.log("esconde menu")});
			}
			// Hide tooltip if visible
			$('.lcct-note:visible').hide();
			$('.mask:visible').hide();
			$('.laser:visible').hide();
			$('#'+id).show("fast",function(){console.log("activa ",id)}).addClass('show');
			$('#mask').show("fast",function(){console.log("activa máscara")});
		});
		$('#'+id+' nav button').on('click',function(e){
			console.log('click cierra ',id);
			$('#mask').hide("fast",function(){console.log("desactiva máscara")});
			$('#'+id).hide("fast",function(){console.log("desactiva ",id)}).removeClass('show');
			document.location.hash='';
		});
	});
	// out with click on mask
	$('#mask').on('click',function(e){
		console.log('click mascara');
		$('.lightbox.show').hide("fast",function(){console.log("desactiva lightbox desde la máscara")}).removeClass('show');
		$('#mask').hide("fast",function(){console.log("desactiva máscara")});
		document.location.hash='';
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
		console.log('click ',e);
		var fragment = e.target.hash;
		console.log('fragment=',fragment);
		// fit vertically
		viewer.viewport.fitVertically();
		goToNote(fragment.replace(/^\#(.*)$/,'$1'));
		$('#mask').hide("fast",function(){console.log("desactiva máscara")});
		$('#notas').hide("fast",function(){console.log("desactiva notas")});
	});
	// Posicionamiento en sección
	var fragment = document.location.hash;
	console.log('fragment=',fragment);
	if ( $(''+fragment+'.lightbox').length > 0 ){
		$('#menu a[href="'+fragment+'"]').trigger('click');
	}
	// click on logo
	$('#logo').on('click',function(){
		// fit vertically
		viewer.viewport.fitVertically();
		// Starting point
		var oldBounds = viewer.viewport.getBounds();
		console.log('oldBounds=',oldBounds);
		viewer.viewport.panBy(new OpenSeadragon.Point(-oldBounds.x,0), false);
		document.location.hash='';
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
	$('#counter > ul > li').html(counter);
	// map
	/*
	$('#mapa button').on('click',function(e){
		console.log('click cierra mapa');
		sessionStorage.setItem('mapa', true);
		$('#mapa').hide();
	});
	let hideMap = sessionStorage.getItem('mapa');
	if ( ! hideMap ){
		$('#mapa').show();
	}
	*/
});
