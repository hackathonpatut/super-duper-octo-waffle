import React, { Component } from 'react';
import { List, Divider } from 'semantic-ui-react';
import Progress from '../Progress';

export default class Review extends Component {
  render() {

    return (
      <div style={{ padding: 10 }} className="page">
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
      </div>
    );
  }
}
