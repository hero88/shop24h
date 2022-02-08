import DATA from './data.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';

function App() {
  return (
    <div >
      <HeaderComponent/>
      <h5>Some data:</h5>
      <ul>
        { 
          DATA.map((element, index)=>            
            <li key={index}>{element.Name}</li>)
        }
      </ul>
      <FooterComponent/>
    </div>
  );
}

export default App;
