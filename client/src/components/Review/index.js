import React, { Component } from 'react';
import { List, Divider, Button, Label, Icon, Popup, Loader } from 'semantic-ui-react';
import Progress from '../Progress';

export default class Review extends Component {
  state = { isMobilePay: true }

  componentDidMount() {
    window.setTimeout(() => this.setState({ isMobilePay: false }), 5000);
  }

  render() {
    // Fuckkin mobile pay API documentation was lacking so we improvised
    if (this.state.isMobilePay) {
      return <div style={{ background: '#5b7cf7', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, fontSize: 24, color: '#fff', paddingTop: '45%', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.618 }}>
        MobilePay<br/>payment going...
        <Loader active inverted size='large' />
      </div>;
    }

    return (
      <div className="review-info page">
        <h2>HEALTH</h2>
        <div style={{ width: '35%', margin: '1em auto' }}>
          <Progress value={60} type="health" />
        </div>
        <Divider />
        <List>
          <List.Item>
            <List.Icon name='check' />
            <List.Content>
              <List.Header>Not much salt</List.Header>
              <List.Description>
                Your groceries had <strong>32 % less</strong> salt than average groceries on this area. Well done!
              </List.Description>
            </List.Content>
          </List.Item>
          <Divider />
          <List.Item>
            <List.Icon name='check' />
            <List.Content>
              <List.Header>Good fats</List.Header>
              <List.Description>
                Your groceries <strong>over 18 % less</strong> saturated fat than average groceries on this area. Well done!
              </List.Description>
            </List.Content>
          </List.Item>
          <Divider />
          <List.Item>
            <List.Icon name='close' />
            <List.Content>
              <List.Header>Quite much sugar</List.Header>
              <List.Description>
                You can choose similar products that would have <strong>44 % less</strong> sugar.
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
        <Divider />
        <Popup trigger={
          <Button as='div' labelPosition='right' className="info-button">
            <Button color='blue'>
              Learn more about healthy choices
            </Button>
            <Label as='a' basic color='blue' pointing='left'>
            <Icon name='heart'/>
            </Label>
          </Button>
        } content="How about buying less soft drinks?" />
        <Divider />
        <h2>SUSTAINABILITY</h2>
        <div style={{ width: '35%', margin: '1em auto' }}>
          <Progress value={40} />
        </div>
        <Divider />
        <List>
          <List.Item>
            <List.Icon name='check' />
            <List.Content>
              <List.Header>Environmental friendly</List.Header>
              <List.Description>
                <strong>Over 50 %</strong> of your groceries had environmental badge. Nice!
              </List.Description>
            </List.Content>
          </List.Item>
          <Divider />
          <List.Item>
            <List.Icon name='close' />
            <List.Content>
              <List.Header>Long distance</List.Header>
              <List.Description>
                Average item in your shopping basket was produced <strong>over 2 400 km away</strong>. Try prefering some local food!
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
        <Divider />
        <Popup trigger={
          <Button as='div' labelPosition='right' className="info-button">
            <Button color='green'>
              Learn more about sustainable choices
            </Button>
            <Label as='a' basic color='green' pointing='left'>
            <Icon name='tree'/>
            </Label>
          </Button>
        } content="Buy locally produced goods!" />
      </div>
    );
  }
}
