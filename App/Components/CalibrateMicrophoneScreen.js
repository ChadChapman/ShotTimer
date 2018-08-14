import React, { Component } from "react";
import {
    AsyncStorage,
} from "react-native";
import { Container, Header, Content, Card, CardItem, Text, Body, Left, Button, Icon, Right, Title } from 'native-base';


import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


import { AudioRecorder, AudioUtils } from 'react-native-audio';


export default class CalibrateMicrophoneScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSoundLevel: 'none',
            highestSoundLevel: -100,
            previousSoundCalibration: null
        }
    }

    async componentDidMount() {
      const previousSoundCalibration = await AsyncStorage.getItem('SHOT_TIMER_CALIBRATION')
      console.log(previousSoundCalibration)
      this.setState({
        previousSoundCalibration: JSON.parse(previousSoundCalibration)
      })
        let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';

        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            MeteringEnabled: true,
        });
    }

    startCalibration = () => {
      AudioRecorder.startRecording();
      AudioRecorder.onProgress = data => {
          let highLevel;
          let decibels = data.currentMetering.toFixed(3);

          this.setState({ recording: true, currentSoundLevel: decibels, 
            highestSoundLevel: decibels > this.state.highestSoundLevel ? 
              decibels : this.state.highestSoundLevel})
      };
    }

    stopCalibration = async () => {
        AudioRecorder.stopRecording();
        this.setState({ recording: false, })
        AsyncStorage.setItem('SHOT_TIMER_CALIBRATION', JSON.stringify(this.state.highestSoundLevel))
        this.props.navigation.navigate('TimerScreen')

    }

    setMenuRef = ref => {
        this.menu = ref;
    };

    menu = null;

    hideMenu = () => {
        this.menu.hide();
    };

    showMenu = () => {
        this.menu.show();
    };

    onDrillScreenPress = () => {
        this.props.navigation.navigate('RandomDrillScreen')
        this.hideMenu()
    }

    onShotTimerPress = () => {
        this.props.navigation.navigate('TimerScreen')
        this.hideMenu()
    }
    render() {
      const {previousSoundCalibration, recording, currentSoundLevel, highestSoundLevel} = this.state
        return (
            <Container>
                <Header style={{ backgroundColor: 'black' }}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon name='home' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>Calibration</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showMenu}>
                            <Icon name='settings' />
                        </Button>
                        <Menu
                            ref={this.setMenuRef}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            {<MenuItem onPress={() => this.onDrillScreenPress(this.props.navigation)}>Random Fire Excersize</MenuItem>}
                            <MenuItem onPress={() => this.onShotTimerPress(this.props.navigation)}>Shot Timer</MenuItem>
                            <MenuItem onPress={this.onCalibratePress}>Calibrate Sound</MenuItem>
                        </Menu>
                    </Right>
                </Header>
                <Content>
                    <Card>
                        <CardItem header>
                            <Text>Microphone Calibration</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={{ marginBottom: 10 }}>
                                    If this app isn't accurately hearing shots from your firearm calibration may be needed.
                                </Text>
                                <Text>
                                    Push the start button below, then fire one shot, then push the stop button.
                                </Text>
                                <Text style={{ marginBottom: 10 }}>
                                    This should calibrate your app to the caliber you just fired.
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem footer>
                            <Text>Happy Shooting!</Text>
                        </CardItem>
                    </Card>

                    {recording ?
                        <Card>
                            <CardItem header>
                                <Text>Sound Metering</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                  {previousSoundCalibration && 
                                    <Text>Previous Calibration Level {previousSoundCalibration}</Text>}
                                    <Text style={{ marginBottom: 10 }}>
                                        Current Sound {currentSoundLevel}</Text>
                                    <Text>
                                        Highest Sound {highestSoundLevel}</Text>
                                </Body>
                            </CardItem>
                            <CardItem footer>
                                <Text>Happy Shooting!</Text>
                            </CardItem>
                        </Card>
                        :

                        <Button style={{ margin: 20 }} block onPress={this.startCalibration}>
                            {/* <Icon name='start' /> */}
                            <Text>Start Calibration</Text>
                        </Button>
                    }
                    <Button style={{ margin: 20 }} block onPress={this.stopCalibration}>
                        {/* <Icon name='start' /> */}
                        <Text>Stop Calibration</Text>
                    </Button>

                    <Button style={{ margin: 20 }} block onPress={() => { this.props.navigation.navigate('TimerScreen', { 'name': 'gavin' }) }}>
                        {/* <Icon name='start' /> */}
                        <Text>testing</Text>
                    </Button>

                </Content>
            </Container>
        );
    }
}


