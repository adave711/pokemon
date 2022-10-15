import * as React from 'react';
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
  } from '@mui/material';

const PokemonDetailsDialog = ({ selectedPokemon, showDialog, setShowDialog, setSelectedPokemon }) => {

    
    // Method to process the pokemon state values
    const MIN = 0,
        MAX = 200;
    const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

    // Converting the pokemon name first letter uppercase
    const getPokeName = (name) => name.slice(0, 1).toUpperCase() + name.slice(1, name.length);

    // Forming the pokeman id to display
    const getPokeId = (id) => {
    if (id < 10) return `#00${id}`;
    if (id < 100 && id >= 10) return `#0${id}`;
    if (id >= 100) return `#${id}`;
    };
 
  return (
    <>
     <Dialog
          open={showDialog}
          onClose={() => {
            setShowDialog(!showDialog);
            setSelectedPokemon({});
          }}
          style={{ width: '100%'}}
        >
          <Card  style={{ background: '#464346'}}>
            <CardActionArea>
              <CardContent>
                <Box style={{ padding: "1rem 0 1rem 0" }}>
                  <Paper>
                    <img
                      height="150px"
                      width="250px"
                      alt={getPokeName(selectedPokemon.name)}
                      src={
                        selectedPokemon.sprites.other.dream_world.front_default
                      }
                    ></img>
                  </Paper>
                </Box>
                <Box style={{ textAlign: 'center'}}>
                  <Chip
                    size="medium"
                    color="primary"
                    label={getPokeName(selectedPokemon.name)}
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Dialog>
    </>
  );
}

export default PokemonDetailsDialog;