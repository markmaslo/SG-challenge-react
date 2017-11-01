import React, {Component} from 'react';
import { Transition } from 'react-transition-group';
import Axios from 'axios';

class Gifts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'items': [],
            'loading': false
        };
    }

    onShowEntered = () => {
        this.setState({'loading': true});
        this.getItems().then((items) => {
            this.setState({
                'items': items,
                'loading': false
            });
        });
    }

    getItems() {
        let validate_status = (status)=>{return status < 500;};
        let conf = {
            responseType: 'json',
            validateStatus: validate_status
        };
        let get_category_url = (cat_id)=>{return `https://staging.swiftgift.me/api/v2/categories/${cat_id}/products`};
        return new Promise(function(resolve, reject) {
            Axios.get('https://staging.swiftgift.me/api/v2/categories', conf).then(function(r) {
                let promises = [];
                for (let category of r.data.collection) {
                    let p = Axios.get(get_category_url(category.id || 'null'), conf);
                    promises.push(
                        new Promise(function(resolve, reject) {
                            p.then(function(r) {
                                resolve({items: r.data.collection, category:category});
                            });
                        })
                    );
                }
                Promise.all(promises).then(resolve);
            });
        });
    }

    render() {
        let gifts = [];
        let null_i = 0;
        for (let data of this.state.items) {
            let category = data.category;
            let category_key = category.id;
            if (!category_key) {
                category_key = `null-${null_i}`;
                null_i += 1;
            }
            let items_elems = data.items.map(function(item, i) {
                return (
                    <div className="gifts-column" key={`${category_key}-${item.id}`}>
                        <div className="gifts-item">
                            <div className="gift-image" style={{backgroundImage: 'url(' + item.image_url + ')'}}>
                            </div>
                            <div className="gift-text">
                                <div className="gift-price">
                                    {item.currency}{item.lowest_price}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
            gifts.push((
                <div key={category_key} className="category-card">
                    <div className="category-header" style={{backgroundImage: 'url(' + category.image_url + ')'}}>
                        <div className="category-title">{category.clean_name}</div>
                    </div>
                    <div className="gifts-list">
                        <div className="gifts-row">
                            {(items_elems.length ? items_elems : 'No items found.')}
                        </div>
                    </div>
                </div>
            ));
        }
        return (
            <Transition in={this.props.show_in} timeout={250} onEntered={this.onShowEntered} exit={false}>
                {(state)=>(
                    <div className={`gifts-container show-${state} ${this.state.loading ? 'loading' : ''}`}>
                        {gifts}
                    </div>
                )}
            </Transition>
            );
    }
}

export default Gifts;
