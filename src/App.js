import Game from './components/js/Game';
import Links from './components/js/Links.js';
import './main.css';

const App = () => {
  return (
    <>
      <h1>Conway's Game of Life</h1>
      <Game />
      <Links />
    </>
  );
};

export default App;
