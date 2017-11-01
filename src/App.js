import React, { Component } from 'react';
import roulette from './img/roulette.png';
import roulette_icon from './img/roulette-icon.svg';
import './App.css';
import Spinner from './Spinner';
import Gifts from './Gift';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner_show_in: false,
            gifts_show_in: false
        };
    }

    handleClickSpinWin = () => {
        this.setState({
            spinner_show_in: true
        });
    }

    handleClickShowGifts = () => {
        this.setState({
            gifts_show_in: true
        });
    }

    render() {
        let items = [
            {value: '100', deg: 10},
            {value: '500', deg: 35},
            {value: '50', deg: 60},
            {value: '2000', deg: 85},
            {value: '1000', deg: 110}
        ];
        function get_item_func(initial) {
            if (initial) {
                return items[0];
            } else {
                return items[
                    Math.floor(Math.random() * (items.length - 1))
                ];
            }
        };

        return (
            <div className="App">
                <div className="landing-container">
                    <div className="buttons centered">
                        <button className="spin-and-win" onClick={this.handleClickSpinWin}>
                            <div className="pre">
                                <img src={roulette_icon} alt=""/>
                                <div className="spins">
                                    1
                                </div>
                            </div>
                            <div className="title">
                                Spin & Win
                            </div>
                        </button>
                        <button className="list-gifts" onClick={this.handleClickShowGifts}>
                            <div className="title">
                                Gifts in Categories
                            </div>
                        </button>
                    </div>
                </div>
                <Spinner src={roulette} get_item_func={get_item_func} show_in={this.state.spinner_show_in} />
                <Gifts show_in={this.state.gifts_show_in}/>
            </div >
        );
    }
}

export default App;
