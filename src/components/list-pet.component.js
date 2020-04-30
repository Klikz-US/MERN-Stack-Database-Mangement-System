import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Pet = props => (
    <tr>
        <td>{props.pet.microchip}</td>
        <td>{props.pet.petName}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td>{props.pet.owner}</td>
        <td><Link to={'/pets/edit/' + props.pet._id}>Edit</Link></td>
    </tr>
);

export default class PetList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allPets: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/pets')
        .then(res => {
            this.setState({
                allPets: res.data
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    petList () {
        return this.state.allPets.map(function (pet, index) {
            return (
                <Pet pet={pet} key={index} />
            );
        });
    }

    render() {
        return (
            <div className="pet-list-container container">
                <h3>Registerd Pets</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Microchip Number</th>
                            <th>Owner Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.petList()}
                    </tbody>
                </table>
            </div>
        );
    }
}