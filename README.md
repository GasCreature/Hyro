![image not loaded...](https://raw.github.com/michael-brade/Hyro/master/Hyro_title.png)

A live, desktop HTML5 text-editor. You can now code HTML5 websites in real-time on your desktop.

# Improvements to Original Hyro

- Splitter to make the view adjustable
- Monokai theme
- Nice scrollbars
- Improvements in load and save routines
- Keyboard shortcuts for Save and Close
- emmet enabled
- use only one CodeMirror instance with several Documents



# Install

Hyro is compatible with all Platforms: Windows, Mac, Linux (32-bit, 64-bit).

The current version is 0.1.0.

Clone the github repository 'michael-brade/Hyro', then

```
npm install
```

and then start it with `npm start` or `nw`.


To build standalone binaries, change `"developmentMode"` in package.json to `false` and call

```
grunt build
```


# Development

Hyro is built with node-webkit and jQuery.

If you want, hack away as you please.


# Usage

It has a basic splitter UI. You type in your code on the **left** and see what your HTML looks like on the **right**.

![image not loaded...](https://raw.github.com/michael-brade/Hyro/master/screenshots/2.png)

Moreover, you can open multiple files and **execute javascript within the page**

![image not loaded...](https://raw.github.com/michael-brade/Hyro/master/screenshots/4.png)

If you dislike the primary UI color, you can change the color by choosing the 'Change Color' item in the **View** menu-item. **(not stable/persistent yet)**

![image not loaded...](https://raw.github.com/michael-brade/Hyro/master/screenshots/5_edit.png)

Overall, the Hyro app is a lightweight development tool that I made to make frontend testing faster and easier. It is not meant to be a complete supplement for Sublime Text and Vim, but if you use it for these purposes that's alright. Also, If you would like to raise an issue/bug or make a pull request, you are more than welcome to and I will do my best to help solve the problem.

Thank you and happy hacking.


# LICENSE

The MIT License (MIT)

Copyright (c) 2013 Jared Wright

Copyright (c) 2015 Michael Brade

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
