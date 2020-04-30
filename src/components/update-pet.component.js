import React, {Component} from "react";
import axios from "axios";

export default class RegisterPet extends Component {
    constructor(props) {
        super(props);

        this.onChangeMicrochipNumber = this.onChangeMicrochipNumber.bind(this);
        this.onChangeOwnerEmail = this.onChangeOwnerEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);

        this.state = {
            microchip_number: '',
            owner_email: ''
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4000/pets/' + this.props.match.params.id)
        .then(res => {
            this.setState({
                microchip_number: res.data.microchip_number,
                owner_email: res.data.owner_email
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    onChangeMicrochipNumber (e) {
        this.setState({
            microchip_number: e.target.value
        });
    }

    onChangeOwnerEmail (e) {
        this.setState({
            owner_email: e.target.value
        });
    }

    onSubmit (e) {
        e.preventDefault();
        
        const updatePet = {
            microchip_number: this.state.microchip_number,
            owner_email: this.state.owner_email
        };

        axios.patch('http://localhost:4000/pets/update/' + this.props.match.params.id, updatePet)
        .then(res => {
            console.log(res.data);
            this.props.history.push('/pets');
        });
    }

    onClickCancel (e) {
        e.preventDefault();

        this.props.history.push('/pets');
    }

    render() {
        return (
            <div className="update-pet-container container">
                <h3>Update Pet</h3>

                <form onSubmit={this.onSubmit}>

                    <div className="form-group"> 
                        <label htmlFor="microchipNumber">Microchip Number:</label>
                        <input  type="text"
                                className="form-control"
                                id="microchipNumber"
                                aria-describedby="microchipHelp"
                                placeholder="Microchip Number"
                                value={this.state.microchip_number}
                                onChange={this.onChangeMicrochipNumber}
                                />
                        <small id="microchipHelp">Input 9, 10, 15 digits of Microchip Number</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ownerEmail">Owner Email Address:</label>
                        <input 
                                type="email" 
                                className="form-control"
                                id="ownerEmail"
                                aria-describedby="emailHelp"
                                placeholder="Owner Email Address"
                                value={this.state.owner_email}
                                onChange={this.onChangeOwnerEmail}
                                />
                        <small id="emailHelp">Input 9, 10, 15 digits of Microchip Number</small>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Update Pet" className="btn btn-primary" />
                        <input type="button" value="Cancel" className="btn btn-outline-secondary ml-2" onClick={this.onClickCancel} />
                    </div>

                </form>
            </div>
        );
    }
}