import React, { Component } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import CSVReader from 'react-csv-reader'

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header =>
        header
            .toLowerCase()
            .replace(/\W/g, '_')
}

export default class ImportPet extends Component {
    constructor(props) {
        super(props);
        this.onFileLoaded = this.onFileLoaded.bind(this)

        this.state = {
        }
    }

    componentDidMount() {

    }

    onFileLoaded(data, fileInfo) {
        let index = 10961;
        const length = data.length;

        _importMicrochip();
        function _importMicrochip() {
            if (index < length) {
                const microchip = data[index].microchip.split('#')[1];

                axios.get(
                    'https://api.savethislife.com/a/find-microchip?microchip=' + microchip,
                    {
                        headers: {
                            "X-Client-Secret": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                        }
                    })
                    .catch(err => {
                        const data = {
                            microchip: err.response.data.pet.microchip,
                            petName: err.response.data.pet.name,
                            petSpecies: err.response.data.pet.species,
                            petBreed: err.response.data.pet.breed,
                            petColor: err.response.data.pet.color,
                            petGender: err.response.data.pet.gender,
                            petBirth: err.response.data.registrationDate,
                            specialNeeds: '',
                            vetInfo: '',
                            dateRV: '',
                            implantedCompany: err.response.data.pet.implantCompany,
                            email: err.response.data.owner.email,
                            membership: err.response.data.registrationType,
                        }

                        axios.post('http://localhost:4000/petimport/register', data)
                            .then(res => {
                                index++;
                                console.log(res);
                                _importMicrochip();
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
            }
        }
    }

    render() {
        return (
            <Container>
                <CSVReader
                    cssClass="csv-reader-input"
                    label="Select CSV with secret Death Star statistics"
                    onFileLoaded={this.onFileLoaded}
                    onError={this.handleDarkSideForce}
                    parserOptions={papaparseOptions}
                    inputId="ObiWan"
                    inputStyle={{ color: 'red' }}
                />
            </Container>
        );
    }
}