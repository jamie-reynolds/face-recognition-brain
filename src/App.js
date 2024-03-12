import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
    .then(result => {

        const regions = result.outputs[0].data.regions;

        regions.forEach(region => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                // Accessing and rounding the concept value
                const name = concept.name;
                const value = concept.value.toFixed(4);

                console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
            });
        });

    })
    .catch(error => console.log('error', error));

  }

  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm 
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit} 
      />
      <FaceRecognition imageUrl={imageUrl}/>
      <ParticlesBg type='cobweb' bg={true} color='#FFFFFF'/>
    </div>
  );
}

export default App;
