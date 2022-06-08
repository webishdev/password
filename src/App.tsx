import { useMemo, useState } from "react";
import { Mark } from "@mui/base";
import { Box, Button, Divider, InputAdornment, Slider, Stack, Switch, TextField, Typography } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import KeyIcon from '@mui/icons-material/Key';
import genPassword from './genPassword';

function App() {

  const defaultLength = 16;
  const minLength = 4;
  const maxLength = 64;

  const [toggle, setToggle] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);


  const [length, setLength] = useState<number>(defaultLength);
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [digits, setDigits] = useState<boolean>(true);
  const [special, setSpecial] = useState<boolean>(false);

  const password = useMemo<string>(() => {
    return genPassword(length, lowercase, uppercase, digits, special);
  }, [toggle, length, lowercase, uppercase, digits, special]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setLength(defaultLength);
    } else {
      setLength(newValue);
    }
  };

  const copyAvailable = useMemo<boolean>(() => {
    return 'clipboard' in navigator;
  }, []);

  async function copyTextToClipboard(text:string):Promise<void> {
    if (copyAvailable) {
      navigator.clipboard.writeText(text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(password)
      .then(() => {
        // If successful, update the isCopied state value
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const gcd = (a:number, b:number):number => {
    if (b === 0) return a;
    return gcd(b, a % b);
};

  const marks = useMemo<Mark[]>(() => {
    const result:Mark[] = [];

    const g = gcd(minLength, maxLength);

    if (g <= 1) {
      return [];
    }

    for (let step=minLength+g; step<maxLength; step = step + g) {
      result.push({
        value: step,
        label: `${step}`
      })
    }

    return result;
    
  }, [length]);

  return (
    <Box m={2}>
      <Typography variant="h4" component="h1" textAlign="center" m={1}>
        Yet another password generator
      </Typography>
      <Divider />
      <Stack>
        <Stack direction="row" alignItems="center" onClick={() => setLowercase(!lowercase)}>
          <Switch checked={lowercase} onChange={() => setLowercase(!lowercase)} />
          Lowercase
        </Stack>
        <Stack direction="row" alignItems="center" onClick={() => setUppercase(!uppercase)}>
          <Switch checked={uppercase} onChange={() => setUppercase(!uppercase)} />
          Uppercase
        </Stack>
        <Stack direction="row" alignItems="center" onClick={() => setDigits(!digits)}>
          <Switch checked={digits} onChange={() => setDigits(!digits)} />
          Digits
        </Stack>
        <Stack direction="row" alignItems="center" onClick={() => setSpecial(!special)}>
          <Switch checked={special} onChange={() => setSpecial(!special)} />
          Special
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Slider min={minLength} max={maxLength} marks={marks} value={length} onChange={handleSliderChange} />
            <Stack alignItems="center" textAlign="center">Length {length}</Stack>
        </Stack>
        <Stack mt={2} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack flexGrow={1}><TextField value={password} multiline InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start"><KeyIcon /></InputAdornment>
          }} /></Stack>
          <Button variant="contained" onClick={handleCopyClick} disabled={!copyAvailable || copied} endIcon={<ContentCopyIcon />}>{copied ? 'Copied!' : 'Copy'}</Button>
        </Stack>
        <Stack mt={2}>
          <Button variant="contained" size="large" onClick={() => setToggle(!toggle)} endIcon={<RunCircleIcon />}>Generate</Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default App
