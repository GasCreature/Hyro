/*
Hyro Editor
Last change Oct 2013
Developer: Jared Wright @jawerty
*/

//require's and global variables
var gui = require('nw.gui');
var fs = require('fs');
var util = require('util');

var menubar = require('./js/menu.js').menubar;

baseDIR = process.env.HOME
// console.log(baseDIR);


//saveAction will be used for hotkeys (future) as well as the 'Save' menu item
function saveAction() {
	e = $(".file-tab.selected").find("span").text();

	if (e[e.length - 1] == "*") {
		$(".file-tab.selected").find("span").text(e.substring(0, e.length - 1))
	}

	selected = $(".file-tab.selected")

	if (selected.attr("alt") == "open") {
		path = $(".file-tab.selected").find("label")[0].innerText;
	} else {
		path = baseDIR + $(".file-tab.selected").find("label")[0].innerText;
		console.log(path);
		$(file_tab).attr("alt", "open");
	}

	text = $(".file-tab.selected").find("code")[0].innerText;
	file = $(".file-tab.selected").find("span")[0].innerText;

	fs.openSync(path, 'w');
	fs.writeFile(path, text, function(err){
		if (err) throw err;
		console.log("saved "+ file + " " + path);

		$(".file-tab.selected").find("span").text(file);
		$(".file-tab.selected").find("code").text(text)
	});
}


// append a new file tab with the file name and new doc
// return file tab element
function openAction(text, path, opened) {
	// defaults when opening an empty tab
	if (typeof text === "undefined") {
		text = "<!DOCTYPE html>\n<html>\n<head>\n\n</head>\n<body>\n\n</body>\n</html>";
		path = "/untitled.html";
	}

	var file = path.split('/').pop();
	amount = 0;
	for (i=0; i<$(".file-tab").length; i++) {
		if ($(".file-tab")[i].id.slice(0, $(".file-tab")[i].id.length-1) == file) {
			amount++;
		}
	}

	file_tab = document.createElement('div');
	$(file_tab).attr("class", "file-tab");
	$(file_tab).attr("id", file+amount);

	if (opened == true)
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
	return $(file_tab).data("cm-doc", new CodeMirror.Doc(text));
}

function updatePreview(cm) {
	var doc = cm.getDoc();

	// get iframe document
	var preview = $("#code-view").contents()[0];
	preview.open();
	preview.write(doc.getValue());
	preview.close();
}


$(document).ready(function() {

	// create menubar
	gui.Window.get().menu = menubar(gui, window, openAction, saveAction);


	// create CodeMirror
	var cm = CodeMirror(document.getElementById("code-box"), {
        lineNumbers: true,
        tabMode: "indent",
        matchBrackets: true,
        searchMode: 'inline',
        viewportMargin: Infinity,

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
			console.log("already shown");
			return;
		}

		cm.swapDoc($(this).data("cm-doc"));

		file = $(this).attr("id").slice(0, $(this).attr("id").length - 1);
		type = file.split('.').pop()

		$("#view-file-name").text(file);

		if (type == "html" || type == "xhtml" || type == "htm") {
			mode = "text/html"
		} else if (type == "css") {
			mode = "text/css"
		} else if (type == "js"){
			mode = "javascript"
		} else {
			mode = "text/plain"
		}

		cm.setOption("mode", mode);

		// trigger update
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

	// initial tab
	openAction().trigger("click");
});
