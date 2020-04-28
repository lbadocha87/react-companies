import React, { Component } from 'react';
import axios from 'axios';

class CompaniesList extends Component {


    constructor() {
        super();

        this.state = {
            companiesWithData: [],
            filteredCompaniesWithData: []
        }
    }

    getCompanies = () => {
        return axios.get('https://my-json-server.typicode.com/lbadocha87/orders/companies')
            .then(resp => {
                return resp.data;
            });
    }


    getOrders = companiesArray => {

        /* Pobierz dane o zamówieniach i przypisz sumę zamówień do każdej firmy */
        axios.get('https://my-json-server.typicode.com/lbadocha87/orders/orders')
            .then(resp => {
                let ordersArray = resp.data;
                let companiesWithOrders = [];

                for (let i = 0; i < companiesArray.length; i++) {
                    let currentCompany = companiesArray[i];
                    let ordersAmountSum = 0;
                    /* Pętla sumująca */

                    for (let j = 0; j < ordersArray.length; j++) {
                        if (ordersArray[j].companyId === currentCompany.id) {
                            ordersAmountSum += ordersArray[j].amount;
                        }
                    }

                    currentCompany.ordersSum = ordersAmountSum;
                    companiesWithOrders.push(currentCompany);
                }

                this.setState({ companiesWithData: companiesWithOrders, filteredCompaniesWithData: companiesWithOrders});
            });
    }

    sortOrders = sortType => {
        console.log('sortuje');
        /* Posortuj firmy wg sumy zamówień od najmniejszej do największej */
        /* Do sortowania użyj algorytmu bąbelkowego */

        let swapp;
        let n = this.state.companiesWithData.length - 1;
        let x = this.state.companiesWithData;
        do {
            swapp = false;
            for (let i = 0; i < n; i++) {
    
                if (x[i][sortType] > x[i + 1][sortType] ) {
                    let temp = x[i];
                    x[i] = x[i + 1];
                    x[i + 1] = temp;
                    swapp = true;
                }
            }
            n--;
        } while (swapp);
        
        console.log(x);
        /* Posortowaną tablicę ustaw w stanie komponentu */
        this.setState({companiesWithData: x})
    }


    fileterCompanies = (event) => {
        
        let filteredCompanies = this.state.companiesWithData.filter(company=>{
            return company.name.toUpperCase().includes(event.target.value.toUpperCase());
        });

        this.setState({filteredCompaniesWithData: filteredCompanies});
    }


    componentDidMount() {
        this.getCompanies().then(companies => {
            this.getOrders(companies);
        });
    }


    render() {
        /* Zmapuj tablicę z danymi o firmach, stwórz kolekcję obiektów z danymy i wyswietl je w komponencie comapnies */

        let companiesList = this.state.filteredCompaniesWithData.map(company => {
            return (
                <div className="row" key={company.id}>
                    <div className="cell">{company.id}</div>
                    <div className="cell">{company.name}</div>
                    <div className="cell">{company.ordersSum}</div>
                </div>
            );
        });

        return (
            <div className="companies">
                <h2>Lista firm</h2>
                <input type="text" placeholder="Find Company" onChange={this.fileterCompanies}/>
                <div className="row">
                    <h3 onClick={()=>this.sortOrders('id')}>ID</h3>
                    <h3>Name:</h3>
                    <h3 onClick={()=>this.sortOrders('ordersSum')}>Amount:</h3>
                </div>
                {companiesList}
            </div>
        );
    }

}

export default CompaniesList;