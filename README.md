[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# Chesston
This application extends the [chess.js](https://github.com/jhlywa/chess.js) library with a user interface. Start a game and join by entering the returned UUID in a second client. :joystick:

The game persists a page refresh by saving the your player ID to the url. Each player ID is unique and connects to one game only.  If you wish to play more than one game at once, simply start games in multiple windows. Save your link to reconnect later.

The chess pieces are from [wikipedia](https://en.wikipedia.org/wiki/Chess_piece). Replace the png files with custom ones if you wish to customize the board.

#### Next steps:
* Support promotion (modal dialog missing).
* Game clock.
* Input validation.
* Player name display.

#### Long-term roadmap
* Statistic analysis of the game. This may build upon the already existing property _history_ of the game object. As of now, this property holds all moves performed in their correct order. The information attached to each move could however be extended and it maybe questionable if this property has to be send with each move to the clients. It could be made available in a separate route upon request only.
* Gameplay on a single client.
* Single player mode.
* Board animations. This may required a replacement of the currently chosen approach of rendering the pieces as background images to the board squares.
* Refined page styling. Though I am fine with a clean default styling, the application has potential for a more customized look.

Feel free to contribute to this project if you want!

## Licence
```
MIT License

Copyright (c) 2021 Andreas Seutemann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```