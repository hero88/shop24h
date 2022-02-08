import DATA from './data.json';

function App() {
  return (
    <div >
      <h5>Some data:</h5>
      <ul>
        { 
          DATA.map((element, index)=>            
            <li key={index}>{element.Name}</li>)
        }
      </ul>
    </div>
  );
}

export default App;
