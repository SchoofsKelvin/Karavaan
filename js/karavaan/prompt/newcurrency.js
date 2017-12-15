import React from 'react';
import { connect } from 'react-redux';

import {
  Form,
  Item,
  Label,
  Input,
} from 'native-base';

import Prompt from './prompt';

class NewCurrencyPrompt extends Prompt {
  constructor(props) {
    super(props);
    this.props.onSubmit = () => this.close();
    this.props.onCancel = () => this.close();
    this.state = { tag: '', name: '' };
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }
  componentWillUnmount() {
    if (this.props.onRef) this.props.onRef(undefined);
  }
  get tag() {
    return this.state.tag;
  }
  get name() {
    return this.state.name;
  }
  renderContent() {
    return (
      <Form>
        <Item floatingLabel>
          <Label>Tag</Label>
          <Input value={this.tag} uppercase onChangeText={v => this.setState(s => ({ ...s, tag: v && v.toUpperCase() }))} autoFocus />
        </Item>
        <Item floatingLabel>
          <Label>Name</Label>
          <Input value={this.name} onChangeText={v => this.setState(s => ({ ...s, name: v }))} />
        </Item>
      </Form>);
  }
}

function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    pickExpenseEntry(index: number) {
      dispatch(SelectExpenseEntry(index));
    },
    deleteEntry(index: number) {
      dispatch(DeleteExpenseEntry(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCurrencyPrompt);

