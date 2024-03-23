import './App.css';
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import { render } from '@testing-library/react';
import Clarifai from 'clarifai';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: '0288da064be44d8ebe6d6dad25cf37a7'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  } 
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}, function () {
      console.log(this.state.imageUrl);
    });

    // Deprecated
    // app.models.predict({
    //   id: Clarifai.FACE_DETECT_MODEL,
    //   version: "6dc7e46bc9124c5c8824be4822abe105",
    // }, this.state.input)
    //   .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    //   .catch(err => console.log(err));

    //https://stackoverflow.com/questions/72567960/find-javascript-code-integrate-clarifai-face-detection-api
    //help me => user_id can be found in multiple ways, one way is in https://portal.clarifai.com/settings/profile
    const USER_ID = "azangi700";


    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    // help me => PAT can be found in https://portal.clarifai.com/settings/authentication (create one if necessary!)
    const PAT = "c2516e48f6be487f809d6a3c05533405";


    // help me => App Id is just the name of your app on the portal.
    const APP_ID = "6e5776a3667e49dc894cef3a933b9d0b";


    // Change these to whatever model and image input you want to use
    // help me => https://help.clarifai.com/hc/en-us/articles/1500007677141-Where-to-find-your-Model-IDs-and-Model-Version-IDs
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

    const IMAGE_URL = this.state.input;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    fetch(
        "https://api.clarifai.com/v2/models/" +
        MODEL_ID +
        "/versions/" +
        MODEL_VERSION_ID +
        "/outputs",
        requestOptions
    )
        .then((response) => response.json())
        .then((result) =>
            this.displayFaceBox(this.calculateFaceLocation(result))
        )
        .catch((error) => console.log("error", error));
  }

  render() {

    return (
      <div className="App">
        <Particles className='particles'
            params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
  
}

export default App;
