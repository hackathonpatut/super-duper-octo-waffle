import React from 'react';
import { Flag, List, Image } from 'semantic-ui-react';

const SuggestionList = ({
  title,
  data,
  colorMapper,
  handleItemClick,
}) => (
  <React.Fragment>
    <h5>{title}</h5>
    <List>
      {data.map((choice, ind) => (
        <React.Fragment key={choice.name}>
          <List.Item onClick={() => handleItemClick(choice.ean)}>
            <Image className="avatar-image" avatar src={`${choice.image || "http://placehold.it/200x200"}`} />
            <List.Content style={{ flexGrow: 1 }}>
              <List.Header as='a' style={{ display: 'flex', justifyContent: 'space-between'}}>
                <span>{choice.name}</span>
                <span style={{color: colorMapper(choice.score), paddingLeft: '10px'}}>{choice.score}</span>
              </List.Header>
              <List.Description>
                <span className="choiceInfo">
                    <Flag name={choice.country.id.toLowerCase()} />
                    {`${choice.country.name}, price: ${choice.price} €`}
                </span>
              </List.Description>
            </List.Content>
          </List.Item>
        </React.Fragment>
      ))}
    </List>
  </React.Fragment>
);

export default SuggestionList;
