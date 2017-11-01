import React, {Component} from 'react';
import { Transition } from 'react-transition-group';

import roulette_outer from './img/roulette-outer.png';
import roulette_light_single from './img/roulette-light-single.png';
import roulette_light_double from './img/roulette-light-double.png';
import roulette_light_full from './img/roulette-light-full.png';
import roulette_action_label from './img/roulette-action-label.png';
import roulette_arrow from './img/roulette-arrow.png';

class SpinnerImage extends Component {

    get_styles(transition_state) {
        let transition_styles = {
            transition: `transform ${this.props.duration}ms cubic-bezier(0.5,0,0.05,1)`
        };
        let value = this.props.value;
        let value_animation_end = this.props.value + (360 * this.props.iterations);
        let state_styles = {
            'exited': {'transform': `rotate(${value}deg)`},
            'entering': {'transform': `rotate(${value_animation_end}deg)`},
        };
        return {
            ...(transition_state === 'entering' ? transition_styles : {}),
            ...(state_styles[transition_state] ? state_styles[transition_state] : {})
        };
    }

    onAnimationEntered() {
        this.setState({animation_in: false});
    }

    render() {
            return (
                <Transition in={this.props.animation_in} timeout={this.props.duration} onEntered={this.props.onEntered} exit={false} onExited={this.props.onExited}>
                    {(state)=>(
                        <img className={"spinner-image"} src={this.props.src} style={this.get_styles(state)} alt="" />
                    )}
                </Transition>
            );
    }
}

class Spinner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'item': this.props.item,
            'can_show_result': false,
            'show_result': false,
            'spinner_animation_in': false
        };
    }

    onSpinnerAnimationExited = () => {
        let can_show_result = this.state.item ? true : false;
        console.log(this.state, can_show_result);
        this.setState({
            'can_show_result': can_show_result
        });
        if (can_show_result) {
            setTimeout(()=>{
                this.setState({
                    'show_result': true,
                });
            }, 500);
        }
    }

    onSpinnerAnimationEntered = () => {
        this.setState(function(prevState) {
            return {spinner_animation_in: false};
        });
    }

    toSpin = () => {
        this.setState((prevState)=>{
            let state = prevState;
            if (!prevState.spinner_animation_in) {
                state = {
                    'spinner_animation_in': true,
                    'item': this.props.get_item_func(),
                    'can_show_result': false,
                    'show_result': false
                };
            }
            return state;
        });
    }

    render() {
        let results_str = this.state.item ? this.state.item.value : '';
        let spinning_str = this.state.spinner_animation_in ? 'spinning' : '';
        let has_results_str = this.state.can_show_result ? 'has-results' : '';
        let show_result = this.state.show_result;
            return (
                <Transition in={this.props.show_in} timeout={250} exit={false}>{(state)=>(
                    <div className={`spinner-container show-${state}`}>
                        <div className={`spinner-control centered ${spinning_str} ${has_results_str} show-${state} `}>
                            <div className="spinner-outer">
                                <img className="spinner-frame" src={roulette_outer} alt="" />
                                <img className="spinner-light single" src={roulette_light_single} alt="" />
                                <img className="spinner-light double" src={roulette_light_double} alt="" />
                                <img className="spinner-light full" src={roulette_light_full} alt="" />
                            </div>
                            <img className="spinner-arrow" src={roulette_arrow} alt="" />
                            <button className="spinner-action" disabled={this.state.spinner_animation_in} onClick={this.toSpin}>
                                <img className="spinner-action-label" src={roulette_action_label} alt="" />
                            </button>
                            <div className="spinner-body">
                                <SpinnerImage animation_in={this.state.spinner_animation_in} src={this.props.src} iterations={7} duration={5000} value={this.state.item ? this.state.item.deg : 0} onEntered={this.onSpinnerAnimationEntered} onExited={this.onSpinnerAnimationExited} />
                            </div>

                        </div>
                        <Transition in={show_result} timeout={250} exit={false}>{(state)=>(
                            <div className={`results-container show-${state}`}>
                                <div className="results centered">{results_str}</div>
                            </div>
                        )
                        }
                        </Transition>
                    </div>
                )}
                </Transition>
            );
    }
}

export default Spinner;
