import { useState } from "react";

const usePassword = () => {
    const [getLowercase, setLowercase] = useState<boolean>(true);
    const [getUppercase, setUppercase] = useState<boolean>(true);
    const [getDigits, setDigits] = useState<boolean>(true);
    const [getSpecial, setSpecial] = useState<boolean>(false);
    const [getLength, setLength] = useState<number>(32);
}