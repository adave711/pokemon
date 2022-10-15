import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  ButtonGroup,
  Button,
  Typography,
  Box,
  CardActionArea,
  CardContent,
  Card,
  Chip,
  Dialog,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import { NavigateBefore,NavigateNext, Info } from '@mui/icons-material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

//Styled components
import AppContainer  from './styledComponents/app-container.styles';
import { ButtonGroupStyles } from './styledComponents/button-group.styles';
import PokemonCardStyles  from './styledComponents/pokemon-card.styles';

//Child components
import MultiSelectComponent from './components/MultiSelectComponent';
import PokemonDetailsDialog from './components/PokemonDetailsDialog';

//External libraries
import randomColor from "randomcolor";

//Logo
import pokemonlogo from './assets/images/pokemon.png';

  // Tab Panel component to display the tab content
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
};

const App = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [pokemonData, setPokemonData] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [requestUrl, setRequestUrl] = useState({
    url: {
      prev: null,
      next: null,
      initial: "https://pokeapi.co/api/v2/pokemon" // Initial Api
    }
  });

  const { url } = requestUrl;

  // Pokemon request and response processing
  const loadPokemonData = async (operation) => {
    const { url } = requestUrl;
    const pokemonUrl =
      operation === "initial"
        ? url.initial
        : operation === "next"
        ? url.next
        : url.prev;
    const response = await axios.get(pokemonUrl);
    url.next = response.data.next;
    url.prev = response.data.previous;
    setRequestUrl({ url });
    const result = await response.data.results;
    const urls = result.map((res) => axios.get(res.url));
    const pokemonData = await (await axios.all(urls)).map((uRes) => uRes.data);
    setPokemonData(pokemonData);
  };

  const generateBorderColor = (poke) => {
    let backColor = "#EEE8AA";
    const pokeTypes = poke.types.map(i => i.type.name);
    if (pokeTypes.includes("fire")) {
        backColor = "#FEC5BB";
    } else if (pokeTypes.includes("grass")) {
        backColor = "#80FFDB";
    } else if (pokeTypes.includes("water")) {
        backColor = "#DFE7FD";
    } else if (pokeTypes.includes("bug")) {
        backColor = "#B0DEA3"
    } else if (pokeTypes.includes("normal")) {
        backColor = "#E0FFFF"
    } else if (pokeTypes.includes("electric")) {
        backColor = "#D8E2DC"
    } else if (pokeTypes.includes("ground")) {
        backColor = "#FAD2E1";
    } else if (pokeTypes.includes("fairy")) {
        backColor = "#FFF1E6";
    } else if (pokeTypes.includes("ghost")) {
        backColor = "#F8EDEB";
    } else if (pokeTypes.includes("fighting")) {
        backColor = "#F1FAEE";
    } else if (pokeTypes.includes("rock")) {
        backColor = "#A8DADC";
    }
    return backColor;
  }

  useEffect(() => {
    loadPokemonData("initial");
  }, []);


  // Generate pokemon types list
  useEffect(() => {
    if(pokemonData && pokemonData.length > 0){
      let pokemonTypes = [];
      pokemonData.forEach(poke => {
        poke.types.forEach(type => {
          pokemonTypes.push(type.type.name);
        });
      });

      const filteredPokemonTypes = pokemonTypes.filter((type, index) => pokemonTypes.indexOf(type) === index);
      setTypes(filteredPokemonTypes);
    }
  }, [pokemonData]);

  // Converting the pokemon name first letter uppercase
  const getPokeName = (name) => name.slice(0, 1).toUpperCase() + name.slice(1, name.length);

  //On change event for types select dropdown
  const onTypeSelected = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );

  }
  
  return (
    <AppContainer>
      <Box style={{textAlign: "center"}}>
        <img src={pokemonlogo} alt="logo" style={{ height: 70}}/>
      </Box>
      <Box>
        { types && types.length > 0 && <MultiSelectComponent options={types} selectedValue={selectedType} handleChange={onTypeSelected} /> }
      </Box>
      <ButtonGroupStyles>
        <div className="buttonGroup">
          <Button
            variant="contained"
            disabled={url.prev === null}
            size="small"
            startIcon={<NavigateBefore />}
            onClick={() => loadPokemonData("prev")}
            style={{ background: '#73037c'}}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            disabled={url.next === null}
            size="small"
            startIcon={<NavigateNext />}
            onClick={() => loadPokemonData("next")}
            style={{ background: '#73037c', color: '#fff'}}
          >
            Next
          </Button>
        </div>
      </ButtonGroupStyles>
      <Box style={{ padding: 30}}>
        <Grid container spacing={1}>
          {pokemonData
            ? pokemonData.map((poke) => {
                const types = poke.types.map((item) => item.type.name);
                return (
                  <Grid key={poke.id} item xs={6} sm={6} md={4} lg={3}>
                    <PokemonCardStyles style={{ border: `1px solid ${generateBorderColor(poke)}`, background: '#464346'}}>
                        <Box>
                          <Box>
                            {poke.sprites.other.dream_world.front_default ? (
                              <img
                                height="140px"
                                width="100px"
                                alt={getPokeName(poke.name)}
                                src={poke.sprites.other.dream_world.front_default}
                              ></img>
                            ) : null}
                          </Box>
                          <Box>
                            <Typography variant="h6" style={{ color: '#fff'}}>
                              {getPokeName(poke.name)}
                            </Typography>
                          </Box>
                          <Box className="more-info-container"  
                                onClick={() => {
                                  setShowDialog(!showDialog);
                                  setSelectedPokemon(poke);
                              }}>
                            <span className="more-info">More Info</span>
                          </Box>
                        </Box>
                    </PokemonCardStyles>
                  </Grid>
                );
              })
            : "Loading"}
        </Grid>
      </Box>
      {/* Pokemon Details Display */}
      {showDialog && (
        <PokemonDetailsDialog selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} showDialog={showDialog} setShowDialog={setShowDialog}/>
      )}
    </AppContainer>
  );
};

export default App;
