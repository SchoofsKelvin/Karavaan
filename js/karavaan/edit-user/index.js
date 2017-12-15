import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Keyboard } from 'react-native';

import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  Item,
  Input,
  ActionSheet,
  Subtitle,
  Form,
  Label,
  Toast,
} from 'native-base';

import { User, SaveUser, DeleteUser } from '../model';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.boundPromptCancelEntry = this.promptCancelEntry.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    const user: User = this.props.user;
    this.state = {
      name: user && user.name,
    };
  }
  setName(name: string) {
    this.setState(state => ({ ...state, name }));
  }
  get user(): User {
    return new User(this.state.name, false);
  }
  goBack() {
    BackHandler.removeEventListener('hardwareBackPress', this.boundPromptCancelEntry);
    this.props.navigation.goBack();
    return true;
  }
  delete() {
    this.props.delete();
    this.goBack();
    this.props.navigation.goBack();
  }
  promptDelete() {
    Keyboard.dismiss();
    if (this.props.user.external) {
      Toast.show({
        text: 'This user is already external',
        type: 'danger',
        buttonText: 'Okay',
      });
      return;
    }
    ActionSheet.show({
      options: ['Yes', 'Cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      title: 'Make this user external?',
    }, (button) => {
      if (button == 0) this.delete();
    });
  }
  save() {
    if (!this.state.name || !this.state.name.trim()) {
      Toast.show({
        text: 'Missing the name',
        type: 'danger',
        buttonText: 'Okay',
      });
      return;
    }
    if (this.props.trip.registeredUsers.find(u => u.name == this.state.name)) {
      if (this.props.user) {
        if (this.props.user.name != this.state.name) {
          ActionSheet.show({
            options: ['Yes', 'Cancel'],
            cancelButtonIndex: 1,
            title: `Merge ${this.state.name} and ${this.props.user.name}?`,
          }, button => (button == 0) && (this.props.save(this.user), this.goBack()));
          return;
        }
      } else {
        Toast.show({
          text: 'This user already exists',
          type: 'danger',
          buttonText: 'Okay',
        });
        return;
      }
    }
    this.props.save(this.user);
    this.goBack();
  }
  promptCancelEntry() {
    Keyboard.dismiss();
    const user: User = this.props.user;
    if (user && user.name == this.state.name) {
      this.goBack();
      return true;
    }
    ActionSheet.show({
      options: ['Save', 'Discard', 'Cancel'],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1,
      title: ((!user || user.external) ? 'Add user?' : 'Save changes?'),
    }, (button) => {
      if (button == 0) this.save();
      else if (button == 1) this.goBack();
    });
    return true;
  }
  showExpenses() {
    this.props.navigation.navigate('UserExpensesSummary');
  }
  render() {
    const user: User = this.props.user;
    return (
      <Container style={{ backgroundColor: '#fff' }} >
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => this.promptCancelEntry()}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{(!user || user.external) ? 'Add User' : 'Edit User'}</Title>
            {user && (<Subtitle>{user.name}</Subtitle>)}
          </Body>
          <Right>
            {user && (<Button transparent onPress={() => this.promptDelete()}><Icon name="trash" /></Button>)}
          </Right>
        </Header>
        <Form>
          <Item floatingLabel>
            <Label>Name</Label>
            <Input value={this.state.name} onChangeText={v => this.setName(v)} />
          </Item>
          <Button
            block
            info
            style={{ margin: 15 }}
            onPress={() => this.showExpenses()}
          >
            <Text>See expenses</Text>
          </Button>
        </Form>
        <Button block style={{ margin: '5%', bottom: 0, position: 'absolute', width: '90%' }} onPress={() => this.save()}>
          <Text>{(!user || user.external) ? 'Add' : 'Save'}</Text>
        </Button>
      </Container >
    );
  }
}


function mapStateToProps(store) {
  const trip = store.trips.find(t => t.guid == store.selectedTrip);
  const name = store.selectedUser;
  const user = trip.users.find(u => u.name == name);
  return { trip, name, user };
}
function mapDispatchToProps(dispatch) {
  return {
    save(user: User) {
      dispatch(SaveUser(user));
    },
    delete() {
      dispatch(DeleteUser());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
