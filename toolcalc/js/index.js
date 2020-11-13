var current_hsk_image;
var current_hsk_object;
var example_sketch_image;

var canvas;

function setup() {
	createCanvas(window.innerWidth, 700).parent("p5canvas");
	canvas = document.getElementById("defaultCanvas0");
	example_sketch_image = loadImage("HSKs/example_sketch.png");
	create_inputs();
	load_hsk_list();
	load_d1_list();
	hsk_select_changed("A32");
}

function draw(is_screenshot) {
	if(is_screenshot == undefined) {
		background(69, 69, 69);
		image(example_sketch_image, window.innerWidth - example_sketch_image.width / 2, 700 - example_sketch_image.height / 2,  example_sketch_image.width / 2, example_sketch_image.height / 2);	
	} else {
		background(255);
	}
	var scale_factor = current_hsk_object.offset / 15;
	image(current_hsk_image, 25, height / 2.8, current_hsk_image.width / scale_factor, current_hsk_image.height /  scale_factor);
	draw_sketch(scale_factor);
}

window.onresize = function() {
	var w = window.innerWidth;
	resizeCanvas(w, 700); 
};

function get_screenshot() {
	// only jpeg is supported by jsPDF
	draw(true);
	var imgData = canvas.toDataURL("image/jpeg", 1.0);
	draw();	
	var pdf = new jsPDF();

	pdf.addImage(imgData, 'JPEG', 0, 0);
	pdf.save("download.pdf");
}

function draw_sketch(scale_factor) {
	var AMaß = document.getElementById("input_a");
	var d1 = document.getElementById("d1_list");
	var d2 = document.getElementById("input_d2");

	var middle_y = height / 2.8 + current_hsk_image.height / 2 / scale_factor; 
	var a_maß_x_l = 25 + current_hsk_image.width / scale_factor;
	var a_maß_x_r = a_maß_x_l + parseFloat(AMaß.value) / scale_factor * 10;
	strokeWeight(2);
	var d1_r = a_maß_x_r + config.d1_values[d1.value] /scale_factor * 10;
	strokeWeight(2);

	if(current_hsk_object.a_d2min != {}) {
		if(document.getElementById("input_d2").value >= current_hsk_object.a_d2min.d2_trigger) {
			line(a_maß_x_l, middle_y - current_hsk_object.a_d2min.d2_trigger / scale_factor * 5 + 0.5,
				a_maß_x_l + current_hsk_object.a_d2min.amin / scale_factor * 5 + 0.5,  middle_y - current_hsk_object.a_d2min.d2_trigger / scale_factor * 5 + 0.5
			);

			line(a_maß_x_l, middle_y + current_hsk_object.a_d2min.d2_trigger / scale_factor * 5 + 0.5,
				a_maß_x_l + current_hsk_object.a_d2min.amin / scale_factor * 5 + 0.5,  middle_y + current_hsk_object.a_d2min.d2_trigger / scale_factor * 5 + 0.5
			);

			line(a_maß_x_l + current_hsk_object.a_d2min.amin / scale_factor * 5 + 0.5,  middle_y - current_hsk_object.a_d2min.d2_trigger / scale_factor * 5 + 0.5,
				a_maß_x_l + current_hsk_object.a_d2min.amin / scale_factor * 5 + 0.5, middle_y - parseFloat(d2.value) / scale_factor * 5 + 0.5
			);

			line(a_maß_x_l + current_hsk_object.a_d2min.amin / scale_factor * 5 + 0.5,  middle_y + current_hsk_object.a_d2min.d2_trigger / scale_factor * 5 + 0.5,
				a_maß_x_l + current_hsk_object.a_d2min.amin / scale_factor * 5 + 0.5, middle_y + parseFloat(d2.value) / scale_factor * 5 + 0.5
			);
			a_maß_x_l += current_hsk_object.a_d2min.amin / scale_factor * 5;
			a_maß_x_r -=current_hsk_object.a_d2min.amin / scale_factor * 5;
		}
	}

	a_maß_x_r -= current_hsk_object.bundmaß / scale_factor * 10;

	line(a_maß_x_l, middle_y - parseFloat(d2.value) / scale_factor * 5 + 0.5, //a-maß oben
		a_maß_x_r, middle_y - parseFloat(d2.value) / scale_factor * 5 + 0.5
	);

	line(a_maß_x_l, middle_y + parseFloat(d2.value) / scale_factor * 5 + 0.5, //a-maß unten
		a_maß_x_r, middle_y + parseFloat(d2.value) / scale_factor * 5 + 0.5
	);

	line(a_maß_x_r, middle_y - parseFloat(d1.value) / scale_factor * 5 + 0.5, //d1 oben
		d1_r, middle_y - parseFloat(d1.value) / scale_factor * 5 + 0.5
	);

	line(a_maß_x_r, middle_y + parseFloat(d1.value) / scale_factor * 5 + 0.5, //d1 unten
		d1_r, middle_y + parseFloat(d1.value) / scale_factor * 5 + 0.5
	);

	line(a_maß_x_r, middle_y - parseFloat(d1.value) / scale_factor * 5 + 0.5, //a-maß-d oben
		a_maß_x_r, middle_y - parseFloat(d2.value) / scale_factor * 5 + 0.5,
	)	

	line(a_maß_x_r, middle_y + parseFloat(d1.value) / scale_factor * 5 + 0.5, //a-maß-d unten
		a_maß_x_r, middle_y + parseFloat(d2.value) / scale_factor * 5 + 0.5,
	)

	line(d1_r, middle_y - parseFloat(d1.value) / scale_factor * 5 + 0.5, //ende
		d1_r, middle_y + parseFloat(d1.value) / scale_factor * 5 + 0.5
	)
}

function hsk_select_changed(name) {
	if(name == undefined) {
		var hsk_select = document.getElementById("hsk_list");
		name = hsk_select.value;
	}
	current_hsk_object = config.HSKs[name.substring(0, 1)][name.substring(1)];
	var path = window.location.pathname + config.HSKs[name.substring(0, 1)][name.substring(1)].picture;
	current_hsk_image = loadImage(path);
	document.getElementById("input_a").setAttribute("min", parseFloat(current_hsk_object.amin));
	document.getElementById("input_a").setAttribute("max", parseFloat(current_hsk_object.amax));
	document.getElementById("input_a").setAttribute("last_acceptable_value", parseFloat(current_hsk_object.amin));
	document.getElementById("input_a").value = parseFloat(current_hsk_object.amin);
	document.getElementById("input_d2").setAttribute("min", parseFloat(current_hsk_object.d2min));
	document.getElementById("input_d2").setAttribute("max", parseFloat(current_hsk_object.d2max));
	document.getElementById("input_d2").setAttribute("last_acceptable_value", parseFloat(current_hsk_object.d2min));
	document.getElementById("input_d2").value = parseFloat(current_hsk_object.d2min);
}

function load_hsk_list() {
	var HSK_list = document.getElementById("hsk_list");
	for(var model in config.HSKs) {
		if(!config.HSKs.hasOwnProperty(model)) continue;
		for (var size in config.HSKs[model]) {
			if(!config.HSKs.hasOwnProperty(model) || config.HSKs[model][size].picture == undefined) continue;
			var option = document.createElement("option");
			option.textContent = model + size;
			HSK_list.appendChild(option);
		}
	}
}

function load_d1_list() {
	var d1_list = document.getElementById("d1_list");
	for(var d1 in config.d1_values) {
		if(!config.d1_values.hasOwnProperty(d1)) continue;
		var option = document.createElement("option");
		option.textContent = d1;
		d1_list.appendChild(option);
	}
}

function create_inputs() {
	var a = createInput("");
	a.input(number_input);
	a.attribute("id", "input_a");
	a.attribute("onchange", "check_minmax('input_a')");
	a.parent("input_div_a");

	var d2 = createInput("");
	d2.input(number_input);
	d2.attribute("id", "input_d2");
	d2.attribute("onchange", "check_minmax('input_d2')");
	d2.parent("input_div_d2");
}

function number_input() {
	var re = new RegExp("^[0-9.]*$");
	if(re.test(this.value())) {
		this.attribute("last_acceptable_value", this.value());
	} else {
		this.value(this.attribute("last_acceptable_value"));
	}
}

function check_minmax(id) {
	var input = document.getElementById(id);
	var min_value, max_value;

	min_value = input.getAttribute("min");
	max_value = input.getAttribute("max");
	if(/*input.getAttribute("id") == "input_a" && */current_hsk_object.a_d2min != {}) {
		if(document.getElementById("input_d2").value >= current_hsk_object.a_d2min.d2_trigger) {
			min_value = current_hsk_object.a_d2min.amin + current_hsk_object.bundmaß;
			if(document.getElementById("input_a").value < current_hsk_object.a_d2min.amin + current_hsk_object.bundmaß) document.getElementById("input_a").value = current_hsk_object.a_d2min.amin + current_hsk_object.bundmaß;
		}
	}
	if(min_value > parseFloat(input.value) || input.value == "") input.value = min_value;	
	if(max_value < parseFloat(input.value) || input.value == "") input.value = max_value;
}

function bottom_tab_click(ev, tab_name) {
	var tabs = document.getElementsByClassName("active_tab")
	for (var i = 0; i < tabs.length; i ++) {
		tabs[i].className = tabs[i].className.replace(" active_tab", "");	
	}
	ev.currentTarget.className += " active_tab";

	if(tab_name == "sketch") {
		document.getElementById("input_div").className = document.getElementById("input_div").className.replace("hidden_div", "");
		document.getElementById("prices_div").classList.add("hidden_div");
		document.getElementById("bottom_tabs").style.top = "80%"
	} else if (tab_name == "prices") {
		document.getElementById("input_div").classList.add("hidden_div");
		document.getElementById("prices_div").className = document.getElementById("prices_div").className.replace("hidden_div", "");
		document.getElementById("bottom_tabs").style.top = "70%"
	}
}
