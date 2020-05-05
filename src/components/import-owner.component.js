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

export default class ImportOwner extends Component {
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
                            email: err.response.data.owner.email,
                            ownerName: err.response.data.owner.name,
                            ownerPhone1: err.response.data.owner.phone1,
                            ownerAddress1: err.response.data.owner.address,
                            ownerAddress2: '',
                            ownerCity: err.response.data.owner.city,
                            ownerState: err.response.data.owner.state,
                            ownerZip: err.response.data.zipcode,
                            ownerCountry: err.response.data.owner.country,
                            ownerPhone2: '',
                            ownerPhone3: '',
                            ownerPhone4: '',
                            ownerPhone5: '',
                            ownerPhone6: '',
                            ownerPhone7: '',
                            ownerSecContact: '',
                            ownerNote: '',
                        }

                        axios.post('http://localhost:4000/ownerimport/register', data)
                            .then(res => {
                                console.log(res);
                                index++;
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