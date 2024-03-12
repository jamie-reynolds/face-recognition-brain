import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [signin, setSignin] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    console.log(box);
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
    // consts for request
    // Personal Access Token
    const PAT = '3b8603cb8c5b40e8aee857d321531ec3';
    const USER_ID = 'jamie-reynolds';
    const APP_ID = 'test';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = input;
    // sample url = https://samples.clarifai.com/metro-north.jpg

    // request body using the consts
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
        "inputs": [
          {
            "data": {
              "image": {
                "url": IMAGE_URL
                // "base64": IMAGE_BYTES_STRING
              }
            }
          }
        ]
    });

    // request options
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    // fetch the request and console log the response
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => displayFaceBox(calculateFaceLocation(result)))
    .catch(error => console.log('error', error));
  }

  const onRouteChange = (route) => {
    if (route === 'home') {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
    setSignin(route);
  }

  return (
    <div className="App">
      <ParticlesBg type='cobweb' bg={true} color='#FFFFFF'/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { signin === 'home'
        ? <> 
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit} 
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </>
        :
        (
          signin === 'signin'
            ? <Signin onRouteChange={onRouteChange} />
            : <Register onRouteChange={onRouteChange} />
        )
      }
    </div>
  );
}

export default App;
