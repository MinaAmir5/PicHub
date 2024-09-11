import React from 'react';

function App() {
    return (
        <div className="App">
            <header>
                <div class="background">
                    <div class="content">
                        <h1><span id="Pic">Pic</span><span id="Hub">Hub</span></h1><br />
                        <input type="text" placeholder="Search pictures in PicHub" class="textbox"/>
                    </div>
                    <div class=" button">
                        <h5 id="sign">Sign in</h5>
                    </div>
                </div>
            </header>
            <main>
                <div class="pics">
                    <div class="picsCol1">
                        <img src="/imgs/pic1.jpg" id="pic1"/>
                        <div class="bar">
                            <p id="num">15</p>
                            <img src="/imgs/Heart_Empty.jpg" id="heart_empty" class="shit"/>
                            <p id="view">Shit</p>
                            <p id="comment">Comment</p>
                            <p id="report">Report</p>
                        </div>
                        <img src="/imgs/pic2.jpg" id="pic2"/>
                        <img src="/imgs/pic7.jpg" id="pic7"/>
                        <img src="/imgs/pic10.jpg" id="pic10"/>
                    </div>
                    <div class="picsCol2">
                        <img src="/imgs/pic3.jpg" id="pic3"/>
                        <img src="/imgs/pic4.jpg" id="pic4"/>
                        <img src="/imgs/pic8.jpg" id="pic8"/>
                    </div>
                    <div class="picsCol3">
                        <img src="/imgs/pic5.jpg" id="pic5"/>
                        <img src="/imgs/pic6.jpg" id="pic6"/>
                        <img src="/imgs/pic9.jpg" id="pic9"/>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
