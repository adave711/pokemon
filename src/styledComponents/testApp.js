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
  Tooltip
} from '@mui/material';
import { NavigateBefore,NavigateNext, Info } from '@mui/icons-material';

//Styled components
import { ButtonGroupStyles } from './styledComponents/button-group.styles';
import PokemonCardStyles  from './styledComponents/pokemon-card.styles';

//External libraries
import randomColor from "randomcolor";



const App = () => {
  //const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [pokemonData, setPokemonData] = useState([]);
  const [requestUrl, setRequestUrl] = useState({
    url: {
      prev: null,
      next: null,
      initial: "https://pokeapi.co/api/v2/pokemon" // Initial Api
    }
  });

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

  useEffect(() => {
    loadPokemonData("initial");
  }, []);

  // Converting the pokemon name first letter uppercase
  const getPokeName = (name) =>
    name.slice(0, 1).toUpperCase() + name.slice(1, name.length);

  // Forming the pokeman id to display
  const getPokeId = (id) => {
    if (id < 10) return `#00${id}`;
    if (id < 100 && id >= 10) return `#0${id}`;
    if (id >= 100) return `#${id}`;
  };

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

  // Method to process the pokemon state values
  const MIN = 0,
    MAX = 200;
  const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

  const { url } = requestUrl;
  return (
    <div style={{ padding: 20}}>
      <Typography variant="h4" style={{ textAlign: "center" }}>
        Pokemon App
      </Typography>
      <ButtonGroupStyles>
        <div className="buttonGroup">
          <Button
            variant="contained"
            disabled={url.prev === null}
            size="medium"
            color="secondary"
            startIcon={<NavigateBefore />}
            onClick={() => loadPokemonData("prev")}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            disabled={url.next === null}
            size="medium"
            color="secondary"
            startIcon={<NavigateNext />}
            onClick={() => loadPokemonData("next")}
          >
            Next
          </Button>
        </div>
      </ButtonGroupStyles>
      {/* Pokemon List Display */}
      <Box>
        <Grid container spacing={1}>
          {pokemonData
            ? pokemonData.map((poke) => {
                let color = randomColor();
                const types = poke.types.map((item) => item.type.name);
                return (
                  <Grid key={poke.id} item xs={8} sm={8} md={6} lg={3}>
          
                    <PokemonCardStyles style={{ background: `${color}`}}>
                        <Box>
                          <span className="poke-id">
                              {getPokeId(poke.id)}
                          </span>
                          {/* <Tooltip title="More Info">
                              <Info 
                                onClick={() => {
                                  setShowDialog(!showDialog);
                                  setSelectedPokemon(poke);
                              }}/>
                          </Tooltip> */}
                        </Box>
                        <Box>
                          <Box>
                            {poke.sprites.other.dream_world.front_default ? (
                              <img
                                height="160px"
                                width="100px"
                                alt={getPokeName(poke.name)}
                                src={poke.sprites.other.dream_world.front_default}
                              ></img>
                            ) : null}
                          </Box>
                          <Box>
                            <Typography variant="h5" style={{ fontWeight: "bold"}}>
                              {getPokeName(poke.name)}
                            </Typography>
                          </Box>
                          <Box className="poke-types-container">
                            {types.map(type => {
                              return (
                                <span className="poke-type">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                              )
                            })}
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
        <Dialog
          open={showDialog}
          onClose={() => {
            setShowDialog(!showDialog);
            setSelectedPokemon({});
          }}
        >
          <Card>
            <CardActionArea disableRipple>
              <CardContent
                //className={`${classes.centerAlign} ${classes.cardContent}`}
              >
                <Box style={{ padding: "1rem 0 1rem 0" }}>
                  <Paper
                    //className={`${classes.centerAlign} ${classes.cardImage}`}
                  >
                    <img
                      height="150px"
                      width="150px"
                      alt={getPokeName(selectedPokemon.name)}
                      src={
                        selectedPokemon.sprites.other.dream_world.front_default
                      }
                    ></img>
                  </Paper>
                </Box>
                <Box
                  //className={`${classes.centerAlign} ${classes.flexColumn} ${classes.cardContentBox}`}
                >
                  <Chip
                    size="medium"
                    color="primary"
                    label={getPokeName(selectedPokemon.name)}
                  />
                  <Box
                    //className={`${classes.centerAlign} ${classes.flexColumn} ${classes.flexRow}`}
                  >
                    <Typography
                      //className={`${classes.centerAlign} ${classes.flexColumn}`}
                    >
                      Height: {selectedPokemon.height} m
                    </Typography>
                    <Typography
                      //className={`${classes.centerAlign} ${classes.flexColumn}`}
                    >
                      Weight: {selectedPokemon.weight} kg
                    </Typography>
                  </Box>
                  <Paper
                    //className={classes.tabRoot}
                  >
                    <Tabs
                      value={tabIndex}
                      onChange={(event, item) => {
                        setTabIndex(item);
                      }}
                      textColor="primary"
                    >
                      <Tab label="Stats" disableRipple />
                      <Tab label="Abilities" disableRipple />
                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                      <span>HP</span>{" "}
                      <LinearProgress
                        variant="determinate"
                        value={normalise(selectedPokemon.stats[0].base_stat)}
                      />
                      <span>ATK</span>{" "}
                      <LinearProgress
                        variant="determinate"
                        value={normalise(selectedPokemon.stats[1].base_stat)}
                      />
                      <span>DEF</span>{" "}
                      <LinearProgress
                        variant="determinate"
                        value={normalise(selectedPokemon.stats[2].base_stat)}
                      />
                      <span>SATK</span>{" "}
                      <LinearProgress
                        variant="determinate"
                        value={normalise(selectedPokemon.stats[3].base_stat)}
                      />
                      <span>SDEF</span>{" "}
                      <LinearProgress
                        variant="determinate"
                        value={normalise(selectedPokemon.stats[4].base_stat)}
                      />
                      <span>SPD</span>{" "}
                      <LinearProgress
                        variant="determinate"
                        value={normalise(selectedPokemon.stats[5].base_stat)}
                      />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                      {selectedPokemon.abilities.map((item) => {
                        return (
                          <Chip
                            //className={classes.chipRoot}
                            key={item.ability.name}
                            variant="outlined"
                            size="small"
                            label={item.ability.name}
                          />
                        );
                      })}
                    </TabPanel>
                  </Paper>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Dialog>
      )}
    </div>
  );
};

export default App;
