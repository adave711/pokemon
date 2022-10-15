import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { FormControl , MenuItem, InputLabel , OutlinedInput, Select, Box, Chip } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(option: string, selectedValue: string[], theme: Theme) {
    return {
      fontWeight:
      selectedValue.indexOf(option) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


const MultiSelectComponent = ({ options , handleChange , selectedValue}) => {

 const theme = useTheme();
 
  return (
    <div style={{ textAlign: 'center', marginTop: '20px'}}>
      <FormControl sx={{ m: 1, width: '50%' }} >
        <InputLabel id="demo-multiple-chip-label" style={{ color: '#fff'}}>Select Type</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedValue}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" style={{ color: '#fff'}}/>}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} style={{ color: '#fff'}}/>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          style={{ backgroundColor: '#464346', borderRadius: '25px'}}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              style={getStyles(option, selectedValue, theme)}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default MultiSelectComponent;