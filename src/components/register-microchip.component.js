import React, {Component} from "react";
import axios from "axios";

export default class RegisterMicrochip extends Component {
    constructor(props) {
        super(props);

        this.onChangeMicrochipNumber = this.onChangeMicrochipNumber.bind(this);
        this.onChangeOwnerEmail = this.onChangeOwnerEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            microchip_Number: '',
            owner_Email: ''
        };
    }

    onChangeMicrochipNumber (e) {
        this.setState({
            microchip_Number: e.target.value
        });
    }

    onChangeOwnerEmail (e) {
        this.setState({
            owner_Email: e.target.value
        });
    }

    onSubmit (e) {
        e.preventDefault();
        const newMicrochip = {
            microchip_Number: this.state.microchip_Number,
            owner_Email: this.state.owner_Email
        };

        axios.post('http://localhost:4000/microchips/add', newMicrochip)
        .then(res => {
            console.log(res.data);
        });

        this.setState({
            microchip_Number: '',
            owner_Email: ''
        });
    }

    render() {
        return (
            <div className="register-microchip-container">
                <h3>Register New Microchip</h3>

                <form onSubmit={this.onSubmit}>

                    <div className="form-group"> 
                        <label htmlFor="microchipNumber">Microchip Number:</label>
                        <input  type="text"
                                className="form-control"
                                id="microchipNumber"
                                aria-describedby="microchipHelp"
                                placeholder="Microchip Number"
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
                                onChange={this.onChangeOwnerEmail}
                                />
                        <small id="emailHelp">Input 9, 10, 15 digits of Microchip Number</small>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Register Microchip" className="btn btn-primary" />
                    </div>

                </form>
            </div>
        );
    }
}