import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Input, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      txID: '',
    };
  }

  handleChange(event) {
    this.setState({ txID: event.target.value });
  }

  render() {
    const { txID } = this.state;
    return (
      <>
        <Container
          style={{ paddingTop: '20px' }}
          className="home d-flex flex-column justify-content-center h-100"
        >
          <div className="heading">
            <h1 className="display-1 text-center text-primary">Blockchain + IoT</h1>
            <h3 className="text-center display-5 text-light">
              Une solution clé en main au service de la supply chain de demain
            </h3>
          </div>
          <Form className="d-flex flex-column">
            <div className="text-input">
              <Input
                onChange={this.handleChange}
                className="transactionInput"
                bsSize="lg"
                type="text"
                required
              />
              <span className="floating-label">Enter transaction ID</span>
            </div>
            <Link
              to={`/transaction/${txID}`}
              className="btn align-self-center btn-send"
              color="primary"
              size="lg"
            >
              Consulter
              <FontAwesomeIcon
                icon="angle-double-right"
                size="sm"
                style={{ marginLeft: '0.5rem' }}
              />
            </Link>
          </Form>
        </Container>
      </>
    );
  }
}
