import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Microchip = props => (
    <tr>
        <td>{props.microchip.microchip_Number}</td>
        <td>{props.microchip.owner_Email}</td>
        <td><Link to={'/edit/' + props.microchip._id}>Edit</Link></td>
    </tr>
);

export default class MicrochipList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            microchips: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/microchips')
        .then(res => {
            this.setState({
                microchips: res.data
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    microchipList () {
        return this.state.microchips.map(function (microchip, index) {
            return (
                <Microchip microchip={microchip} key={index} />
            );
        });
    }

    render() {
        return (
            <div className="microchip-list-container">
                <h3>Microchip List</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Microchip</th>
                            <th>Owner Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.microchipList()}
                    </tbody>
                </table>
            </div>
        );
    }
}