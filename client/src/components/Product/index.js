import React, { Component } from 'react';
import { Flag, Button, Dimmer, Loader, Divider, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuggestionList from './SuggestionList';
import Progress from '../Progress';

class Product extends Component {
  state = {
    code: null,
    name: null,
    price: null,
    segment: null,
    sustainability: null,
    health: null,
    country: {
      name: null,
      id: null,
    },
    image: null,
    sustainabilityChoices: [],
    healthChoices: [],
    isChoicesVisible: false,
    selectedAmount: 1,
    isCheckoutButtonPressed: false,
  };

  getData = (ean) => {
    axios
      .get(`/product/${ean}`)
      .then(response => {
        if (response.data.code === -1) {
          // 404
          this.setState({ code: -1 });
        } else {
          console.log(response);
          const { name, price, image, matching, origin, sustainability, health } = response.data;

          const sustainabilityChoices = matching.sustainability.map(product => ({
            ean: product.ean,
            name: product.name,
            image: product.image,
            country: {
              name: product.origin.country,
              id: product.origin.id,
            },
            price: product.price.value,
            healthScore: product.health.score,
            sustainabilityScore: product.sustainability.score,
          })).filter(p => p.ean !== ean).slice(0, Math.min(matching.sustainability.length, 3));

          const healthChoices = matching.health.map(product => ({
            ean: product.ean,
            name: product.name,
            image: product.image,
            country: {
              name: product.origin.country,
              id: product.origin.id,
            },
            price: product.price.value,
            healthScore: product.health.score,
            sustainabilityScore: product.sustainability.score,
          })).filter(p => p.ean !== ean).slice(0, Math.min(matching.health.length, 3));

          this.setState({
            code: ean,
            name,
            price: price.value,
            image,
            sustainabilityChoices,
            healthChoices,
            country: {
              name: origin.country,
              id: origin.id,
            },
            sustainability: sustainability.score,
            health: health.score,
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ code: null });
      });
  }

  componentDidMount() {
    const ean = this.props.match.params.ean;
    if (ean) this.getData(ean);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.ean && nextProps.match.params.ean &&
      nextProps.match.params.ean !== this.props.match.params.ean) {
      this.setState({ code: null });
      this.getData(nextProps.match.params.ean);
    }
  }

  healthToColor = (score) => {
    if (score < -100) return 'red';
    if (score < -50) return 'orange';
    return 'green';
  }

  distanceToColor = (score) => {
    if (score < 300) return 'green';
    if (score < 1000) return 'orange';
    return 'red';
  }

  handleSuggestionClick = (ean) => {
    this.props.handleSuggestionClick(ean);
  }

  toggleAlternatives = () => {
    this.setState({
      isChoicesVisible: !this.state.isChoicesVisible,
    })
  }

  editAmount = (num) => {
    const newAmount = Math.max(1, num + this.state.selectedAmount);
    this.setState({ selectedAmount: newAmount });
  }

  navigateToStart = () => {
    this.props.history.push(`/`);
  }

  addToCart = () => {

    this.setState({ isCheckoutButtonPressed: true });

    this.props.addToCart({
      amount: this.state.selectedAmount,
      name: this.state.name,
      price: this.state.price,
      image: this.state.image,
      ean: this.state.code,
      health: this.state.health,
      sustainability: this.state.sustainability,
    });

    window.setTimeout(this.navigateToStart, 1000);

  }

  render() {
    if (this.state.code === -1) {
      toast.error("Invalid EAN!", {
        position: toast.POSITION.TOP_RIGHT
      });
      this.navigateToStart();
      return null;
    }

    if (this.state.code === null) return (
      <div className="loader">
        <Dimmer active inverted>
          <Loader>Loading...</Loader>
        </Dimmer>
      </div>
    );

    const currentCart = this.props.items;
    const currentItem = currentCart.find(p => p.name === this.state.name);
    const currentCount = currentItem ? currentItem.amount : 0;

    const checkoutButtonBgColour = this.state.isCheckoutButtonPressed ? 'green' : 'orange';

    const addToCartText = this.state.isCheckoutButtonPressed ?
      'Item(s) added' :
      `Add to cart${currentCount !== 0 ? ` (${currentCount})` : ''}`

    return (
      <div className="product-info page">
        <div className="product-header">
          <div className="image-wrapper">
            <img src={`${this.state.image || "http://placehold.it/200x200"}`} alt='' />
          </div>
          <div className="product-meta">
            <h3>{this.state.name}</h3>
            <span>Origin: <Flag name={this.state.country.id.toLowerCase()} />{this.state.country.name}</span>
          </div>
          <p className="product-price">{this.state.price}€</p>
        </div>
        <Divider />
          <div className="progress-wrapper">
          <div className="progress">
            <Progress value={Math.ceil(this.state.health * 100)} type='health' />
          </div>
          <div className="progress">
            <Progress value={Math.ceil(this.state.sustainability * 100)} type='green' />
          </div>
        </div>
        <Button style={{ marginTop: '1em' }} color='blue' className="check-options" basic onClick={() => this.toggleAlternatives()}>
          {`${this.state.isChoicesVisible ? 'Hide' : 'See'} alternative products`}
        </Button>
        {this.state.isChoicesVisible &&
          <React.Fragment>
            {this.state.healthChoices && this.state.healthChoices.length > 0 &&
              <SuggestionList
                title="Be more healthy!"
                data={this.state.healthChoices}
                colorMapper={this.healthToColor}
                handleItemClick={this.handleSuggestionClick}
              />
            }
            {this.state.sustainabilityChoices && this.state.sustainabilityChoices.length > 0 &&
              <SuggestionList
                title="Be more sustainable!"
                data={this.state.sustainabilityChoices}
                colorMapper={this.distanceToColor}
                handleItemClick={this.handleSuggestionClick}
              />
            }
            <Divider />
          </React.Fragment>
        }
        <div className="product-button-row">
          <Button.Group>
            <Button icon onClick={() => this.editAmount(-1)}>
              <Icon name='minus' />
            </Button>
            <Button disabled id="remove-this-fokkin-opacity">{this.state.selectedAmount}</Button>
            <Button icon onClick={() => this.editAmount(1)}>
              <Icon name='plus' />
            </Button>
          </Button.Group>
          <Button
            color={checkoutButtonBgColour}
            className="add-cart"
            icon
            labelPosition='right'
            onClick={this.addToCart}
            disabled={this.state.isCheckoutButtonPressed}
          >
            {addToCartText}
            <Icon name='cart plus' />
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Product);