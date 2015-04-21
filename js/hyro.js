/*
Hyro Editor
Last change Oct 2013
Developer: Jared Wright @jawerty
*/

//require's and global variables
var gui = require('nw.gui');

var fs = require('fs');
var util = require('util');

BASE_DIR = process.env.HOME


function getMode(file) {
	type = file.split('.').pop();

	if (type == "html" || type == "xhtml" || type == "htm") {
		mode = "text/html";
	} else if (type == "css") {
		mode = "text/css";
	} else if (type == "js"){
		mode = "javascript";
	} else {
		mode = "text/plain";
	}

	return mode;
}

//saveAction will be used for hotkeys (future) as well as the 'Save' and 'Save As' menu items
function saveAction(filename) {
	var selected = $(".file-tab.selected");
	var path = filename;

	if (typeof path === "undefined") {
		path = selected.find("label")[0].innerText;
	}

	var text = selected.data("cm-doc").getValue();

	console.log("## saving " + path);

	fs.openSync(path, 'w');
	fs.writeFile(path, text, function(err) {
		if (err) throw err;

		selected.attr("alt", "open");

		// remove change star
		var e = selected.find("span").text();
		if (e[e.length - 1] == "*") {
			selected.find("span").text(e.substring(0, e.length - 1))
		}
	});
}


// append a new file tab with the file name and new doc
// return file tab element
function openAction(text, path, opened) {
	console.log("## opening " + path);

	// defaults when opening an empty tab
	if (typeof text === "undefined") {
		text = "<!DOCTYPE html>\n<html>\n<head>\n\n</head>\n<body>\n\n</body>\n</html>";
		path = BASE_DIR + "/untitled.html";
	}

	var file = path.split('/').pop();
	amount = 0;
	for (i=0; i<$(".file-tab").length; i++) {
		if ($(".file-tab")[i].id.slice(0, $(".file-tab")[i].id.length-1) == file) {
			amount++;
		}
	}

	file_tab = document.createElement('div');
	$(file_tab).addClass("file-tab");
	$(file_tab).attr("id", file + amount);

	if (opened === true)
		$(file_tab).attr("alt", "open");

	span = document.createElement('span')
	$(span).text(file)

	file_path = document.createElement('label');
	$(file_path).css("display", "none");
	$(file_path).text(path);


	$(file_tab).append($(span));
	$(file_tab).append($(file_path));
	$("#file-nav").append($(file_tab));

	// create new doc and store it
	return $(file_tab).data("cm-doc", new CodeMirror.Doc(text, getMode(file)));
}

function updatePreview(cm) {
	var doc = cm.getDoc().getValue();

    // create tmp document offline so that we can add <base> before rendering it
	var page = document.implementation.createHTMLDocument();
	page.open();
	page.write(doc);
	page.close();

	var path = $(".file-tab.selected").find("label")[0].innerText;

	var base = $("<base/>", {
		href: require('path').dirname(path) + "/"
	});

	$(page).find("head").prepend(base);

	// get preview iframe document
	var preview = $("#code-view").contents()[0];

	preview.open();
	preview.write((new XMLSerializer()).serializeToString(page));
	preview.close();
}


$(document).ready(function() {

	// create menubar
	gui.Window.get().menu = menubar();


	// create CodeMirror
	var cm = CodeMirror(document.getElementById("code-box"), {
        lineNumbers: true,
        tabMode: "indent",
        matchBrackets: true,
        searchMode: 'inline',

		theme: 'monokai',

		styleActiveLine: true,
		highlightSelectionMatches: true
    });
	emmetCodeMirror(cm);


	$(document).on('click', ".file-tab", function(e) {

		// previous tab, store previous doc there
		var prev = $(".file-tab.selected")
			.removeClass("selected")
			.data("cm-doc", cm.getDoc());

		// clicked tab, read doc from it
		$(this).addClass("selected");

		if ($(this).is(prev)) {
			return;
		}

		file = $(this).attr("id").slice(0, $(this).attr("id").length - 1);

		$("#view-file-name").text(file);

		var doc = $(this).data("cm-doc");
		cm.swapDoc(doc);
	});


	// live updating for html code.

    cm.on("change", function() {
		updatePreview(cm);

		e = $(".file-tab.selected").find("span").text();

		// add "*" if contents are modified
		if (e[e.length - 1] != "*") {
			$(".file-tab.selected").find("span").text($(".file-tab.selected").find("span").text() + "*");
		}

		var file = $(".file-tab.selected").find("span").text()
		$("#view-file-name").text(file.replace("*", ""));
	});

	cm.on("swapDoc", function(instance) {
		updatePreview(instance);
	});

	// splitter
	$("#box-wrapper").split({orientation: 'vertical', limit:200});


	// initial tab
	openAction().trigger("click");
});
