import React, { Component } from 'react';
import './Unit.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UnitModal from './UnitModal.js';

class Unit extends Component {

    constructor(props) {
        super(props);

        this.state = { isOpen: false };
    }



    render() {

        return (
            <div  >
                <img className=" img-responsive Image"  src={this.props.url}  />
                <p>
                    {this.props.id}
                </p>

            </div>
        );
    }
}

export default Unit;
