var color = "#E36D6D";
var default_color = "#E36D6D";

function checkHex(value) {
    return /^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(value)
}

function menubar() {

    // used to trigger the file input dialog in nw.js
    function chooseFile(chooser) {
        chooser.trigger('click');
    }


    /** menu item creation and handling **/
    fileItem = new gui.MenuItem({
        type: "normal",
        label: "File"
    });

    viewItem = new gui.MenuItem({
        type: "normal",
        label: "View"
    });

    /** submenu creation and handling **/
    var fileSubmenu = new gui.Menu();

    fileSubmenu.append(new gui.MenuItem({
        label: 'New File',
        click: function() {
            openAction().trigger("click");
        }
    }));

    fileSubmenu.append(new gui.MenuItem({
        label: 'Open',
        click: function() {
            openDialog = $('#openDialog')
            chooseFile(openDialog);

            openDialog.change(function(e) {
                var files = $('#openDialog')[0].files;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var text = fs.readFileSync(file.path).toString();
                    openAction(text, file.path, true);
                }
                $(this).val(''); // reset filedialog
            })
        }
    }));

    fileSubmenu.append(new gui.MenuItem({
        label: 'Save',
        click: saveAction,
        key: "s",
        modifiers: "ctrl"
    }));

    save = new gui.MenuItem({
        label: 'Save As',
        click: function() {
            path = $(".file-tab.selected").find("label")[0].innerText;

            saveDialog = $("#saveDialog");
            saveDialog.attr("nwworkingdir", path)

            chooseFile(saveDialog);

            saveDialog.change(function(e) {
                var files = $('#saveDialog')[0].files;

                if (files.length == 0) // cancel clicked
                    return;

                new_path = files[0].path;
                new_name = files[0].name;

                saveAction(new_path);

                $(this).val(''); // reset filedialog
            });
        }
    });

    fileSubmenu.append(save);

    fileSubmenu.append(new gui.MenuItem({
        label: 'New Window',
        click: function() {
            var win = gui.Window.get();

            new_win = gui.Window.open('index.html', {});
        }
    }));

    fileSubmenu.append(new gui.MenuItem({
        label: 'Close Window',
        click: function() {
            var win = gui.Window.get();
            win.close()
        }
    }));

    fileSubmenu.append(new gui.MenuItem({
        label: 'Close File',
        click: function() {
            $('.file-tab.selected').remove();

            if ($(".file-tab")[0]) {
                $(".file-tab:first").trigger("click");
                return;
            } else {
                openAction().trigger("click");
                return 0;
            }
        },
        key: "w",
        modifiers: "ctrl"
    }));

    fileItem.submenu = fileSubmenu;

    var viewSubmenu = new gui.Menu();

    viewSubmenu.append(new gui.MenuItem({
        label: 'Change Color Theme',
        click: function() {
            jPrompt("(HEX only)\ndefault: " + default_color, "", 'Change UI Color', function(r) {
                if (r) {
                    if (checkHex(r)) {
                        color = r;
                        $('.file-tab.selected').trigger('click');
                        $("#file-nav").css("background-color", r)
                        $('.file-tab').hover(function() {
                            $(this).css('color', r);
                            return;
                        });
                    } else {
                        jAlert("Color hex was invalid (e.g. #000 and #000000)", "Invalid HEX")
                    }
                }
            });
        }
    }));


    viewItem.submenu = viewSubmenu;

    /*
    context menu creation
    for the 'file tabs'
    */
    var file_tab_menu = new gui.Menu();

    remove_file = new gui.MenuItem({
        label: 'Remove File',
        click: function(event) {
            $('.file-tab.selected').remove();
            if ($(".file-tab")[0]) {
                return;
            } else {
                openAction().trigger("click");
                return 0;
            }
        }
    });

    file_tab_menu.append(remove_file);

    rename_file = new gui.MenuItem({
        label: 'Rename File',
        click: function() {
            name = $('.file-tab.selected').find('span')[0].innerText.replace("*", '');
            msg = "Rename " + name + "?";
            jPrompt('New name: ', "", msg, function(r) {
                if (r) {
                    $('.file-tab.selected').find('span')[0].innerText = r + "*";
                    a_path = $(".file-tab.selected").find("label")[0].innerText.split("\\")
                    a_path.pop()
                    a_path.push("//" + r)
                    $(".file-tab.selected").find("label")[0].innerText = a_path.join("\\")
                }
            });
        }
    });

    file_tab_menu.append(rename_file);

    $(document).on('contextmenu', '.file-tab', function(ev) {
        $(this).trigger('click')
        file_tab_menu.popup(ev.clientX, ev.clientY);
        return false;
    });

    helpItem = new gui.MenuItem({
        type: 'normal',
        label: 'Help'
    });

    var helpSubmenu = new gui.Menu();
    helpSubmenu.append(new gui.MenuItem({
        label: 'About',
        click: function() {
            var new_win = gui.Window.get(
                window.open('http://jawerty.github.com/Hyro')
            );
        }
    }));

    helpSubmenu.append(new gui.MenuItem({
        label: 'Developer\'s Website',
        click: function() {
            var new_win = gui.Window.get(
                window.open('http://jawerty.github.com/')
            );
        }
    }));

    helpSubmenu.append(new gui.MenuItem({
        label: 'Github',
        click: function() {
            var new_win = gui.Window.get(
                window.open('https://github.com/jawerty/Hyro')
            );
        }
    }));

    helpItem.submenu = helpSubmenu

    // menu item insertion

    var menubar = new gui.Menu({
        type: 'menubar'
    });

    menubar.append(fileItem);
    menubar.append(viewItem);
    menubar.append(helpItem);

    return menubar;
};
