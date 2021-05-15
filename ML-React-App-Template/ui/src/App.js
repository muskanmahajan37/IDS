import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { flags, services } from './arrays';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        Protocol_type: '',
        service: '',
        flag: '',
        duration: 0,
        src_bytes: 0,
        dst_bytes: 0,
        num_failed_logins: 0,
        root_shell: 0,
        su_attempted: 0,
        num_file_creations: 0,
        num_shells: 0,
        num_access_files: 0,
        num_outbound_cmds: 0,
        is_host_login: 0,
        is_guest_login: 0,
      },
      result: ""
    };
  }

  handleChange = (event) => {
    console.log(event.target.value)
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }

  handleNumberChange = (event) => {
    console.log(event.target.value)
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = parseInt(value);
    this.setState({
      formData
    });
  }

  handleCheckboxChange = (event) => {
    console.log(event.target.name)
    const value = event.target.checked ? 1 : 0;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }

  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:5000/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          result: response.result,
          isLoading: false
        });
      });
  }

  handleCancelClick = (event) => {
    this.setState({ 
      formData: {
        Protocol_type: '',
        service: '',
        flag: '',
        duration: 0,
        src_bytes: 0,
        dst_bytes: 0,
        num_failed_logins: 0,
        root_shell: 0,
        su_attempted: 0,
        num_file_creations: 0,
        num_shells: 0,
        num_access_files: 0,
        num_outbound_cmds: 0,
        is_host_login: 0,
        is_guest_login: 0,
      },
      result: ""
      });
  }

  capitalise = (name) => {
    const arr = name.split(' ');
    const res = [];
    arr.forEach(ele => {
      res.push(ele.charAt(0).toUpperCase() + ele.slice(1));
    });
    return res.join(' ');
  }

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;

    return (
      <Container>
        <div>
          <h1 className="title">Intrusion Detection System</h1>
        </div>
        <div className="content">
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Duration</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Duration" 
                  name="duration"
                  defaultValue={0}
                  value={formData.duration}
                  onChange={this.handleNumberChange} />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Number of failed logins</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Number of failed logins" 
                  name="num_failed_logins"
                  defaultValue={0}
                  value={formData.num_failed_logins}
                  onChange={this.handleNumberChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Source Bytes</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Source Bytes" 
                  name="src_bytes"
                  defaultValue={0}
                  value={formData.src_bytes}
                  onChange={this.handleNumberChange} />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Destination Bytes</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Destination Bytes" 
                  name="dst_bytes"
                  defaultValue={0}
                  value={formData.dst_bytes}
                  onChange={this.handleNumberChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Protocol</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.Protocol_type}
                  name="Protocol_type"
                  defaultValue="Choose Protocol"
                  onChange={this.handleChange}>
                  <option>Choose Protocol</option>
                  <option>icmp</option>
                  <option>tcp</option>
                  <option>udp</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Service</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.service}
                  name="service"
                  defaultValue="Choose Service"
                  onChange={this.handleChange}>
                  <option>Choose Service</option>
                  {
                    services.map(service => {
                      const name = service.split('_').splice(1).join('_');
                      return (
                        <option>{name}</option>
                      )
                    })
                  }
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Flag</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.flag}
                  name="flag"
                  defaultValue="Choose Flag"
                  onChange={this.handleChange}>
                  <option>Choose Flag</option>
                  {
                    flags.map(flag => {
                      const name = flag.split('_').splice(1).join('_');
                      return (
                        <option>{name}</option>
                      )
                    })
                  }
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Number of file creations</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Number of file creations" 
                  name="num_file_creations"
                  defaultValue={0}
                  value={formData.num_file_creations}
                  onChange={this.handleNumberChange} />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Number of file accesses</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Number of file accesses" 
                  name="num_access_files"
                  defaultValue={0}
                  value={formData.num_access_files}
                  onChange={this.handleNumberChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Number of shells</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Number of shells" 
                  name="num_shells"
                  defaultValue={0}
                  value={formData.num_shells}
                  onChange={this.handleNumberChange} />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Number of outbound commands</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Number of outbound commands" 
                  name="num_outbound_cmds"
                  defaultValue={0}
                  value={formData.num_outbound_cmds}
                  onChange={this.handleNumberChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Check
                  type="checkbox"
                  id="autoSizingCheck"
                  className="mb-2"
                  label="Root Shell"
                  name="root_shell"
                  onChange={this.handleCheckboxChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Check
                  type="checkbox"
                  id="autoSizingCheck"
                  className="mb-2"
                  label="Super user attempted"
                  name="su_attempted"
                  onChange={this.handleCheckboxChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Check
                  type="checkbox"
                  id="autoSizingCheck"
                  className="mb-2"
                  label="Host login"
                  name="is_host_login"
                  onChange={this.handleCheckboxChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Check
                  type="checkbox"
                  id="autoSizingCheck"
                  className="mb-2"
                  label="Guest login"
                  name="is_guest_login"
                  onChange={this.handleCheckboxChange}
                />
              </Form.Group>
            </Form.Row>
            <Row>
              <Col>
                <Button
                  block
                  variant="success"
                  disabled={isLoading}
                  onClick={!isLoading ? this.handlePredictClick : null}>
                  { isLoading ? 'Making prediction' : 'Predict' }
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  disabled={isLoading}
                  onClick={this.handleCancelClick}>
                  Reset prediction
                </Button>
              </Col>
            </Row>
          </Form>
          {result === "" ? null :
            (<Row>
              <Col className="result-container">
                <h5 id="result">{result}</h5>
              </Col>
            </Row>)
          }
        </div>
      </Container>
    );
  }
}

export default App;