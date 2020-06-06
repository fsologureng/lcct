var lcct_width = 241159;
var lcct_height = 1420;
var laser1_delta_x = 33;
var laser1_delta_y = -144;
var overlays = {
	'N01': {
		id: 'P01',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 175024.762/lcct_width,
		y: 709.8/lcct_width
	},
	'N02': {
		id: 'P02',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 118421.85/lcct_width,
		y: 614.799/lcct_width
	},
	'N03': {
		id: 'P03',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 3255.791/lcct_width,
		y: 1050.8/lcct_width
	},
	'N04': {
		id: 'P04',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 43848.735/lcct_width,
		y: 522.8/lcct_width
	},
	'N05': {
		id: 'P05',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 34353.823/lcct_width,
		y: 1086.8/lcct_width
	},
	'N06': {
		id: 'P06',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 102400/lcct_width,
		y: 725/lcct_width
	},
	'N07': {
		id: 'P07',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 210440.89/lcct_width,
		y: 847.8/lcct_width
	},
	'N08': {
		id: 'P08',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 233711.769/lcct_width,
		y: 811.8/lcct_width
	},
	'N09': {
		id: 'P09',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 41852.903/lcct_width,
		y: 776.8/lcct_width
	},
	'N10': {
		id: 'P10',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 476.783/lcct_width,
		y: 709.8/lcct_width
	},
	'N11': {
		id: 'P11',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 52712.775/lcct_width,
		y: 840.799/lcct_width
	},
	'N12': {
		id: 'P12',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 205817.872/lcct_width,
		y: 983.8/lcct_width
	},
	'N13': {
		id: 'P13',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 162651.858/lcct_width,
		y: 420.8/lcct_width
	},
	'N14': {
		id: 'P14',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 36397.887/lcct_width,
		y: 929.799/lcct_width
	},
	'N15': {
		id: 'P15',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 48535.901/lcct_width,
		y: 1188.8/lcct_width
	},
	'N16': {
		id: 'P16',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 22832.789/lcct_width,
		y: 1048.799/lcct_width
	},
	'N17': {
		id: 'P17',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 91812.849/lcct_width,
		y: 838.8/lcct_width
	},
	'N18': {
		id: 'P18',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 153301.882/lcct_width,
		y: 1169.799/lcct_width
	},
	'N19': {
		id: 'P19',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 217769.712/lcct_width,
		y: 712.799/lcct_width
	},
	'N20': {
		id: 'P20',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 237652.789/lcct_width,
		y: 1037.8/lcct_width
	},
	'N21': {
		id: 'P21',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 131394.758/lcct_width,
		y: 935.8/lcct_width
	},
	'N22': {
		id: 'P22',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 112951.882/lcct_width,
		y: 589.8/lcct_width
	},
	'N23': {
		id: 'P23',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 64885.758/lcct_width,
		y: 385.8/lcct_width
	},
	'N24': {
		id: 'P24',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 73272.786/lcct_width,
		y: 972.799/lcct_width
	},
	'N25': {
		id: 'P25',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 94350/lcct_width,
		y: 1002/lcct_width
	},
	'N26': {
		id: 'P26',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 19540.776/lcct_width,
		y: 768.799/lcct_width
	},
	'N27': {
		id: 'P27',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 202607.805/lcct_width,
		y: 798.8/lcct_width
	},
	'N28': {
		id: 'P28',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 222563.712/lcct_width,
		y: 928.799/lcct_width
	},
	'N29': {
		id: 'P29',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 141244.897/lcct_width,
		y: 934.799/lcct_width
	},
	'N30': {
		id: 'P30',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 187279.739/lcct_width,
		y: 696.8/lcct_width
	},
	'N31': {
		id: 'P31',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 4767.786/lcct_width,
		y: 868.8/lcct_width
	},
	'N32': {
		id: 'P32',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 128861.865/lcct_width,
		y: 898.799/lcct_width
	},
	'N33': {
		id: 'P33',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 61618.777/lcct_width,
		y: 1156.8/lcct_width
	},
	'N34': {
		id: 'P34',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 171222.89/lcct_width,
		y: 846.8/lcct_width
	},
	'N35': {
		id: 'P35',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 54635.777/lcct_width,
		y: 1048.799/lcct_width
	},
	'N36': {
		id: 'P36',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 181747.792/lcct_width,
		y: 756.799/lcct_width
	},
	'N37': {
		id: 'P37',
		className: 'lcct-point',
		placement: 'TOP_LEFT',
		checkResize: false,
		x: 70080.805/lcct_width,
		y: 577.799/lcct_width
	}
};
