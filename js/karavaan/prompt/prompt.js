import React, { Component } from 'react';

import {
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  dialog: {
    flex: 1,
    alignItems: 'center',
  },
  dialogOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dialogContent: {
    elevation: 5,
    marginTop: 50,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dialogTitle: {
    borderBottomWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dialogTitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dialogBody: {
    paddingHorizontal: 10,
  },
  dialogInput: {
    height: 50,
    fontSize: 18,
  },
  dialogFooter: {
    borderTopWidth: 0,
    flexDirection: 'row',
  },
  dialogAction: {
    flex: 1,
    padding: 15,
  },
  dialogActionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#006dbf',
  },
});

export default class Prompt extends Component {
  static defaultProps = {
    visible: false,
    cancelText: 'Cancel',
    submitText: 'OK',
    borderColor: '#ccc',
    promptStyle: {},
    titleStyle: {},
    buttonStyle: {},
    buttonTextStyle: {},
    submitButtonStyle: {},
    submitButtonTextStyle: {},
    cancelButtonStyle: {},
    cancelButtonTextStyle: {},
    inputStyle: {},
  };

  state = {
    visible: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
  }

  onSubmitPressInner() {
    this.props.onSubmit();
  }

  onCancelPressInner() {
    this.props.onCancel();
  }

  close() {
    this.setState({ visible: false });
  }

  renderContent() {
    return this.props.children || (<Text>Hi!</Text>);
  }

  render() {
    const {
      title,
      // placeholder,
      // defaultValue,
      cancelText,
      submitText,
      borderColor,
      promptStyle,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      // inputStyle,
    } = this.props;
    return (
      <Modal onRequestClose={() => this.close()} transparent visible={this.props.visible}>
        <View style={styles.dialog} key="prompt">
          <View style={styles.dialogOverlay} />
          <View style={[styles.dialogContent, { borderColor }, promptStyle]}>
            <View style={[styles.dialogTitle, { borderColor }]}>
              <Text style={[styles.dialogTitleText, titleStyle]}>
                {title}
              </Text>
            </View>
            <View style={styles.dialogBody}>
              {this.renderContent()}
            </View>
            <View style={[styles.dialogFooter, { borderColor, paddingBottom: (this.props.onCancel || this.props.onSubmit) ? 0 : 15 }]}>
              {this.props.onCancel && <TouchableWithoutFeedback onPress={() => this.onCancelPressInner()}>
                <View style={[styles.dialogAction, buttonStyle, cancelButtonStyle]}>
                  <Text style={[styles.dialogActionText, buttonTextStyle, cancelButtonTextStyle]}>
                    {cancelText}
                  </Text>
                </View>
              </TouchableWithoutFeedback>}
              {this.props.onSubmit && <TouchableWithoutFeedback onPress={() => this.onSubmitPressInner()}>
                <View style={[styles.dialogAction, buttonStyle, submitButtonStyle]}>
                  <Text style={[styles.dialogActionText, buttonTextStyle, submitButtonTextStyle]}>
                    {submitText}
                  </Text>
                </View>
              </TouchableWithoutFeedback>}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

