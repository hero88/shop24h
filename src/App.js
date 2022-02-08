
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

function App() {
  return (
    <div >
      <HeaderComponent/>      
      <HomepageContent/>
      <FooterComponent/>
    </div>
  );
}

export default App;
