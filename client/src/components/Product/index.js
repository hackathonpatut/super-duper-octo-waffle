import React, { Component } from 'react';
import axios from 'axios';

export default class Product extends Component {
  state = {
    code: null
  }

  componendDidMount() {
    const { ean } = this.props;
    axios
      .get(`/product/${ean}`)
      .then(() =>
        this.setState({ code: ean })
      )
      .catch(err => {
        console.log(err);
        this.setState({ code: null });
      });
  }

  render() {
    return (
      <p>EAN: {this.props.ean}</p>
    );
  }
}
